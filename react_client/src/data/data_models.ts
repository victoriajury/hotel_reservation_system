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
  guest_name: string;
  email: string;
  telephone: string;
  address_1: string;
  address_2: string;
  city: string;
  county: string;
  postcode: string;
  guest_notes: string;
  reservations: Reservation[];
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
  room_type_id: number;
  room_type_name: string;
  room_max_occupants: number;
  room_number_of_occupants: number;
  room_amenities: string;
  room_photo: string;
  base_price_per_night: number;
  reserved_room_price_per_night: number;
  modified: string;
}

export interface ReservationStatus extends DataModel {
  status: string;
  description: string;
  bg_color: string;
}

export interface Reservation extends DataModel {
  start_date: string;
  end_date: string;
  status: string;
  status_color: string;
  rooms: Room[];
  guest_id?: number;
  guest_name?: string;
  guest_telephone?: string;
  guest_email?: string;
  guest_address?: string;
  computed_total_price: number;
  special_offer_applied_title?: string;
  special_offer_discount: number;
  reservation_notes?: string;
  guest_arrival_time?: string;
  guest_transport_method?: string;
  guest_marketing_source?: string;
  modified: string;
  created: string;
}

export interface SpecialOffer extends DataModel {
  title: string;
  room_type: number;
  room_type_name: string;
  price_per_night: number;
  start_date: string;
  end_date: string;
  is_enabled: boolean;
  modified: string;
}

export interface Invoice extends DataModel {
  reservation_id: number;
  reservation_start_date: string;
  reservation_end_date: string;
  guest_id: number;
  guest_name: string;
  guest_email: string;
  special_offer_discount: number;
  invoice_items: InvoiceItem[];
  invoice_total: number;
  invoice_items_room_total: number;
  invoice_items_extras_total: number;
  amount_paid: number;
  payments: Payment[];
  modified: string;
  created: string;
}

export interface InvoiceItem extends DataModel {
  invoice_id: string;
  item_description: string;
  is_room: boolean;
  quantity: number;
  price: number;
  modified: string;
}

export interface Payment extends DataModel {
  invoice_id?: number;
  reservation_id?: number;
  entered_date: string;
  amount: number;
  guest_id?: number;
  guest_name?: string;
  guest_email?: string;
  modified: string;
}

export interface MarketingSource extends DataModel {
  source_name: string;
}

export interface TransportMethod extends DataModel {
  transport_name: string;
}
