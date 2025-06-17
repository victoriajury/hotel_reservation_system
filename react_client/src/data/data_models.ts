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
  room_type: number;
  modified: string;
}

export interface ReservationStatus extends DataModel {
  status: string;
  description: string;
  bg_color: string;
}

export interface Reservation extends DataModel {
  guest_name: string;
  guest_telephone: string;
  guest_email: string;
  guest_address: string;
  number_of_guests: string;
  start_date: string;
  end_date: string;
  total_room_base_price: number;
  special_offer_applied: number;
  special_offer_discount: number;
  reservation_notes: string;
  status: string;
  modified: string;
}

export interface SpecialOffer extends DataModel {
  title: string;
  room_type_name: string;
  price_per_night: number;
  start_date: string;
  end_date: string;
  is_enabled: boolean;
  modified: string;
}

export interface Invoice extends DataModel {
  reservation_id: number;
  amount_paid: number;
  modified: string;
}

export interface InvoiceItem extends DataModel {
  invoice_id: string;
  item_description: string;
  is_room: boolean;
  quantity: number;
  price: number;
  total: number;
  modified: string;
}

export interface Payment extends DataModel {
  invoice_id: number;
  amount: number;
  modified: string;
}
