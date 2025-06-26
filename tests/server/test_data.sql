INSERT INTO users (username, password)
VALUES
  ('Alice', 'pbkdf2:sha256:50000$TCI4GzcX$0de171a4f4dac32e3364c7ddc7c14f3e2fa61f2d17574483f7ffbb431b4acb2f'),
  ('Bob', 'pbkdf2:sha256:50000$kJPKsz6N$d2d4784f1b030a9761f5ccaeeaca413f27f2ecb76d6168407af962ddce849f79');

INSERT INTO room_types
  (type_name, base_price_per_night, amenities, photo, max_occupants, modified_by_id)
VALUES
  ("Superior Double", 130.0, "King-size bed, bath, sea views", "superior_room.jpg", 2, 1),
  ("Classic Double", 115.0, "King-size bed, shower, tea and coffee", "classic_double_room.jpg", 1, 1);

INSERT INTO rooms
  (room_number, room_type, modified_by_id)
VALUES
  (1, 2, 1),
  (101, 1, 1);

INSERT INTO reservation_status
  (status, description, bg_color)
VALUES
  ("Confirmed","Reservation has been confirmed by email.", "#c3f457"),
  ("Checked-in","Guest has checked into their room.", "");

INSERT INTO guests 
  (guest_name, email, telephone, address_1, address_2, city, county, postcode, modified, modified_by_id)
VALUES
  ("Alice Johnson", "alice.johnson@example.com", "+44 20 7123 4581", "67 Cherry St", "Apt 2A", "Liverpool", "Merseyside", "L1 1AA", "2024-05-30 12:59:24", 1),
  ("Chris Brown", "chris.brown@example.com", "+44 20 7123 4571", "202 Birch Ln", "Ste 9", "Glasgow", "Strathclyde", "G1 5AA", "2024-01-30 08:02:01", 1);

INSERT INTO reservations
  (start_date,
  end_date,
  computed_total_price,
  special_offer_applied_title,
  special_offer_discount,
  guest_id,
  guest_arrival_time,
  guest_transport_method,
  guest_marketing_source,
  number_of_guests,
  status_id,
  modified_by_id)
VALUES
  ("2024-05-17","2024-05-20",130.0,"",0,1,"15:00","Car","Search Engine",2,1,1),
  ("2024-05-20","2024-05-23",145.0,"",0,1,"16:00","Train","Email",1,2,1);


INSERT INTO special_offers
  (title, room_type, price_per_night, start_date, end_date, is_enabled, modified_by_id)
VALUES
  ("Some offer", 2, 120, "2024-08-01", "2024-08-31", 1, 1),
  ("Another offer", 1, 100, "2024-08-01", "2024-08-31", 1, 1);

INSERT INTO invoices
  (reservation_id, amount_paid, modified, modified_by_id)
VALUES
  (1, 0, "2024-05-30 12:59:24", 1),
  (2, 50, "2024-05-31 15:59:24", 1);

INSERT INTO invoice_items
  (invoice_id, item_description, is_room, quantity, price, total, modified_by_id)
VALUES
  (2, "Superior Double", 1, 3, 130.0, 390.0, 1),
  (2, "Dinner", 0, 2, 25.0, 50.0, 1),
  (1, "Four Poster Nest", 1, 5, 145.0, 725.0, 1),
  (1, "Dinner", 0, 2, 25.0, 50.0, 1),
  (1, "Drinks", 0, 4, 2.5, 10.0, 1);

INSERT INTO payments
  (invoice_id, amount, modified_by_id)
VALUES
  (1,90,1),
  (2,50,1);

INSERT INTO marketing_sources
  (id, source_name)
VALUES
  (1, "Search Engine"),
  (2, "Email");

INSERT INTO transport_methods
  (id, transport_name)
VALUES
  (1 , "Car"),
  (2 , "Train");

INSERT INTO join_rooms_reservations
  (room_id, reservation_id)
VALUES
  (1, 1),
  (2, 2);
 