-- 상품 좋아요 — 좋아요 수 비정규화 컬럼 + 좋아요 조인 테이블
-- 주의: Flyway 미동작(기록용). 운영(prod, ddl-auto=none)은 수동 psql 적용 필요
ALTER TABLE products ADD COLUMN IF NOT EXISTS like_count BIGINT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS product_likes (
    product_like_id BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(user_id),
    product_id BIGINT NOT NULL REFERENCES products(product_id),
    created_at TIMESTAMPTZ,
    CONSTRAINT uq_product_like_user_product UNIQUE (user_id, product_id)
);

-- 좋아요 토글 시 회원-상품 중복 체크 조회용
CREATE INDEX IF NOT EXISTS idx_product_likes_product ON product_likes(product_id);
-- 좋아요순 정렬(ORDER BY like_count DESC)용
CREATE INDEX IF NOT EXISTS idx_products_like_count ON products(like_count DESC);
