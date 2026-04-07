package com.myfave.api.domain.product.entity;

import com.myfave.api.domain.user.entity.User;
import com.myfave.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String productName;

    @Column(length = 255)
    private String shortReview;

    @Column(nullable = false)
    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String size;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionCode conditionCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private CategoryCode categoryCode;

    @Column(nullable = false)
    private Boolean isSoldout = false;

    private ZonedDateTime deletedAt;

    @Builder
    private Product(User user, String productName, String shortReview, Integer price,
                    String description, String size, ConditionCode conditionCode, CategoryCode categoryCode) {
        this.user = user;
        this.productName = productName;
        this.shortReview = shortReview;
        this.price = price;
        this.description = description;
        this.size = size;
        this.conditionCode = conditionCode;
        this.categoryCode = categoryCode;
        this.isSoldout = false;
    }

    public void markAsSoldout() {
        this.isSoldout = true;
    }

    public void softDelete() {
        this.deletedAt = ZonedDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}
