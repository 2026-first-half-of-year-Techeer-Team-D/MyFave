package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.dto.request.ContentRegisterRequest;
import com.myfave.api.domain.content.dto.response.ContentRegisterResponse;
import com.myfave.api.domain.content.dto.response.ShortFormResponse;
import com.myfave.api.domain.content.dto.response.StyleFeedResponse;
import com.myfave.api.domain.content.entity.ShortForm;
import com.myfave.api.domain.content.entity.ShortFormType;
import com.myfave.api.domain.content.entity.StyleFeed;
import com.myfave.api.domain.content.repository.ShortFormRepository;
import com.myfave.api.domain.content.repository.StyleFeedRepository;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.global.common.CursorResponse;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.util.S3UploadService;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;

import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final ShortFormRepository shortFormRepository;
    private final StyleFeedRepository styleFeedRepository;
    private final ProductRepository productRepository;
    private final S3UploadService s3UploadService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${influencer.user-id}")
    private Long influencerUserId;

    // 첫 페이지 cache-aside TTL (짧게 둬서 등록 반영 지연 최소화, 무효화 로직 불필요)
    private static final Duration FEED_CACHE_TTL = Duration.ofSeconds(10);

    // 캐시 직렬화 전용 매퍼 — 필드 접근 허용해 별도 setter 없이 역직렬화
    private static final ObjectMapper CACHE_MAPPER = JsonMapper.builder()
            .visibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
            .build();

    // 9-1. 숏폼 목록 조회 (커서 페이징, 첫 페이지만 캐싱)
    public CursorResponse<ShortFormResponse> getShortForms(ShortFormType type, Long cursor, int size) {
        String cacheKey = cursor == null
                ? "cache:content:short-forms:" + (type == null ? "all" : type.name()) + ":" + size
                : null;
        if (cacheKey != null) {
            CursorResponse<ShortFormResponse> cached = readCache(cacheKey, ShortFormResponse.class);
            if (cached != null) return cached;
        }
        // hasNext 판별 위해 size+1개 조회
        List<ShortForm> rows = shortFormRepository.findByCursor(type, cursor, PageRequest.of(0, size + 1));
        CursorResponse<ShortFormResponse> response =
                toCursorResponse(rows, size, ShortFormResponse::from, ShortForm::getShortFormId);
        if (cacheKey != null) writeCache(cacheKey, response);
        return response;
    }

    // 9-2. 스타일 피드 목록 조회 (커서 페이징, 첫 페이지만 캐싱)
    public CursorResponse<StyleFeedResponse> getStyleFeeds(Long cursor, int size) {
        String cacheKey = cursor == null ? "cache:content:style-feeds:" + size : null;
        if (cacheKey != null) {
            CursorResponse<StyleFeedResponse> cached = readCache(cacheKey, StyleFeedResponse.class);
            if (cached != null) return cached;
        }
        List<StyleFeed> rows = styleFeedRepository.findByCursor(cursor, PageRequest.of(0, size + 1));
        CursorResponse<StyleFeedResponse> response =
                toCursorResponse(rows, size, StyleFeedResponse::from, StyleFeed::getStyleFeedId);
        if (cacheKey != null) writeCache(cacheKey, response);
        return response;
    }

    // 캐시 조회 — Redis 장애·역직렬화 실패 모두 캐시 미스로 처리해 DB 폴백
    private <R> CursorResponse<R> readCache(String key, Class<R> itemType) {
        try {
            Object raw = redisTemplate.opsForValue().get(key);
            if (raw == null) return null;
            JavaType type = CACHE_MAPPER.getTypeFactory()
                    .constructParametricType(CursorResponse.class, itemType);
            return CACHE_MAPPER.readValue(raw.toString(), type);
        } catch (Exception e) {
            // Redis 다운(DataAccessException) 포함 — 조회는 DB로 폴백
            return null;
        }
    }

    // 캐시 적재 — Redis 장애·직렬화 실패해도 조회는 정상 동작하도록 예외 무시
    private void writeCache(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, CACHE_MAPPER.writeValueAsString(value), FEED_CACHE_TTL);
        } catch (Exception e) {
            // 캐싱 실패 무시 (Redis 다운 포함)
        }
    }

    // 커서 응답 변환 — size+1 조회분으로 hasNext 판별, 마지막 항목 id를 nextCursor로
    private <E, R> CursorResponse<R> toCursorResponse(
            List<E> rows, int size, Function<E, R> mapper, Function<E, Long> idExtractor) {
        boolean hasNext = rows.size() > size;
        List<E> page = hasNext ? rows.subList(0, size) : rows;
        List<R> items = page.stream().map(mapper).toList();
        // 다음 페이지가 있을 때만 커서 발급 — 마지막 페이지는 null로 불필요 요청 차단
        Long nextCursor = hasNext ? idExtractor.apply(page.get(page.size() - 1)) : null;
        return CursorResponse.of(items, nextCursor, hasNext);
    }

    // 9-3. 콘텐츠 등록
    @Transactional
    public ContentRegisterResponse registerContent(
            Long userId,
            ContentRegisterRequest request,
            MultipartFile mediaFile,
            MultipartFile thumbnailFile) {

        // 0. 인플루언서 권한 검증
        if (!influencerUserId.equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // 1. 상품 조회 (soft-delete된 상품 제외)
        Product product = productRepository.findByProductIdAndDeletedAtIsNull(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        // 2. contentType에 따라 분기
        if ("SHORT_FORM".equals(request.getContentType())) {
            // SHORT_FORM: shortFormType, thumbnailFile 필수
            if (request.getShortFormType() == null || thumbnailFile == null) {
                throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
            }

            // 파일 형식 검증
            validateShortFormMediaFile(mediaFile);
            validateImageFile(thumbnailFile);

            // S3 업로드 (영상 + 썸네일)
            String videoUrl = s3UploadService.upload(mediaFile, "contents/shortforms");
            String thumbnailUrl = s3UploadService.upload(thumbnailFile, "contents/shortforms/thumbnails");

            // ShortForm Entity 생성 및 저장
            ShortForm shortForm = ShortForm.builder()
                    .product(product)
                    .displayType(ShortFormType.valueOf(request.getShortFormType()))
                    .videoUrl(videoUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .build();

            shortFormRepository.save(shortForm);
            return ContentRegisterResponse.fromShortForm(shortForm);

        } else if ("STYLE_FEED".equals(request.getContentType())) {
            // 파일 형식 검증
            validateImageFile(mediaFile);

            // STYLE_FEED: 이미지만 업로드
            String imageUrl = s3UploadService.upload(mediaFile, "contents/stylefeeds");

            // StyleFeed Entity 생성 및 저장
            StyleFeed styleFeed = StyleFeed.builder()
                    .product(product)
                    .imageUrl(imageUrl)
                    .build();

            styleFeedRepository.save(styleFeed);
            return ContentRegisterResponse.fromStyleFeed(styleFeed);

        } else {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }
    }

    // 파일 확장자 추출
    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new CustomException(ErrorCode.FILE_INVALID_TYPE);
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    // SHORT_FORM mediaFile은 mp4만 허용
    private void validateShortFormMediaFile(MultipartFile mediaFile) {
        String ext = extractExtension(mediaFile.getOriginalFilename());
        if (!"mp4".equals(ext)) {
            throw new CustomException(ErrorCode.FILE_INVALID_TYPE);
        }
    }

    // STYLE_FEED mediaFile, thumbnailFile은 jpg/jpeg/png만 허용
    private void validateImageFile(MultipartFile file) {
        String ext = extractExtension(file.getOriginalFilename());
        if (!"jpg".equals(ext) && !"jpeg".equals(ext) && !"png".equals(ext)) {
            throw new CustomException(ErrorCode.FILE_INVALID_TYPE);
        }
    }
}