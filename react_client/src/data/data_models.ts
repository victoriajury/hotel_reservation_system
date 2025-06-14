export type DataModelId = string | number;

export interface DataModel {
  id: DataModelId;
  [key: PropertyKey]: unknown;
}

export interface User extends DataModel {
  username: string;
  password: string;
}

export interface Guest extends DataModel {
  name: string;
  email: string;
  telephone: string;
  address_1: string;
  address_2: string;
  city: string;
  county: string;
  postcode: string;
  guest_notes: string;
  modified: string;
}

export interface RoomType extends DataModel {
  type_name: string;
  base_price_per_night: number;
  amenities: string;
  photo: string;
  max_occupants: number;
  modified: string;
}

export interface Room extends DataModel {
  room_number: number;
  room_type: string;
  modified: string;
}

export interface ReservationStatus extends DataModel {
  status: string;
  description: string;
  bg_color: string;
}

export interface Reservations extends DataModel {
  number_of_guests: string;
  start_date: string;
  end_date: string;
  total_room_base_price: string;
  special_offer_applied: string;
  special_offer_discount: string;
  reservation_notes: string;
  status_id: string;
  modified: string;
}

export interface SpecialOffers extends DataModel {
  title: string;
  room_type: string;
  price_per_night: string;
  start_date: string;
  end_date: string;
  is_enabled: string;
  modified: string;
}

export interface Invoices extends DataModel {
  reservation_id: string;
  amount_paid: string;
  modified: string;
}

export interface InvoiceItems extends DataModel {
  invoice_id: string;
  item_description: string;
  is_room: string;
  quantity: string;
  price: string;
  total: string;
  modified: string;
}

export interface Payments extends DataModel {
  invoice_id: string;
  amount: string;
  modified: string;
}
