# MyFave Frontend Development Context (v1.0)

이 문서는 MyFave 프론트엔드 품질 고도화 작업을 담당하는 차기 AI 에이전트를 위한 핵심 지침서입니다. 모든 작업은 Figma 디자인 명세와 **수학적으로 100.0000% 일치**해야 함을 원칙으로 합니다.

## 🎯 Overall Goal
- **Figma Synchronicity**: 모든 UI 요소는 Node 2:4623, 406:158-162 등의 명세와 0.1px의 오차 없이 일치해야 함.
- **Design Integrity**: 정밀한 HEX 코드 사용, 376.04px 고정 너비 유지, 1.096px 단위의 미세 테두리 적용.

## 🎨 Design System Standards (Learned from Figma)
- **Primary Colors**:
  - Point: `#FF95B3` | Main BG: `#FFECF2` | Secondary BG/Footer: `#FAFAF8`
  - Text: `#322927` (Dark), `#8B7E74` (Muted), `#CF879B` (Accent/Chat)
  - Separator/Border: `#F2EDEB`
- **Layout Logic**:
  - **Width**: `max-w-[376.04px]` (App Container)
  - **Padding**: Global horizontal padding is `19.99px`.
  - **Dividers**: Section separators are exactly `8px` height with `#F2EDEB`.
  - **Borders**: Stroke weights for list items and cards are precisely `1.09633px`.
- **Typography**:
  - Noto Sans KR 기반. 닉네임/타이틀(16px Medium), 일반 텍스트(12px Regular/Medium), 보조 라벨(11px).

## 🏗️ Key Architectural Logic
1.  **Checkout Synchronization**:
    - `localStorage`를 브라우저 내 '임시 상태 저장소'로 활용함.
    - `active_checkout_items`: 상품 상세 또는 장바구니에서 결제 단계로 넘어온 상품 리스트.
    - `finalOrderItems` / `finalOrderCoupon`: 결제 완료 페이지에서 상세 정보를 복원하기 위한 최종 주문 데이터.
2.  **External Redirection**:
    - "1:1 문의"는 로컬 페이지가 아닌 **인스타그램 DM(`https://www.instagram.com/direct/inbox/`)**으로 직접 연결함.
3.  **Environment Stability**:
    - `SockJS` 호환성을 위해 `main.tsx`와 `vite.config.ts`에 `global` 폴리필이 주입되어 있음. (화면 깨짐 방지)

## 🏁 Task Status & History

### [COMPLETED]
- **My Page 100% Sync**: 프로필(56px), 주문 현황 그리드(74.12px), 8px 구분선 및 51px 높이의 리스트 메뉴 구현 완료.
- **Payment & Order Success**: 사용자가 선택한 쿠폰 및 상품 리스트가 주문 완료 시점까지 실시간 연동되도록 로직 구축.
- **Shipping UI Fine-tuning**: 배송지 등록 폼의 체크박스(1.3배 확대), 좌측 정렬, 입력창 간격 밀착 보정 완료.
- **Inquiry Link Redirection**: SideMenu와 Footer의 문의 링크를 인스타그램 DM으로 전환 및 기존 `InquiryPage` 삭제.

### [IN PROGRESS / TODO]
- **Final Audit**: 전체 페이지에 대한 여백, 폰트 웨이트, 쉐도우 효과 최종 Pixel-Perfect 검수.
- **API Integration**: 현재 `localStorage` 기반의 목업 데이터를 실제 백엔드 API와 연결하는 작업 대기 중.

## ⚠️ Important Implementation Rules
- **Commit Rule**: 파일 수정당 1개의 커밋을 생성하며, 메시지 형식은 `"tag: filename description"`을 준수함.
- **Unit Precision**: HSL 대신 반드시 **HEX**를 사용하며, Figma 수치 그대로 tailwind의 임의 수치(`-[...]`)를 적극 활용함.
