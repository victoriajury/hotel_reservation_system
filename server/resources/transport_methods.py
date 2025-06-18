from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import TransportMethods
from werkzeug.exceptions import NotFound

parser = reqparse.RequestParser()
required_fields = [
    "transport_name",
]
for arg in required_fields:
    parser.add_argument(arg, required=True)


class TransportMethodResource(Resource):
    def get(self, transport_method_id=None):
        if transport_method_id is None:
            query = db.session.execute(db.select(TransportMethods)).scalars()
            transport_methods = [data.to_dict() for data in query.all()]
            return jsonify(transport_methods)

        else:
            try:
                transport_method = db.get_or_404(
                    TransportMethods, transport_method_id
                ).to_dict()
                return jsonify(transport_method)
            except NotFound:
                response = make_response("Transport method not found.", 404)
                return response

    def post(self):
        try:
            fields = parser.parse_args()

            for rf in required_fields:
                if not fields[rf]:
                    response = make_response(
                        f"Invalid value for field: {rf} is required.", 400
                    )
                    return response

            new_transport_method = TransportMethods(
                transport_name=fields["transport_name"],
            )

            db.session.add(new_transport_method)
            db.session.commit()

            response = make_response(new_transport_method.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, transport_method_id):
        try:
            transport_method = db.get_or_404(TransportMethods, transport_method_id)
        except NotFound:
            response = make_response("Transport method not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            for rf in required_fields:
                if not fields[rf]:
                    response = make_response(
                        f"Invalid value for field: {rf} is required.", 400
                    )
                    return response

            transport_method.transport_name = fields["transport_name"]

            db.session.commit()

            response = make_response(transport_method.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, transport_method_id):
        try:
            transport_method = db.get_or_404(TransportMethods, transport_method_id)
        except NotFound:
            response = make_response("Transport method not found.", 404)
            return response

        db.session.delete(transport_method)
        db.session.commit()

        response = make_response("Transport method deleted", 204)

        return response
