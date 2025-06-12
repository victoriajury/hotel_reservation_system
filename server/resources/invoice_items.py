from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import InvoiceItems
from werkzeug.exceptions import NotFound

parser = reqparse.RequestParser()
required_fields = [
    "invoice_id",
    "item_description",
    "quantity",
    "price",
    "modified_by_id",
]
for arg in required_fields:
    if arg == "price":
        parser.add_argument(arg, type=float, required=True)
    parser.add_argument(arg, required=True)

# optional fields
parser.add_argument("is_room", type=bool)


class InvoiceItemResource(Resource):
    def get(self, invoice_item_id):
        try:
            item = db.get_or_404(InvoiceItems, invoice_item_id).to_dict()
            return jsonify(item)
        except NotFound:
            response = make_response("Invoice item not found.", 404)
            return response

    def post(self):
        try:
            fields = parser.parse_args()
            total = float(fields["price"]) * int(fields["quantity"])

            new_invoice_item = InvoiceItems(
                invoice_id=fields["invoice_id"],
                item_description=fields["item_description"],
                is_room=fields.get("is_room"),
                quantity=fields["quantity"],
                price=fields["price"],
                total=total,
                modified_by_id=fields["modified_by_id"],
            )

            db.session.add(new_invoice_item)
            db.session.commit()

            response = make_response(new_invoice_item.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, invoice_item_id):
        try:
            item = db.get_or_404(InvoiceItems, invoice_item_id)
        except NotFound:
            response = make_response("Invoice item not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            item.item_description = fields["item_description"]
            item.quantity = fields["quantity"]
            item.is_room = fields.get("is_room")
            item.price = fields["price"]
            item.total = float(fields["price"]) * int(fields["quantity"])
            item.modified_by_id = fields["modified_by_id"]

            db.session.commit()

            response = make_response(item.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, invoice_item_id):
        try:
            item = db.get_or_404(InvoiceItems, invoice_item_id)
        except NotFound:
            response = make_response("Invoice item not found.", 404)
            return response

        db.session.delete(item)
        db.session.commit()

        response = make_response("Invoice item deleted", 204)

        return response


class InvoiceItemByInvoiceResource(Resource):
    def get(self, invoice_id):
        # Return all items on an invoice
        query = db.session.execute(
            db.select(InvoiceItems).filter_by(invoice_id=invoice_id)
        ).scalars()
        invoice_items = [data.to_dict() for data in query.all()]

        return jsonify(invoice_items)
