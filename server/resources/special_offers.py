from datetime import datetime

from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import SpecialOffers
from sqlalchemy import and_
from werkzeug.exceptions import NotFound

date_format = "%Y-%m-%d"

parser = reqparse.RequestParser()
required_fields = [
    "title",
    "room_type",
    "price_per_night",
    "start_date",
    "end_date",
    "is_enabled",
    "modified_by_id",
]
for arg in required_fields:
    if arg in ["start_date", "end_date"]:
        # forcing date type might cause issues?
        parser.add_argument(
            arg, type=lambda x: datetime.strptime(x, date_format), required=True
        )
    elif arg == "is_enabled":
        parser.add_argument(arg, type=bool, required=True)
    else:
        parser.add_argument(arg, required=True)


class SpecialOfferResource(Resource):
    def get(
        self, offer_id=None, reservation_start_date=None, reservation_end_date=None
    ):
        if reservation_start_date and reservation_end_date:
            # Return offers valid during reservation dates
            try:
                query = db.session.execute(
                    db.select(SpecialOffers)
                    .filter(
                        and_(
                            SpecialOffers.start_date <= reservation_start_date,
                            SpecialOffers.end_date >= reservation_end_date,
                            SpecialOffers.is_enabled,
                        )
                    )
                    .order_by(SpecialOffers.price_per_night)
                ).scalars()

                offers_by_date = [data.to_dict() for data in query.all()]

                return jsonify(offers_by_date)

            except NotFound:
                response = make_response(
                    "Special Offers not found for selected dates.", 404
                )
                return response

        if offer_id is None:
            query = db.session.execute(db.select(SpecialOffers)).scalars()
            offers = [data.to_dict() for data in query.all()]

            return jsonify(offers)

        elif offer_id:
            try:
                offer = db.get_or_404(SpecialOffers, offer_id).to_dict()
                return jsonify(offer)
            except NotFound:
                response = make_response("Special Offer not found.", 404)
                return response

    def post(self):
        try:
            fields = parser.parse_args()

            new_offer = SpecialOffers(
                title=fields["title"],
                room_type=fields["room_type"],
                price_per_night=fields["price_per_night"],
                start_date=fields["start_date"],
                end_date=fields["end_date"],
                is_enabled=bool(fields["is_enabled"]),
                modified_by_id=fields["modified_by_id"],
            )

            db.session.add(new_offer)
            db.session.commit()

            response = make_response(new_offer.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, offer_id):
        try:
            offer = db.get_or_404(SpecialOffers, offer_id)
        except NotFound:
            response = make_response("Special Offer not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            offer.title = fields["title"]
            offer.room_type = fields["room_type"]
            offer.price_per_night = fields["price_per_night"]
            offer.start_date = fields["start_date"]
            offer.end_date = fields["end_date"]
            offer.is_enabled = bool(fields["is_enabled"])
            offer.modified_by_id = fields["modified_by_id"]

            db.session.commit()

            response = make_response(offer.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, offer_id):
        # TODO: Warn if there are active bookings connected to offer
        try:
            offer = db.get_or_404(SpecialOffers, offer_id)
        except NotFound:
            response = make_response("Special Offer not found.", 404)
            return response

        db.session.delete(offer)
        db.session.commit()

        response = make_response("Special Offer deleted", 204)

        return response
