__author__ = 'wwang'

from flask import Flask, Response, request, make_response, redirect

import services.mongo_service as mongo

import requests, json


BASE_URL = "http://127.0.0.1:5000"

FB_APP_ID = "1113294778698674"
FB_APP_SECRET = "fd70f888513b16e6825523618ae5bf18"
FB_APP_ACCESS_TOKEN = "1113294778698674|VcknILT54UuU9aAybSXQJfLkbP4"
fb_access_token_url = "https://graph.facebook.com/v2.4/oauth/access_token?"
fb_debug_token_url = "https://graph.facebook.com/debug_token?"

app = Flask(__name__)


@app.route("/", methods=['GET'])
def index():
    return Response("abc", mimetype="text/html")


# call when the sign in with fb button gets clicked
# JS example:
# https://scontent-iad3-1.xx.fbcdn.net/hphotos-xpt1/v/t35.0-12/12041556_556749337807713_1420200557_o.jpg?oh=11b93d0668f4a514c79834fdbd625ba6&oe=55FF8EC0
@app.route("/facebookreqoauth", methods=['GET'])
def get_fb_oauth():
    app_callback_url = BASE_URL + "/fb_callback"
    print(app_callback_url)
    return json.dumps({"app_id": FB_APP_ID, "redirect_uri": app_callback_url})


# we will need to send this uri to FB
# JS example:
# https://scontent-iad3-1.xx.fbcdn.net/hphotos-xpt1/v/t35.0-12/12041556_556749337807713_1420200557_o.jpg?oh=11b93d0668f4a514c79834fdbd625ba6&oe=55FF8EC0
# and FB will call this API
@app.route("/fb_callback")
def get_fb_credentials():
    app_callback_url = BASE_URL + "/fb_callback"
    code = request.args.get("code")
    oauth_denied = request.args.get('error_reason')

    if oauth_denied:
        res = make_response(redirect(app_callback_url))
        res.set_cookie("status", "1")
        return res

    req =  fb_access_token_url + "client_id=" + FB_APP_ID + \
        "&redirect_uri=" + app_callback_url + "&client_secret=" \
        + FB_APP_SECRET + "&code=" + code

    response = requests.get(req).json()
    access_token = response["access_token"]

    req = fb_debug_token_url + "input_token=" + access_token + \
        "&access_token=" + FB_APP_ACCESS_TOKEN

    response = requests.get(req).json()
    user_id = response["data"]["user_id"]

    user_exists = mongo.check_user(user_id)

    if not user_exists:
        mongo.add_facebook_user(user_id)

    app_callback_url = BASE_URL + "/mobile"

    res = make_response(redirect(app_callback_url))
    res.set_cookie("status", "0")
    return res


# to fill in information like phone number and email (since in fb_callback,
# each user only have userid set)
#   Example: /fill_user?user_id=test&phong_number=1234567890&email=example@test.com
@app.route("/fill_user")
def fill_user():
    user_id = request.args.get("user_id")
    phone_number = request.args.get("phone_number")
    email = request.args.get("email")

    mongo.fill_facebook_user(user_id, phone_number, email)


if __name__ == "__main__":
    app.run(debug=True, threaded=True)

