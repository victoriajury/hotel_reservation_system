from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import MarketingSources
from werkzeug.exceptions import NotFound

parser = reqparse.RequestParser()
required_fields = [
    "source_name",
]
for arg in required_fields:
    parser.add_argument(arg, required=True)


class MarketingSourceResource(Resource):
    def get(self, marketing_source_id=None):
        if marketing_source_id is None:
            query = db.session.execute(db.select(MarketingSources)).scalars()
            marketing_sources = [data.to_dict() for data in query.all()]
            return jsonify(marketing_sources)

        else:
            try:
                marketing_source = db.get_or_404(
                    MarketingSources, marketing_source_id
                ).to_dict()
                return jsonify(marketing_source)
            except NotFound:
                response = make_response("Marketing source not found.", 404)
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

            new_marketing_source = MarketingSources(
                source_name=fields["source_name"],
            )

            db.session.add(new_marketing_source)
            db.session.commit()

            response = make_response(new_marketing_source.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, marketing_source_id):
        try:
            marketing_source = db.get_or_404(MarketingSources, marketing_source_id)
        except NotFound:
            response = make_response("Marketing source not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            for rf in required_fields:
                if not fields[rf]:
                    response = make_response(
                        f"Invalid value for field: {rf} is required.", 400
                    )
                    return response

            marketing_source.source_name = fields["source_name"]

            db.session.commit()

            response = make_response(marketing_source.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, marketing_source_id):
        try:
            marketing_source = db.get_or_404(MarketingSources, marketing_source_id)
        except NotFound:
            response = make_response("Marketing source not found.", 404)
            return response

        db.session.delete(marketing_source)
        db.session.commit()

        response = make_response("Marketing source deleted", 204)

        return response
