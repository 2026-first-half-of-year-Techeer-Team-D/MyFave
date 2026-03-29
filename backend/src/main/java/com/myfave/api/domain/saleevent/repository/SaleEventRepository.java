package com.myfave.api.domain.saleevent.repository;

import com.myfave.api.domain.saleevent.entity.SaleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.Optional;

public interface SaleEventRepository extends JpaRepository<SaleEvent, Long> {

    // 다음 예정된 판매 이벤트 (홈화면 카운트다운)
    Optional<SaleEvent> findFirstByOrderBySaleStartAtAsc();

    // 현재 진행 중인 이벤트 (is_live)
    @Query("SELECT s FROM SaleEvent s WHERE :now BETWEEN s.saleStartAt AND s.saleEndAt")
    Optional<SaleEvent> findLiveEvent(ZonedDateTime now);
}
