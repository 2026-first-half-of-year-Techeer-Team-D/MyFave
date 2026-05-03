package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.repository.ShortFormRepository;
import com.myfave.api.domain.content.repository.StyleFeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.myfave.api.domain.content.dto.request.ContentRegisterRequest;
import com.myfave.api.domain.content.dto.response.ContentRegisterResponse;
import com.myfave.api.domain.content.entity.ShortForm;
import com.myfave.api.domain.content.entity.ShortFormType;
import com.myfave.api.domain.content.entity.StyleFeed;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.util.S3UploadService;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final ShortFormRepository shortFormRepository;
    private final StyleFeedRepository styleFeedRepository;
    private final ProductRepository productRepository;
    private final S3UploadService s3UploadService;

    // 9-3. 콘텐츠 등록
    @Transactional
    public ContentRegisterResponse registerContent(
            ContentRegisterRequest request,
            MultipartFile mediaFile,
            MultipartFile thumbnailFile) {

        // 1. 상품 조회
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        // 2. contentType에 따라 분기
        if ("SHORT_FORM".equals(request.getContentType())) {
            // SHORT_FORM: shortFormType, thumbnailFile 필수
            if (request.getShortFormType() == null || thumbnailFile == null) {
                throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
            }

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
}
