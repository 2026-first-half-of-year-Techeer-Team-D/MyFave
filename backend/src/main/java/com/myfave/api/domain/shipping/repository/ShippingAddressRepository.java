package com.myfave.api.domain.shipping.repository;

import com.myfave.api.domain.shipping.entity.ShippingAddress;
import com.myfave.api.domain.user.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {

    // 사용자의 배송지 목록
    List<ShippingAddress> findByUser(User user);

    // 기본 배송지
    Optional<ShippingAddress> findByUserAndIsDefaultTrue(User user);

    // 기본 배송지 (비관적 락 — 동시성 제어용)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShippingAddress s WHERE s.user = :user AND s.isDefault = true")
    Optional<ShippingAddress> findByUserAndIsDefaultTrueForUpdate(@Param("user") User user);
}
