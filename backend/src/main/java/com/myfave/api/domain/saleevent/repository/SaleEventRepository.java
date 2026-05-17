package com.myfave.api.domain.saleevent.repository;

import com.myfave.api.domain.saleevent.entity.SaleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface SaleEventRepository extends JpaRepository<SaleEvent, Long> {

    Optional<SaleEvent> findFirstBySaleStartAtAfterOrderBySaleStartAtAsc(ZonedDateTime now);

    @Query("SELECT s FROM SaleEvent s WHERE :now BETWEEN s.saleStartAt AND s.saleEndAt")
    Optional<SaleEvent> findLiveEvent(ZonedDateTime now);

    List<SaleEvent> findBySaleStartAtAfter(ZonedDateTime now);
}
