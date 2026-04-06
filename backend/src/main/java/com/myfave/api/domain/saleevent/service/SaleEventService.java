package com.myfave.api.domain.saleevent.service;

import com.myfave.api.domain.saleevent.dto.request.SaleEventCreateRequest;
import com.myfave.api.domain.saleevent.dto.request.SaleEventUpdateRequest;
import com.myfave.api.domain.saleevent.dto.response.SaleEventCreateResponse;
import com.myfave.api.domain.saleevent.dto.response.SaleEventResponse;
import com.myfave.api.domain.saleevent.dto.response.SaleEventUpdateResponse;
import com.myfave.api.domain.saleevent.entity.SaleEvent;
import com.myfave.api.domain.saleevent.repository.SaleEventRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SaleEventService {

    private final SaleEventRepository saleEventRepository;
    //이벤트 조회
    public SaleEventResponse getCurrentEvent() {
        ZonedDateTime now = ZonedDateTime.now();

        // 1단계: DB에서 지금 진행 중인 이벤트 찾기 (시작 <= now <= 종료)
        Optional<SaleEvent> liveEvent = saleEventRepository.findLiveEvent(now);
        if (liveEvent.isPresent()) {
            return SaleEventResponse.of(liveEvent.get(), true);
        }

        // 2단계: 진행 중인 게 없으면, 아직 안 시작한 가장 가까운 이벤트 찾기
        Optional<SaleEvent> nextEvent = saleEventRepository.findFirstBySaleStartAtAfterOrderBySaleStartAtAsc(now);
        // 있으면 isLive = false로 응답 (프론트에서 카운트다운 표시용)
        if (nextEvent.isPresent()) {
            return SaleEventResponse.of(nextEvent.get(), false);
        }

        // 3단계: 둘 다 없으면 404 에러
        throw new CustomException(ErrorCode.SALE_EVENT_NOT_FOUND);
    }
    //이벤트 등록
    @Transactional //DB에 써야하니까 트랜잭션 처리
    public SaleEventCreateResponse createEvent(SaleEventCreateRequest request) {
        // 검증 1 : 종료시간이 시작시간보다 뒤인지
        if (!request.getSaleEndAt().isAfter(request.getSaleStartAt())) {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }

        // 검증 2 : 시작시간이 현재 시간 이후인지
        if (!request.getSaleStartAt().isAfter(ZonedDateTime.now())) {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }
        // Entity 생성
        SaleEvent saleEvent = SaleEvent.builder()
                .eventName(request.getEventName())
                .saleStartAt(request.getSaleStartAt())
                .saleEndAt(request.getSaleEndAt())
                .build();
        // DB에 저장하고, 결과 Response DTO로 변환
        SaleEvent saved = saleEventRepository.save(saleEvent);
        return SaleEventCreateResponse.from(saved);
    }
    //이벤트 수정
    @Transactional
    public SaleEventUpdateResponse updateEvent(Long saleId, SaleEventUpdateRequest request) {
        // 해당 이벤트가 DB에 있는지 확인, 없으면 404
        SaleEvent saleEvent = saleEventRepository.findById(saleId)
                .orElseThrow(() -> new CustomException(ErrorCode.SALE_EVENT_NOT_FOUND));

        // 종료시간 검증 : saleEndAt이 saleStartAt보다 뒤인지
        ZonedDateTime newStart = request.getSaleStartAt() != null ? request.getSaleStartAt() : saleEvent.getSaleStartAt();
        // 요청에 안 보낸 필드는 기존 값 유지 -> null이면 기존 값으로 대체
        ZonedDateTime newEnd = request.getSaleEndAt() != null ? request.getSaleEndAt() : saleEvent.getSaleEndAt();

        if (!newEnd.isAfter(newStart)) {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }

        // Entity 값 변경 — JPA가 트랜잭션 끝날 때 자동으로 UPDATE 쿼리 날림
        saleEvent.update(request.getEventName(), request.getSaleStartAt(), request.getSaleEndAt());

        return SaleEventUpdateResponse.from(saleEvent); //save() 호출 안 함!
    }
}
