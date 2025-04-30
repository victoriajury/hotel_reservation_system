from flask import jsonify, make_response, request
from flask_restful import Resource
from server.db import db
from server.models import Users


class UserResource(Resource):
    def get(self, user_id=None):
        if user_id is None:
            query = db.session.execute(db.select(Users)).scalars()
            users = [data.to_dict() for data in query.all()]

            return jsonify(users)

        else:
            user = (
                db.session.execute(db.select(Users).filter_by(id=user_id))
                .scalar_one()
                .to_dict()
            )

            return jsonify(user)

    def post(self):
        form_json = request.get_json()
        new_user = Users(username=form_json["username"], email=form_json["password"])

        db.session.add(new_user)
        db.session.commit()

        response = make_response(new_user.to_dict(), 201)
        return response
