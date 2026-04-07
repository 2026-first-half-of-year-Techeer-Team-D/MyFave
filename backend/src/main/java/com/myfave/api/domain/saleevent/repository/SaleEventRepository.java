package com.myfave.api.domain.saleevent.repository;

import com.myfave.api.domain.saleevent.entity.SaleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.Optional;

public interface SaleEventRepository extends JpaRepository<SaleEvent, Long> {

    // 다음 예정된 판매 이벤트 (홈화면 카운트다운)
    // now 이후에 시작하는 이벤트 중 가장 빠른 거 1개
    Optional<SaleEvent> findFirstBySaleStartAtAfterOrderBySaleStartAtAsc(ZonedDateTime now);

    // 현재 진행 중인 이벤트 (is_live)
    // 메소드 이름 너무 길어져서 @Query로 작성함
    @Query("SELECT s FROM SaleEvent s WHERE :now BETWEEN s.saleStartAt AND s.saleEndAt")
    Optional<SaleEvent> findLiveEvent(ZonedDateTime now);
}
