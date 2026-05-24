-- products: soft-delete 패턴 부분 인덱스 (40% 트래픽 — GET /products/{id}, GET /products)
CREATE INDEX IF NOT EXISTS idx_products_not_deleted
  ON products(product_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_category_not_deleted
  ON products(category_code) WHERE deleted_at IS NULL;

ANALYZE products;

-- coupons: 사용자별 상태 조회 + 만료 UPDATE 쿼리 (15% 트래픽 — GET /coupons)
CREATE INDEX IF NOT EXISTS idx_coupons_user_status
  ON coupons(user_id, status);

CREATE INDEX IF NOT EXISTS idx_coupons_user_status_expired
  ON coupons(user_id, status, expired_at);

ANALYZE coupons;

-- orders: 사용자별 최신순 조회 (15% 트래픽 — POST /orders 후 조회)
CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON orders(user_id, created_at DESC);

ANALYZE orders;
