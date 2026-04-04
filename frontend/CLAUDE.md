# MyFave Frontend Guide (Token-Optimized)

## 1. Frontend Core Rules
- **Stack**: React, TypeScript (TSX)
- **Component**: Functional Components, Hooks (Zustand/Context API 선호)
- **File Naming**: CamelCase (ex: `shoppingCart.tsx`), 첫 글자 소문자.

## 2. UI/UX & Styling Standards
- **CSS Units**: `rem`, `%` 필수 (`px` 절대 금지).
- **Structure**: `atomic design` 패턴을 지향하며 `components/common`에 공통 UI를 관리하세요.
- **Variables**: `let`, `const`만 사용 (`var` 금지).

## 3. API Communication
- **Client**: Axios 또는 Fetch (API Prefix: `/api/v1`)
- **Format**: `ApiResponse<T>`의 `data` 필드를 파싱하여 화면에 렌더링하세요.
- **Error Handling**: `code`와 `message`를 기반으로 사용자에게 알림 메시지를 표시하세요.

## 4. Build & Run Commands (Placeholder)
- **Install**: `npm install`
- **Run**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint --fix`

## 5. Token Saving Rules
- **UI Tweaks**: 전체 페이지 코드를 다시 쓰지 말고, 변경이 필요한 CSS Class나 JSX 엘리먼트만 교체하세요.
- **Asset Usage**: 이미지/아이콘은 `assets/` 폴더 내 기존 파일을 먼저 확인하고, 없으면 생성하세요.
