import os

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from server.database import db, init_db_command

from .resources import (
    guests,
    invoice_items,
    invoices,
    payments,
    reservation_status,
    reservations,
    room_types,
    rooms,
    special_offers,
    users,
)


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, static_url_path="")
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///reservations.sqlite"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    with app.app_context():
        db.create_all()

    api = Api(app)

    api.add_resource(users.UserResource, "/api/users", endpoint="users")
    api.add_resource(users.UserResource, "/api/users/<int:user_id>", endpoint="user")

    api.add_resource(guests.GuestResource, "/api/guests", endpoint="guests")
    api.add_resource(
        guests.GuestResource, "/api/guests/<int:guest_id>", endpoint="guest"
    )

    api.add_resource(
        room_types.RoomTypeResource, "/api/room-types", endpoint="room_types"
    )
    api.add_resource(
        room_types.RoomTypeResource,
        "/api/room-types/<int:room_type_id>",
        endpoint="room_type",
    )

    api.add_resource(rooms.RoomResource, "/api/rooms", endpoint="rooms")
    api.add_resource(rooms.RoomResource, "/api/rooms/<int:room_id>", endpoint="room")

    api.add_resource(
        reservations.ReservationResource, "/api/reservations", endpoint="reservations"
    )
    api.add_resource(
        reservations.ReservationResource,
        "/api/reservations/<int:reservation_id>",
        endpoint="reservation",
    )

    api.add_resource(
        reservation_status.ReservationStatusResource,
        "/api/reservation-status",
        endpoint="reservation_statuses",
    )
    api.add_resource(
        reservation_status.ReservationStatusResource,
        "/api/reservation-status/<int:status_id>",
        endpoint="reservation_status",
    )

    api.add_resource(
        special_offers.SpecialOfferResource,
        "/api/special-offers",
        endpoint="special_offers",
    )
    api.add_resource(
        special_offers.SpecialOfferResource,
        "/api/special-offers/<int:offer_id>",
        endpoint="special_offer",
    )

    api.add_resource(invoices.InvoiceResource, "/api/invoices", endpoint="invoices")
    api.add_resource(
        invoices.InvoiceResource, "/api/invoices/<int:invoice_id>", endpoint="invoice"
    )

    api.add_resource(
        invoice_items.InvoiceItemByInvoiceResource,
        "/api/invoice-items/invoice/<int:invoice_id>",
        endpoint="invoice_items_by_invoice",
    )
    api.add_resource(
        invoice_items.InvoiceItemResource,
        "/api/invoice-items",
        endpoint="create_invoice_item",
    )
    api.add_resource(
        invoice_items.InvoiceItemResource,
        "/api/invoice-items/<int:invoice_item_id>",
        endpoint="invoice_item",
    )

    api.add_resource(payments.PaymentResource, "/api/payments", endpoint="payments")
    api.add_resource(
        payments.PaymentResource, "/api/payments/<int:payment_id>", endpoint="payment"
    )

    # app.register_blueprint(auth.bp)

    app.cli.add_command(init_db_command)

    return app
