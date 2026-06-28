-- 조회수 카운터 컬럼 — Redis write-back 대상
-- 주의: Flyway 미동작(기록용). 운영(prod, ddl-auto=none)은 수동 psql 적용 필요
-- DEFAULT 있는 컬럼 추가는 PostgreSQL에서 즉시·무중단
ALTER TABLE style_feeds ADD COLUMN IF NOT EXISTS view_count BIGINT NOT NULL DEFAULT 0;
ALTER TABLE short_forms ADD COLUMN IF NOT EXISTS view_count BIGINT NOT NULL DEFAULT 0;
