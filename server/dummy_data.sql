-- Create default admin account with password 'dev'
INSERT INTO users (username, password)
  VALUES 
    ("admin","scrypt:32768:8:1$qJPjpVKh4Fral5mv$b75a4aed584520875c127fa655a42cdd578e5614600e7b7be23479db6ca50f945ede38ff38da8d8aea72d06e3094cfece2e7d713d2f4b31f8a47c090828f2842" ),
    ("admin2","scrypt:32768:8:1$qJPjpVKh4Fral5mv$b75a4aed584520875c127fa655a42cdd578e5614600e7b7be23479db6ca50f945ede38ff38da8d8aea72d06e3094cfece2e7d713d2f4b31f8a47c090828f2842" )
;

-- Insert room_types
INSERT INTO room_types
  (type_name, base_price_per_night, amenities, photo, max_occupants, modified_by_id)
VALUES
  ("Four Poster Nest", 145.0, "King-size bed, shower, bath", "four_poster_nest.jpg", 3, 1),
  ("Superior Double", 130.0, "King-size bed, shower, bath", "superior_room.jpg", 2, 1),
  ("Classic Double", 115.0, "King-size bed, shower, bath", "classic_double_room.jpg", 2, 1)
;

-- Insert rooms
INSERT INTO rooms
  (room_number, room_type_id, modified_by_id)
VALUES
  (1, 2, 1),
  (2, 1, 1),
  (3, 2, 1),
  (6, 3, 1),
  (7, 2, 1),
  (8, 3, 1),
  (9, 2, 1)
;

-- Insert reservation status
INSERT INTO reservation_status
  (status, description, bg_color)
VALUES
  ("Pending", "Reservation is not confirmed", "#cae6f6"),
  ("Confirmed","Reservation has been confirmed by email.", "#c3f457"),
  ("Checked-in","Guest has checked into their room.", "#f8e45c"),
  ("Paid in Full","Reservation invoice has been paid.", "#34c4d9"),
  ("Cancelled","Reservation has been cancelled.", "#f66151")
;

-- Insert dummy guest data
INSERT INTO guests 
  (guest_name, email, telephone, address_1, address_2, city, county, postcode, modified_by_id)
VALUES
  ("John Doe", "john.doe@example.com", "+44 20 7123 4567", "123 Elm St", "Apt 4B", "London", "Greater London", "W1A 1AA", 1),
  ("Jane Smith", "jane.smith@example.com", "+44 20 7123 4568", "456 Oak Ave", "Suite 300", "Manchester", "Greater Manchester", "M1 2AA", 1),
  ("Michael Johnson", "michael.johnson@example.com", "+44 20 7123 4569", "789 Pine Rd", "Unit 12", "Birmingham", "West Midlands", "B1 3AA", 1),
  ("Emily Davis", "emily.davis@example.com", "+44 20 7123 4570", "101 Maple Dr", "Floor 5", "Leeds", "West Yorkshire", "LS1 4AA", 1),
  ("Chris Brown", "chris.brown@example.com", "+44 20 7123 4571", "202 Birch Ln", "Ste 9", "Glasgow", "Strathclyde", "G1 5AA", 1),
  ("Amanda Wilson", "amanda.wilson@example.com", "+44 20 7123 4572", "303 Cedar Blvd", "Rm 7", "Edinburgh", "Lothian", "EH1 6AA", 1),
  ("Robert Miller", "robert.miller@example.com", "+44 20 7123 4573", "404 Willow St", "Bldg 8", "Cardiff", "South Glamorgan", "CF1 7AA", 1),
  ("Sarah Taylor", "sarah.taylor@example.com", "+44 20 7123 4574", "505 Redwood Way", "Fl 3", "Belfast", "County Antrim", "BT1 8AA", 1)
;

-- Insert dummy reservations
INSERT INTO reservations
  (start_date,
  end_date,
  special_offer_applied_title,
  special_offer_discount,
  guest_id,
  guest_arrival_time,
  guest_transport_method,
  guest_marketing_source,
  status_id,
  modified_by_id)
VALUES
  ("2024-09-17","2024-09-20","",0,5,"15:00","Car","Search Engine",2,1),
  ("2024-08-20","2024-08-25","125 discount",125,4,"16:00","Train","Booking.com",4,1),
  ("2024-09-08","2024-09-12","",0,2,"14:30","Plane","TripAdvisor",3,1),
  ("2024-09-01","2024-09-05","",0,8,"17:00","Car","Stayed Before",2,1),
  ("2024-09-03","2024-09-07","",0,4,"15:30","Bicycle","Instagram",5,1),
  ("2024-09-10","2024-09-14","",0,7,"16:15","Motorhome","Facebook",2,1),
  ("2024-09-19","2024-09-23","",0,3,"13:45","Train","Email",2,1),
  ("2024-09-12","2024-09-19","",0,6,"15:00","Car","Recommendation",1,1),
  ("2024-09-08","2024-09-12","",0,1,"14:00","Coach","Other",3,1),
  ("2025-06-15","2025-06-20","",0,1,"14:00","Taxi","Other",3,1),
  ("2025-06-08","2025-06-12","",0,1,"14:00","Coach","",5,1)
;

INSERT INTO special_offers
  (title, room_type, price_per_night, start_date, end_date, is_enabled, modified_by_id)
VALUES
  ("August 2024 - Superior Double", 2, 120, "2024-08-01", "2024-08-31", 1, 1),
  ("August 2024 - Four Poster", 1, 100, "2024-08-01", "2024-08-31", 1, 1),
  ("June 2025 - Four Poster", 1, 100, "2025-06-01", "2025-06-30", 1, 1),
  ("June 2025 - Superior Double", 2, 120, "2025-06-01", "2025-06-30", 1, 1),
  ("June 2025 - Superior Double Special", 2, 50, "2025-06-01", "2025-06-30", 1, 1),
  ("June 2025 - Disabled", 2, 5000, "2025-06-01", "2025-06-30", 0, 1)
;

INSERT INTO invoices
  (reservation_id, modified_by_id)
VALUES
  (2, 1),
  (1, 1)
;

INSERT INTO invoice_items
  (invoice_id, item_description, is_room, quantity, price, modified_by_id)
VALUES
  (2, "Superior Double", 1, 3, 130.0, 1),
  (2, "Dinner", 0, 2, 25.0, 1),
  (1, "Four Poster Nest", 1, 5, 145.0, 1),
  (1, "Dinner", 0, 2, 25.0, 1),
  (1, "Drinks", 0, 4, 2.5, 1)
;

INSERT INTO payments
  (invoice_id, entered_date, amount, modified_by_id)
VALUES
  (2,"2025-05-30",390,1),
  (2,"2025-05-31",90,1),
  (2,"2025-06-02",45,1),
  (1,"2025-05-30",600,1)
;


INSERT INTO marketing_sources
  (id, source_name)
VALUES
  (1, "Search Engine"),
  (2, "Email"),
  (3, "Accommodation guide"),
  (4, "Stayed Before"),
  (5, "Recommendation"),
  (6, "Instagram"),
  (7, "Facebook"),
  (8, "TripAdvisor"),
  (9, "Booking.com"),
  (10, "Other")
;


INSERT INTO transport_methods
  (id, transport_name)
VALUES
  (1 , "Car"),
  (2 , "Train"),
  (3 , "Motorbike"),
  (4 , "Motorhome"),
  (5 , "Campervan"),
  (6 , "Coach"),
  (7 , "Plane"),
  (8 , "Bicycle"),
  (9 , "On Foot")
;

INSERT INTO join_rooms_reservations
  (room_id, reservation_id, room_number_of_occupants, reserved_room_price_per_night)
VALUES
  (1, 1, 2, 130.0),
  (2, 2, 2, 145.0),
  (3, 3, 2, 130.0),
  (4, 4, 2, 115.0),
  (5, 5, 2, 130.0),
  (1, 6, 2, 145.0),
  (2, 6, 2, 145.0),
  (4, 6, 2, 145.0),
  (6, 6, 1, 120.0),
  (7, 6, 1, 120.0),
  (3, 7, 2, 130.0),
  (2, 8, 2, 145.0),
  (7, 9, 2, 130.0),
  (2, 10, 2, 145.0),
  (3, 11, 2, 130.0)
;
