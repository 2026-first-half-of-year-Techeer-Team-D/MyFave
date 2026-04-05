# MyFave 스프린트 계획서

> 작성일: 2026-03-31
> 개발 기간: 2026-04-01 ~ 2026-04-28 (4주)
> 최적화 기간: 2026-05-01 ~

---

## 팀 구성 및 도메인 배분

| 팀원 | 담당 도메인 | 배분 근거 |
|------|------------|----------|
| **A** | Order + Payment | Order↔Payment 순환 참조, DIRECT/CART 이중 플로우, PG사 외부 연동까지 긴밀하게 연결된 핵심 커머스 도메인 |
| **B** | Auth + Chat | Auth는 전체 서비스 기반(회원가입/로그인/JWT), Chat은 WebSocket+STOMP+Redis 실시간 통신으로 기술 난이도 높음 |
| **C** | Product + SaleEvent + Content | Product와 Content 모두 S3 파일 업로드를 다루므로 시너지. SaleEvent는 Chat의 선행 의존성이라 Phase 1에서 빠르게 완성 필요 |
| **D** | User + Cart + Shipping + Coupon | 독립적인 CRUD 도메인. User(가장 단순)부터 시작해 점진적으로 난이도를 올리는 구성 |

---

## API 진행 현황 추적표

> 각 API 완료 시 `[ ]` → `[x]`로 체크. 매주 수요일 미팅에서 현황 확인.

### A — Order (5) + Payment (6)

| 상태 | API 번호 | API 이름 | 스프린트 | 비고 |
|------|---------|----------|---------|------|
| [ ] | 5-1 | 주문 생성 (DIRECT/CART) | Sprint 1 | OrderItem 스냅샷, 배송지 스냅샷, 주문번호 생성 |
| [ ] | 5-2 | 주문 목록 조회 | Sprint 1 | 페이지네이션 |
| [ ] | 5-3 | 주문 상세 조회 | Sprint 1 | |
| [ ] | 5-4 | 주문 상태 변경 (구매확정) | Sprint 1 | 취소/환불 상태 로직 포함 |
| [ ] | 6-1 | 결제 생성 | Sprint 2 | PG 연동 전 내부 로직만 (뼈대) |
| [ ] | 6-1 | 결제 생성 — 토스페이먼츠 연동 | Sprint 3 | WebClient, 결제 준비→승인 흐름 |
| [ ] | 6-1 | 결제 생성 — 카카오페이 연동 | Sprint 4 | |
| [ ] | 6-1 | 결제 생성 — 네이버페이 연동 | Sprint 4 | |
| [ ] | - | Order↔Payment 순환 참조 트랜잭션 검증 | Sprint 4 | DEFERRABLE 동작 확인 |
| [ ] | - | 전체 결제 흐름 E2E 테스트 | Sprint 4 | |

### B — Auth (1) + Chat (11, 12)

| 상태 | API 번호 | API 이름 | 스프린트 | 비고 |
|------|---------|----------|---------|------|
| [ ] | 1-1 | 회원가입 | Sprint 1 | |
| [ ] | 1-2 | 로그인 | Sprint 1 | JWT 발급, Refresh Token Redis 저장 |
| [ ] | 1-3 | 토큰 재발급 | Sprint 1 | |
| [ ] | 1-4 | 로그아웃 | Sprint 1 | Redis 블랙리스트 |
| [ ] | 1-5 | 이메일 찾기 | Sprint 1 | |
| [ ] | 11-1 | 채팅방 정보 조회 | Sprint 2 | |
| [ ] | 11-2 | 채팅 메시지 히스토리 조회 | Sprint 2 | Redis List 기반, 커서 페이지네이션 |
| [ ] | 11-3 | 채팅방 종료 (인플루언서) | Sprint 2 | |
| [ ] | 11-4 | 메인 화면 채팅 미리보기 | Sprint 2 | |
| [ ] | 12-1 | WebSocket: 메시지 발행 (SEND_MESSAGE) | Sprint 2 | STOMP, 도배 방지 3초 제한 |
| [ ] | 12-2 | WebSocket: 메시지 구독 (NEW_MESSAGE 등) | Sprint 2 | 참가자 수 브로드캐스트 포함 |
| [ ] | 12-3 | WebSocket: 에러 처리 | Sprint 2 | |
| [ ] | 1-6 | 비밀번호 찾기 — 인증코드 발송 | Sprint 3 | @Async + Redis TTL + JavaMailSender |
| [ ] | 1-7 | 비밀번호 찾기 — 인증코드 확인 | Sprint 3 | |
| [ ] | 1-8 | 비밀번호 찾기 — 비밀번호 재설정 | Sprint 3 | |
| [ ] | 1-9 | 소셜 로그인 (카카오) | Sprint 4 | OAuth2 연동 |
| [ ] | - | SecurityConfig 복구 (.authenticated()) | Sprint 4 | JWT 인증 활성화 |
| [ ] | - | CORS 설정 점검 | Sprint 4 | |

### C — Product (3) + SaleEvent (10) + Content (9)

| 상태 | API 번호 | API 이름 | 스프린트 | 비고 |
|------|---------|----------|---------|------|
| [ ] | 3-1 | 상품 목록 조회 | Sprint 1 | 카테고리/정렬/페이지네이션 |
| [ ] | 3-2 | 상품 상세 조회 | Sprint 1 | |
| [ ] | 10-1 | 현재 판매 이벤트 조회 | Sprint 1 | Chat 선행 의존성 — 빠르게 완성 |
| [ ] | - | 인플루언서용 상품 등록/수정 | Sprint 1 | S3 이미지 업로드 포함 |
| [ ] | - | S3 파일 업로드 공통 서비스 | Sprint 2 | 이미지/GIF/영상 공통 모듈 |
| [ ] | - | 상품 Soft Delete + 품절 처리 | Sprint 2 | |
| [ ] | - | SaleEvent 관리 API (등록/수정) | Sprint 1~2 | 인플루언서용 |
| [ ] | 9-1 | 숏폼 목록 조회 | Sprint 3 | 커서 기반 페이지네이션 |
| [ ] | 9-2 | 스타일 피드 목록 조회 | Sprint 3 | 페이지네이션 |
| [ ] | - | 인플루언서용 콘텐츠 등록 | Sprint 3 | S3 영상/이미지 업로드 재사용 |
| [ ] | - | 상품↔콘텐츠↔판매이벤트 연동 테스트 | Sprint 4 | 크로스 도메인 검증 |

### D — User (2) + Cart (4) + Shipping (7) + Coupon (8)

| 상태 | API 번호 | API 이름 | 스프린트 | 비고 |
|------|---------|----------|---------|------|
| [ ] | 2-1 | 회원 정보 조회 | Sprint 1 | 가장 먼저! CRUD 패턴 학습 |
| [ ] | 2-2 | 회원 정보 수정 | Sprint 1 | PATCH, 닉네임/전화번호 중복 체크 |
| [ ] | 4-1 | 장바구니 목록 조회 | Sprint 1 | |
| [ ] | 4-2 | 장바구니에 상품 추가 | Sprint 1 | 중복 추가 방지 |
| [ ] | 4-3 | 장바구니 개별 삭제 | Sprint 1 | Hard Delete |
| [ ] | 4-4 | 장바구니 전체 삭제 | Sprint 1 | Hard Delete |
| [ ] | 7-1 | 배송지 목록 조회 | Sprint 2 | |
| [ ] | 7-2 | 배송지 추가 | Sprint 2 | |
| [ ] | 7-3 | 배송지 삭제 | Sprint 2 | Hard Delete |
| [ ] | 7-4 | 기본 배송지 설정 | Sprint 2 | 기존 기본 배송지 해제 로직 |
| [ ] | 8-1 | 보유 쿠폰 목록 조회 | Sprint 3 | 상태 필터 (AVAILABLE/USED/EXPIRED) |
| [ ] | 8-2 | 사용자 쿠폰 지급 (인플루언서) | Sprint 3 | CouponMaster 기반 발급 |
| [ ] | - | 쿠폰 사용/만료 처리 로직 | Sprint 3 | |
| [ ] | - | DTO 유효성 검증 전체 적용 | Sprint 4 | @NotBlank, @Size 등 |
| [ ] | - | 쿠폰↔결제 연동 테스트 | Sprint 4 | |

---

## 전체 진행률 요약

| 팀원 | 총 항목 | Phase 1 | Phase 2 | 완료 |
|------|--------|---------|---------|------|
| **A** | 10 | 5 | 5 | /10 |
| **B** | 18 | 12 | 6 | /18 |
| **C** | 11 | 6 | 5 | /11 |
| **D** | 15 | 10 | 5 | /15 |
| **합계** | **54** | **33** | **21** | **/54** |

---

## Phase 1 — 핵심 커머스 플로우 (4/1 ~ 4/14, 2주)

> 목표: 회원가입 → 상품 조회 → 장바구니 → 주문 → 채팅까지 기본 흐름 완성
> JWT 인증 비활성화 상태이므로 모든 도메인 병렬 개발 가능

### Sprint 1 (4/1 ~ 4/7)

| 팀원 | 태스크 | 해당 API |
|------|--------|---------|
| **A** | Order 도메인 전체 | 5-1, 5-2, 5-3, 5-4 |
| **B** | Auth 기본 (회원가입/로그인/JWT) | 1-1, 1-2, 1-3, 1-4, 1-5 |
| **C** | Product 도메인 + SaleEvent | 3-1, 3-2, 10-1 + 상품 등록/수정 |
| **D** | User + Cart | 2-1, 2-2, 4-1, 4-2, 4-3, 4-4 |

### Sprint 2 (4/8 ~ 4/14)

| 팀원 | 태스크 | 해당 API |
|------|--------|---------|
| **A** | Order 고도화 + Payment 기초 | 6-1 (뼈대) |
| **B** | Chat 도메인 전체 | 11-1, 11-2, 11-3, 11-4, 12-1, 12-2, 12-3 |
| **C** | Product 마무리 + S3 공통 서비스 | S3 모듈, Soft Delete, 품절 처리 |
| **D** | Shipping 도메인 | 7-1, 7-2, 7-3, 7-4 |

### Phase 1 완료 기준 체크리스트

- [ ] 회원가입 → 로그인 → JWT 토큰 발급 흐름 정상 동작
- [ ] 상품 목록/상세 조회 + 이미지 S3 업로드 동작
- [ ] 장바구니 추가/삭제/조회 동작
- [ ] 주문 생성(DIRECT, CART 모두) + 상태 관리 동작
- [ ] 배송지 CRUD 동작
- [ ] SaleEvent 조회 동작
- [ ] 채팅방 WebSocket 실시간 메시지 송수신 동작
- [ ] Swagger에서 모든 Phase 1 API 정상 확인

---

## Phase 2 — 결제/쿠폰/콘텐츠 + 고도화 (4/15 ~ 4/28, 2주)

> 목표: 실결제 연동, 쿠폰/콘텐츠 기능, 소셜 로그인, 비밀번호 재설정 등 서비스 완성

### Sprint 3 (4/15 ~ 4/21)

| 팀원 | 태스크 | 해당 API |
|------|--------|---------|
| **A** | Payment PG 연동 (토스페이먼츠) | 6-1 토스 연동 |
| **B** | Auth 고도화 (비밀번호 재설정) | 1-6, 1-7, 1-8 |
| **C** | Content 도메인 전체 | 9-1, 9-2 + 콘텐츠 등록 |
| **D** | Coupon 도메인 전체 | 8-1, 8-2 + 사용/만료 로직 |

### Sprint 4 (4/22 ~ 4/28)

| 팀원 | 태스크 | 해당 API |
|------|--------|---------|
| **A** | Payment 추가 PG + 통합 테스트 | 6-1 카카오페이/네이버페이 + E2E |
| **B** | 카카오 소셜 로그인 + SecurityConfig 복구 | 1-9 + JWT 활성화 |
| **C** | 크로스 도메인 검증 | 상품↔콘텐츠↔판매이벤트 연동 테스트 |
| **D** | 전체 CRUD 검증 + DTO 유효성 | 쿠폰↔결제 연동, @Valid 전체 적용 |

### Phase 2 완료 기준 체크리스트

- [ ] 토스페이먼츠 실결제 흐름 정상 동작
- [ ] 카카오페이/네이버페이 결제 정상 동작
- [ ] 쿠폰 발급→적용→결제 할인 흐름 동작
- [ ] 비밀번호 재설정 이메일 발송→인증→변경 동작
- [ ] 카카오 소셜 로그인 동작
- [ ] JWT 인증 활성화 후 모든 API 정상 동작
- [ ] 콘텐츠(숏폼/스타일피드) CRUD + S3 업로드 동작
- [ ] 전체 도메인 간 연동 E2E 테스트 통과

---

## 도메인 의존성 맵

```
Auth (B)          ← 모든 도메인의 인증 기반 (Phase 1에서는 비활성화)
  ↓
User (D)          ← 회원 정보 관리
  ↓
Product (C)       ← 상품 관리 + S3 이미지
  ↓               ↘
Cart (D)          Content (C)    ← 상품 참조
  ↓
Order (A)       ← Cart + Product + Shipping 참조
  ↓
Payment (A)     ← Order + Coupon(D) 참조

SaleEvent (C)     ← 독립 (Chat의 선행 조건)
  ↓
Chat (B)          ← SaleEvent + User 참조, WebSocket + Redis
```

> JWT 비활성화 덕분에 Phase 1에서 Auth 완성을 기다리지 않고 모든 도메인이 병렬 개발 가능.
> 단, **SaleEvent → Chat** 의존성이 있으므로 C가 Sprint 1에서 SaleEvent를 빠르게 완성해야 B가 Sprint 2에서 Chat 개발 시 참조 가능.

---

## 주간 공통 일정

| 요일 | 내용 |
|------|------|
| 수요일 | 팀 미팅 — 스프린트 진행 현황 공유, 블로커 해결, 다음 주 계획 조정 |

---

## Git 브랜치 운영

```
main
├── develop              ← PR 머지
│   ├── feature/auth       (B)
│   ├── feature/user       (D)
│   ├── feature/product    (C)
│   ├── feature/cart       (D)
│   ├── feature/order      (A)
│   ├── feature/payment    (A)
│   ├── feature/shipping   (D)
│   ├── feature/coupon     (D)
│   ├── feature/content    (C)
│   ├── feature/saleevent  (C)
│   └── feature/chat       (B)
```

---

## D 팀원 온보딩 가이드

D는 백엔드 API 개발이 처음이므로 아래 순서로 학습하며 진행:

1. **User 도메인 먼저** (Sprint 1 전반) — 가장 단순한 CRUD로 Controller→Service→Repository 패턴 학습
2. **Cart 도메인** (Sprint 1 후반) — User와 동일한 패턴이지만 FK 관계(User, Product) 추가 학습
3. **Shipping 도메인** (Sprint 2) — Cart와 유사하지만 기본 배송지 설정 등 약간의 비즈니스 로직 추가
4. **Coupon 도메인** (Sprint 3) — CouponMaster↔Coupon 관계, 상태 변경 로직으로 한 단계 성장

> 첫 PR은 팀원들이 꼼꼼히 리뷰해주면서 코드 컨벤션과 패턴을 잡아주는 것을 권장

---

## 리스크 및 대응 방안

| 리스크 | 대응 |
|--------|------|
| PG사 연동 지연 (API 키 발급 등) | Sprint 3 시작 전(4/14까지) 토스/카카오페이/네이버페이 테스트 키 발급 완료 필요 |
| Chat WebSocket 구현 난이도 | B가 Sprint 2에서 집중할 수 있도록 Sprint 1의 Auth를 빠르게 마무리 |
| D의 학습 속도 | User 도메인 PR 리뷰 후 패턴이 잡히면 Cart는 빠르게 진행될 것. 막힐 경우 페어 프로그래밍 |
| Phase 2에서 JWT 활성화 시 전체 API 깨짐 | Sprint 4 초반에 B가 SecurityConfig 복구하면서 팀 전체가 자기 도메인 인증 테스트 병렬 수행 |
| 외부 서비스 .env 값 미준비 | 아래 타임라인에 맞춰 미리 준비 |

### 외부 서비스 키 준비 타임라인

| 시점 | 준비 항목 |
|------|----------|
| 4/1 전 | Gmail 앱 비밀번호 (MAIL_USERNAME, MAIL_PASSWORD) |
| 4/7 전 | AWS S3 버킷 생성 + IAM 키 (AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET_NAME) |
| 4/14 전 | 토스페이먼츠 테스트 키 (TOSS_SECRET_KEY) |
| 4/14 전 | 카카오 개발자 앱 등록 (KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET) |
| 4/14 전 | 카카오페이 CID (KAKAO_PAY_CID) |
| 4/14 전 | 네이버페이 테스트 키 (NAVER_PAY_CLIENT_ID, NAVER_PAY_CLIENT_SECRET) |
