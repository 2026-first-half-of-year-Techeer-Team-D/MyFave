-- =============================================================================
-- V5__add_scenario_d_round1_indexes.sql
-- =============================================================================
-- 목적: 시나리오 D (한정 수량 매진 경쟁) Round 1 측정용
-- 배경: 시나리오 D 본 경로는 PK 조회 (findById, findByIdForUpdate) 위주라
--       인덱스 효과가 거의 없음. 본 마이그레이션의 인덱스는
--       "본 경로 가속"이 아니라 "라운드 검증 SQL 가속" 목적.
-- 검증 SQL 위치: 시나리오 D 명세 §측정 후 검증 SQL ① ③
-- =============================================================================

-- -----------------------------------------------------------------------------
-- [1] order_items.order_id
-- 대상: 검증 SQL ① ③ 의 JOIN 키 (order_items oi JOIN orders o ON oi.order_id = o.id)
-- 효과: nested loop join 의 inner 쪽 비용 감소
-- 주의: FK 가 걸려있어도 PostgreSQL 은 FK 에 자동 인덱스를 생성하지 않음
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items (order_id);

-- -----------------------------------------------------------------------------
-- [2] order_items.product_id
-- 대상: 검증 SQL ③ over-selling 검출
--       SELECT product_id, COUNT(*) FROM order_items ... GROUP BY product_id
-- 효과: GROUP BY 시 HashAggregate 효율 향상
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_order_items_product_id
    ON order_items (product_id);

-- -----------------------------------------------------------------------------
-- [3] orders.order_status (partial)
-- 대상: 검증 SQL ① ③ 의 WHERE o.order_status = 'PAID'
-- 효과: PAID 행만 인덱싱 → 인덱스 크기 최소화 + WHERE 필터 가속
-- 주의: 부하 테스트 환경에서는 매 라운드 reset 직후 PAID = 10건만 존재
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_status_paid
    ON orders (order_status)
    WHERE order_status = 'PAID';

-- -----------------------------------------------------------------------------
-- ANALYZE — 인덱스 추가 후 통계 갱신 필수
-- -----------------------------------------------------------------------------
ANALYZE order_items;
ANALYZE orders;
