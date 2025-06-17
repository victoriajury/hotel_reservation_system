import datetime
from typing import Optional

from server.database import db
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, func
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
    name: Mapped[str] = mapped_column(String)
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
                "total_room_base_price": res.total_room_base_price,
                "special_offer_discount": res.total_room_base_price,
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


class Rooms(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    room_number: Mapped[int] = mapped_column(Integer)
    room_type: Mapped[int] = mapped_column(ForeignKey("room_types.id"))
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


class ReservationStatus(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    status: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String)
    bg_color: Mapped[Optional[str]] = mapped_column(String)

    def to_dict(self):
        return make_dict(self)


class Reservations(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    guest_id: Mapped[int] = mapped_column(Integer, ForeignKey("guests.id"))
    number_of_guests: Mapped[int] = mapped_column(Integer)
    start_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    end_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    total_room_base_price: Mapped[float] = mapped_column(Float)
    special_offer_applied: Mapped[Optional[str]] = mapped_column(String)
    special_offer_discount: Mapped[float] = mapped_column(Float, server_default="0.0")
    reservation_notes: Mapped[Optional[str]] = mapped_column(String)
    status_id: Mapped[int] = mapped_column(ForeignKey("reservation_status.id"))
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

    def to_dict(self):
        _dict = make_dict(self)
        _dict["guest_name"] = self.guest.name
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
    amount_paid: Mapped[float] = mapped_column(Float, default=0)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()

    def to_dict(self):
        _dict = make_dict(self)
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class InvoiceItems(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoices.id"))
    item_description: Mapped[str] = mapped_column(String)
    is_room: Mapped[bool] = mapped_column(Boolean, default=False)
    quantity: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)
    total: Mapped[float] = mapped_column(Float)
    created: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    modified_by_user: Mapped[Users] = relationship()

    def to_dict(self):
        _dict = make_dict(self)
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


class Payments(db.Model):  # type: ignore
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
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

    def to_dict(self):
        _dict = make_dict(self)
        _dict["modified_by_user"] = self.modified_by_user.username
        return _dict


"""
Define joining tables for many-to-many relationships
"""

rooms_reservations = db.Table(
    "join_rooms_reservations",
    Column("room_id", ForeignKey(Rooms.id), primary_key=True),
    Column("reservation_id", ForeignKey(Reservations.id), primary_key=True),
)
