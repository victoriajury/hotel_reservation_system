import datetime
from typing import Optional

from server.helpers import date_diff_days
from server.database import db
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


def make_dict(obj, excluded=None):
    if excluded is None:
        excluded = []
    return {
        c.name: getattr(obj, c.name)
        for c in obj.__table__.columns
        if c.name not in excluded
    }


class Users(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)

    def to_dict(self):
        return make_dict(self, excluded=["password"])


class Guests(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    guest_name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    telephone: Mapped[str] = mapped_column(String)
    address_1: Mapped[str] = mapped_column(String)
    address_2: Mapped[str] = mapped_column(String)
    city: Mapped[str] = mapped_column(String)
    county: Mapped[str] = mapped_column(String)
    postcode: Mapped[str] = mapped_column(String)
    guest_notes: Mapped[Optional[str]] = mapped_column(String)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()

    reservations = relationship("Reservations", back_populates="guest")

    def to_dict(self):
        _dict = make_dict(self)
        _dict["modified_by_user"] = self.modified_by_user.username
        _dict["reservations"] = [
            {
                "id": res.id,
                "start_date": res.start_date,
                "end_date": res.end_date,
                "status": res.status.status,
                "status_color": res.status.bg_color,
                "special_offer_discount": res.special_offer_discount,
                "rooms": [
                    {
                        **rooms_res_assoc.rooms.to_dict(),
                        "reserved_room_price_per_night": rooms_res_assoc.reserved_room_price_per_night,
                        "room_number_of_occupants": rooms_res_assoc.room_number_of_occupants,
                    }
                    for rooms_res_assoc in res.rooms
                ],
            }
            for res in self.reservations
        ]
        return _dict


class RoomTypes(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type_name: Mapped[str] = mapped_column(String)
    base_price_per_night: Mapped[float] = mapped_column(Float)
    amenities: Mapped[str] = mapped_column(String)
    photo: Mapped[str] = mapped_column(String)
    max_occupants: Mapped[int] = mapped_column(Integer)
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()

    def to_dict(self):
        _dict = make_dict(self)
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class RoomReservationAssociation(db.Model):  # type: ignore
    __tablename__ = "join_rooms_reservations"
    room_id = mapped_column(Integer, ForeignKey("rooms.id"), primary_key=True)
    reservation_id = mapped_column(
        Integer, ForeignKey("reservations.id"), primary_key=True
    )
    room_number_of_occupants = mapped_column(Integer)
    reserved_room_price_per_night = mapped_column(Float)

    rooms = relationship("Rooms", back_populates="reservations")
    reservations = relationship("Reservations", back_populates="rooms")

    def to_dict(self):
        return make_dict(self)


class Rooms(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    room_number: Mapped[int] = mapped_column(Integer)
    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"))
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    room_type: Mapped[RoomTypes] = relationship()
    modified_by_user: Mapped[Users] = relationship()

    reservations = relationship("RoomReservationAssociation", back_populates="rooms")

    def to_dict(self):
        _dict = make_dict(self)
        _dict["room_type_name"] = self.room_type.type_name
        _dict["room_max_occupants"] = self.room_type.max_occupants
        _dict["room_amenities"] = self.room_type.amenities
        _dict["room_photo"] = self.room_type.photo
        _dict["base_price_per_night"] = self.room_type.base_price_per_night
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class ReservationStatus(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    status: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String)
    bg_color: Mapped[Optional[str]] = mapped_column(String)

    def to_dict(self):
        return make_dict(self)


class Reservations(db.Model):  # type: ignore
    """
    Reservations is the source of truth for price and offers applied to the booking.
    """

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    start_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    end_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    status_id: Mapped[int] = mapped_column(ForeignKey("reservation_status.id"))
    guest_id: Mapped[int] = mapped_column(Integer, ForeignKey("guests.id"))

    # computed_total_price: Mapped[float] = mapped_column(Float)

    special_offer_applied_title: Mapped[Optional[str]] = mapped_column(String)
    special_offer_discount: Mapped[float] = mapped_column(Float, server_default="0.0")
    reservation_notes: Mapped[Optional[str]] = mapped_column(String)
    guest_arrival_time: Mapped[Optional[str]] = mapped_column(String)
    guest_transport_method: Mapped[Optional[str]] = mapped_column(String)
    guest_marketing_source: Mapped[Optional[str]] = mapped_column(String)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    status: Mapped[ReservationStatus] = relationship()
    modified_by_user: Mapped[Users] = relationship()

    guest = relationship("Guests", back_populates="reservations")
    rooms = relationship("RoomReservationAssociation", back_populates="reservations")

    def to_dict(self):
        _dict = make_dict(self)
        _dict["rooms"] = [
            {
                **rooms_res_assoc.to_dict(),
                "room_photo": rooms_res_assoc.rooms.room_type.photo,
                "room_type_name": rooms_res_assoc.rooms.room_type.type_name,
            }
            for rooms_res_assoc in self.rooms
        ]
        _dict["computed_total_price"] = date_diff_days(
            self.start_date, self.end_date
        ) * sum(
            rooms_res_assoc.reserved_room_price_per_night
            for rooms_res_assoc in self.rooms
        )

        _dict["guest_name"] = self.guest.guest_name
        _dict["guest_address"] = ", ".join(
            field
            for field in [
                self.guest.address_1,
                self.guest.address_2,
                self.guest.city,
                self.guest.county,
                self.guest.postcode,
            ]
            if field
        )
        _dict["guest_email"] = self.guest.email
        _dict["guest_telephone"] = self.guest.telephone
        _dict["status"] = self.status.status
        _dict["status_color"] = self.status.bg_color
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class SpecialOffers(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    room_type: Mapped[int] = mapped_column(ForeignKey("room_types.id"))
    price_per_night: Mapped[float] = mapped_column(Float)
    start_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    end_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    room_type_name: Mapped[RoomTypes] = relationship()
    modified_by_user: Mapped[Users] = relationship()

    def to_dict(self):
        _dict = make_dict(self)
        _dict["room_type_name"] = self.room_type_name.type_name
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class Invoices(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reservation_id: Mapped[int] = mapped_column(ForeignKey("reservations.id"))
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()

    reservation: Mapped[Reservations] = relationship()
    payments = relationship("Payments", back_populates="invoice")
    invoice_items = relationship("InvoiceItems", back_populates="invoice")

    def to_dict(self):
        _dict = make_dict(self)
        _dict["reservation_start_date"] = self.reservation.start_date
        _dict["reservation_end_date"] = self.reservation.end_date
        _dict["guest_id"] = self.reservation.guest.id
        _dict["guest_name"] = self.reservation.guest.guest_name
        _dict["guest_email"] = self.reservation.guest.email
        _dict["special_offer_discount"] = self.reservation.special_offer_discount
        _dict["payments"] = [
            {
                "id": payment.id,
                "entered_date": payment.entered_date,
                "amount": payment.amount,
                "modified": payment.modified,
            }
            for payment in self.payments
        ]
        _dict["amount_paid"] = sum(
            p.amount for p in self.payments if p.invoice_id == self.id
        )
        _dict["invoice_items"] = [
            {
                "id": item.id,
                "item_description": item.item_description,
                "is_room": item.is_room,
                "quantity": item.quantity,
                "price": item.price,
                "modified": item.modified,
            }
            for item in self.invoice_items
        ]
        _dict["invoice_total"] = (
            sum(
                ii.price * ii.quantity
                for ii in self.invoice_items
                if ii.invoice_id == self.id
            )
            - self.reservation.special_offer_discount
        )
        _dict["invoice_items_room_total"] = sum(
            ii.price * ii.quantity
            for ii in self.invoice_items
            if ii.invoice_id == self.id and ii.is_room
        )
        _dict["invoice_items_extras_total"] = sum(
            ii.price * ii.quantity
            for ii in self.invoice_items
            if ii.invoice_id == self.id and not ii.is_room
        )
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class InvoiceItems(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoices.id"))
    item_description: Mapped[str] = mapped_column(String)
    is_room: Mapped[bool] = mapped_column(Boolean, default=False)
    quantity: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()
    invoice: Mapped[Invoices] = relationship()

    def to_dict(self):
        _dict = make_dict(self)
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class Payments(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    entered_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoices.id"))
    amount: Mapped[float] = mapped_column(Float)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()
    invoice: Mapped[Invoices] = relationship()

    def to_dict(self):
        _dict = make_dict(self)
        _dict["reservation_id"] = self.invoice.reservation.id
        _dict["guest_id"] = self.invoice.reservation.guest.id
        _dict["guest_name"] = self.invoice.reservation.guest.guest_name
        _dict["guest_email"] = self.invoice.reservation.guest.email
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class MarketingSources(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_name: Mapped[str] = mapped_column(String)

    def to_dict(self):
        _dict = make_dict(self)
        return _dict


class TransportMethods(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    transport_name: Mapped[str] = mapped_column(String)

    def to_dict(self):
        _dict = make_dict(self)
        return _dict
