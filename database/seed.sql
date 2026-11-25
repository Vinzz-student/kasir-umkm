USE kasir_umkm;

INSERT INTO categories (name)
VALUES
  ('Makanan'),
  ('Minuman'),
  ('Camilan')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

INSERT INTO store_hours (id, open_time, close_time)
VALUES (1, '08:00:00', '17:00:00')
ON DUPLICATE KEY UPDATE
  id = VALUES(id);
