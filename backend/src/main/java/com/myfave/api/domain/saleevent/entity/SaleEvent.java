package com.myfave.api.domain.saleevent.entity;

import com.myfave.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "sale_events")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SaleEvent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private Long saleId;

    @Column(nullable = false, length = 100)
    private String eventName;

    @Column(nullable = false)
    private ZonedDateTime saleStartAt;

    @Column(nullable = false)
    private ZonedDateTime saleEndAt;

    @Builder
    private SaleEvent(String eventName, ZonedDateTime saleStartAt, ZonedDateTime saleEndAt) {
        this.eventName = eventName;
        this.saleStartAt = saleStartAt;
        this.saleEndAt = saleEndAt;
    }
}
