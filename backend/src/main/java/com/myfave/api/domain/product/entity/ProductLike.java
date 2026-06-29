package com.myfave.api.domain.product.entity;

import com.myfave.api.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.ZonedDateTime;

/**
 * 상품 좋아요 — User↔Product 조인 (회원당 상품 1번, unique 제약으로 멱등 보장)
 * 좋아요는 정확성·중복방지가 필요해 Redis 누적이 아닌 DB 동기 반영 (조회수와 대비)
 */
@Entity
@Table(name = "product_likes",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_product_like_user_product",
                columnNames = {"user_id", "product_id"}))
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_like_id")
    private Long productLikeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @CreatedDate
    @Column(updatable = false)
    private ZonedDateTime createdAt;

    @Builder
    private ProductLike(User user, Product product) {
        this.user = user;
        this.product = product;
    }
}
