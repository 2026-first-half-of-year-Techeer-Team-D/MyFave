CREATE INDEX IF NOT EXISTS idx_chat_rooms_sale_active
  ON chat_rooms(sale_id, is_active);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_is_active
  ON chat_rooms(is_active);

ANALYZE chat_rooms;
