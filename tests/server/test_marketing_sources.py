import pytest
from server.database import db
from server.models import MarketingSources


def test_get_all_marketing_sources(client):
    response = client.get("api/marketing-sources")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["source_name"] == "Search Engine"
    assert data[1]["source_name"] == "Email"


def test_get_single_marketing_source(client):
    response = client.get("api/marketing-sources/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["source_name"] == "Search Engine"


@pytest.mark.parametrize(
    "path",
    (
        "api/marketing-sources/3",
        "api/marketing-sources/123",
    ),
)
def test_marketing_source_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# def test_index(client, auth):
#     response = client.get("/marketing_sources/")
#     assert b'href="/auth/login"' in response.data
#     assert b"King-size bed, bath, sea views" not in response.data
#     assert b"Edit" not in response.data
#     assert response.headers["Location"] == "/auth/login"

#     auth.login()
#     response = client.get("/marketing_sources/")
#     assert b"Log out" in response.data
#     assert b"Superior Double" in response.data
#     assert b"King-size bed, bath, sea views" in response.data
#     assert b'href="/marketing_sources/1/update"' in response.data


def test_create_marketing_source(client, auth, app):
    data = {
        "source_name": "Search Engine"
    }

    # auth.login()
    assert client.get("api/marketing-sources").status_code == 200
    res = client.post("api/marketing-sources", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(MarketingSources.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_marketing_source_missing_fields(client, auth, app):
    data = {
        # "source_name": misssing
    }

    # auth.login()
    assert client.get("api/marketing-sources").status_code == 200
    res = client.post("api/marketing-sources", json=data)
    assert res.status_code == 400
    assert b"Missing required parameter" in res.data

    with app.app_context():
        count_query = db.func.count(MarketingSources.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_create_marketing_source_valid_fields_type(client, auth, app):
    data = {
        "source_name": ""
    }

    # auth.login()
    assert client.get("api/marketing-sources").status_code == 200
    res = client.post("api/marketing-sources", json=data)
    assert res.status_code == 400
    assert b"Invalid value for field: source_name" in res.data

    with app.app_context():
        count_query = db.func.count(MarketingSources.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_marketing_source(client, auth, app):
    data = {
        "source_name": "Search Engine"
    }

    # auth.login()
    assert client.get("api/marketing-sources").status_code == 200
    res = client.put("api/marketing-sources/1", json=data)
    assert res.status_code == 204


def test_update_marketing_source_missing_fields(client, auth, app):
    data = {
        # "source_name": missing
    }

    # auth.login()
    assert client.get("api/marketing-sources/1").status_code == 200
    res = client.put("api/marketing-sources/1", json=data)
    assert res.status_code == 400
    assert b"Missing required parameter" in res.data


def test_update_marketing_source_valid_fields_type(client, auth, app):
    data = {
        "source_name": ""
    }

    # auth.login()
    assert client.get("api/marketing-sources/1").status_code == 200
    res = client.put("api/marketing-sources/1", json=data)
    assert res.status_code == 400
    assert b"Invalid value for field: source_name" in res.data


def test_update_marketing_source_not_found(client, auth, app):
    data = {
        "source_name": "Search Engine"
    }


    # auth.login()
    assert client.get("api/marketing-sources").status_code == 200
    res = client.put("api/marketing-sources/3", json=data)
    assert res.status_code == 404


def test_delete_marketing_source(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/marketing-sources/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(MarketingSources.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_marketing_source_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/marketing-sources/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(MarketingSources.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2

# @pytest.mark.parametrize(
#     "path",
#     (
#         "/marketing_sources/create",
#         "/marketing_sources/1/update",
#         "/marketing_sources/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/marketing_sources/3/update",
#         "/marketing_sources/3/delete",
#     ),
# )
# def test_record_exists(client, auth, path):
#     # test data only has 2 records, expects record 3 not found
#     auth.login()
#     assert client.post(path).status_code == 404


# def test_create(client, auth, app):
#     data = {
#         "source_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     assert client.get("/marketing_sources/create").status_code == 200
#     client.post("/marketing_sources/create", json=data)

#     with app.app_context():
#         db = get_db()
#         count = db.execute("SELECT COUNT(id) FROM marketing_sources").fetchone()[0]
#         assert count == 3


# def test_update(client, auth, app):
#     data = {
#         "source_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     assert client.get("/marketing_sources/1/update").status_code == 200
#     res = client.post(
#         "/marketing_sources/1/update", data=data, content_type="multipart/form-data"
#     )
#     assert res.status_code == 302

#     with app.app_context():
#         db = get_db()
#         res = db.execute("SELECT * FROM marketing_sources WHERE id = 1").fetchone()
#         assert res["source_name"] == "Single"
#         assert res["max_occupants"] == 1


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/marketing_sources/create",
#         "/marketing_sources/1/update",
#     ),
# )
# def test_create_update_validate(client, auth, path):
#     data = {
#         "source_name": "",
#         "base_price_per_night": "",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     response = client.post(path, json=data)
#     assert b"Type Name is required." in response.data
#     assert b"Base Price Per Night is required." in response.data
#     assert b"Max Occupants is required." in response.data


# @pytest.mark.parametrize(
#     "path, extension",
#     [
#         ("/marketing_sources/create", "pdf"),
#         ("/marketing_sources/1/update", "txt"),
#     ],
# )
# def test_create_update_allowed_extensions_validate(client, auth, path, extension):
#     data = {
#         "source_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), f"test.{extension}")

#     auth.login()
#     response = client.post(path, json=data)
#     assert b"Not a valid file type." in response.data


# @pytest.mark.parametrize(
#     "path, key, filename, photo_bytes, expected",
#     [
#         ("/marketing_sources/create", "", "test.jpg", b"abcdef", b"No photo part found"),
#         ("/marketing_sources/create", "photo", "", b"abcdef", b"No selected photo"),
#         ("/marketing_sources/create", "photo", "test.jpg", b"", b"Invalid file"),
#         ("/marketing_sources/1/update", "", "test.jpg", b"abcdef", b"No photo part found"),
#         ("/marketing_sources/1/update", "photo", "", b"abcdef", b"No selected photo"),
#         ("/marketing_sources/1/update", "photo", "test.jpg", b"", b"Invalid file"),
#     ],
# )
# def test_create_update_photo_upload_validate(
#     client, auth, path, key, filename, photo_bytes, expected
# ):
#     data = {
#         "source_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data[key] = (BytesIO(photo_bytes), filename)

#     auth.login()
#     response = client.post(path, json=data)
#     assert expected in response.data


# def test_delete(client, auth, app):
#     auth.login()
#     response = client.post("/marketing_sources/1/delete")
#     assert response.headers["Location"] == "/marketing_sources/"

#     with app.app_context():
#         db = get_db()
#         post = db.execute("SELECT * FROM marketing_sources WHERE id = 1").fetchone()
#         assert post is None
