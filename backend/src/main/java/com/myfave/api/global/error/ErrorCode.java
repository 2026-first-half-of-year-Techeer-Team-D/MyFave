package com.myfave.api.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 공통
    COMMON_INVALID_INPUT(400, "입력값 유효성 검증 실패"),
    COMMON_INTERNAL_ERROR(500, "서버 내부 오류"),
    COMMON_METHOD_NOT_ALLOWED(405, "허용되지 않은 HTTP 메서드"),

    // 인증
    AUTH_UNAUTHORIZED(401, "인증 토큰 없음 또는 만료"),
    AUTH_FORBIDDEN(403, "접근 권한 없음"),
    AUTH_INVALID_CREDENTIALS(401, "아이디 또는 비밀번호 불일치"),
    AUTH_INVALID_REFRESH_TOKEN(401, "유효하지 않은 리프레시 토큰"),
    AUTH_EXPIRED_REFRESH_TOKEN(401, "만료된 리프레시 토큰"),
    AUTH_TOO_MANY_REQUESTS(429, "인증코드 발송 요청 초과"),
    AUTH_INVALID_VERIFICATION_CODE(400, "인증코드 불일치"),
    AUTH_EXPIRED_VERIFICATION_CODE(400, "인증코드 만료"),
    AUTH_PASSWORD_MISMATCH(400, "비밀번호 확인 불일치"),
    AUTH_INVALID_RESET_TOKEN(401, "유효하지 않은 재설정 토큰"),
    AUTH_INVALID_SOCIAL_CODE(400, "유효하지 않은 인가 코드"),
    AUTH_SOCIAL_PROVIDER_ERROR(502, "소셜 제공자 서버 오류"),

    // 사용자
    USER_NOT_FOUND(404, "회원 정보 없음"),
    USER_DUPLICATE_LOGIN_ID(409, "이미 존재하는 아이디"),
    USER_DUPLICATE_NICKNAME(409, "이미 존재하는 닉네임"),
    USER_DUPLICATE_PHONE(409, "이미 등록된 전화번호"),
    USER_DUPLICATE_EMAIL(409, "이미 등록된 이메일"),

    // 상품
    PRODUCT_NOT_FOUND(404, "존재하지 않는 상품"),
    PRODUCT_SOLD_OUT(409, "품절된 상품"),

    // 장바구니
    CART_ALREADY_EXISTS(409, "이미 장바구니에 있는 상품"),
    CART_ITEM_NOT_FOUND(404, "존재하지 않는 장바구니 항목"),

    // 주문
    ORDER_NOT_FOUND(404, "존재하지 않는 주문"),
    ORDER_INVALID_STATUS(409, "주문 상태 변경 불가"),
    ORDER_INVALID_ORDER_TYPE(400, "유효하지 않은 주문 유형"),
    ORDER_PAYMENT_FAILED(502, "외부 결제 서비스 오류"),

    // 배송지
    SHIPPING_ADDRESS_NOT_FOUND(404, "존재하지 않는 배송지"),

    // 쿠폰
    COUPON_NOT_FOUND(404, "존재하지 않는 쿠폰"),
    COUPON_ALREADY_USED(409, "이미 사용된 쿠폰"),
    COUPON_EXPIRED(409, "만료된 쿠폰"),
    COUPON_TYPE_MISMATCH(409, "쿠폰 타입 불일치"),
    COUPON_MASTER_NOT_FOUND(404, "존재하지 않는 마스터 쿠폰"),
    COUPON_MASTER_INACTIVE(409, "비활성화된 마스터 쿠폰"),

    // 판매 이벤트
    SALE_EVENT_NOT_FOUND(404, "예정된 판매 이벤트 없음"),

    // 채팅
    CHAT_ROOM_NOT_FOUND(404, "현재 활성화된 채팅방 없음"),
    CHAT_ROOM_ALREADY_CLOSED(409, "이미 종료된 채팅방"),
    CHAT_RATE_LIMITED(429, "도배 방지 제한"),
    CHAT_INVALID_MESSAGE(400, "메시지 형식 오류"),
    CHAT_MESSAGE_TOO_LONG(400, "메시지 길이 초과"),
    ;

    private final int httpStatus;
    private final String message;
}
