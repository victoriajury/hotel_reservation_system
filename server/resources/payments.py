from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import Payments
from werkzeug.exceptions import NotFound

parser = reqparse.RequestParser()
required_fields = [
    "invoice_id",
    "amount",
    "modified_by_id",
]
for arg in required_fields:
    parser.add_argument(arg, required=True)

# optional fields
# parser.add_argument("")


class PaymentResource(Resource):
    def get(self, payment_id=None):
        if payment_id is None:
            # Return al payments
            query = db.session.execute(db.select(Payments)).scalars()
            payments = [data.to_dict() for data in query.all()]
            return jsonify(payments)
        else:
            try:
                payment = db.get_or_404(Payments, payment_id).to_dict()
                return jsonify(payment)
            except NotFound:
                response = make_response("Payment not found.", 404)
                return response

    def post(self):
        try:
            fields = parser.parse_args()

            new_payment = Payments(
                invoice_id=fields["invoice_id"],
                amount=fields["amount"],
                modified_by_id=fields["modified_by_id"],
            )

            db.session.add(new_payment)
            db.session.commit()

            response = make_response(new_payment.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, payment_id):
        try:
            payment = db.get_or_404(Payments, payment_id)
        except NotFound:
            response = make_response("Payment not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            payment.invoice_id = fields["invoice_id"]
            payment.amount = fields["amount"]
            payment.modified_by_id = fields["modified_by_id"]

            db.session.commit()

            response = make_response(payment.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, payment_id):
        try:
            payment = db.get_or_404(Payments, payment_id)
        except NotFound:
            response = make_response("Payment not found.", 404)
            return response

        db.session.delete(payment)
        db.session.commit()

        response = make_response("Payment deleted", 204)

        return response
