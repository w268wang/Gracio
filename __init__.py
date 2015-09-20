__author__ = 'wwang'

from flask import Flask, Response, request, make_response, redirect, send_from_directory

import services.mongo_service as mongo

import requests, json, os, urllib2
from twisted.python import log

AWS_IP_ADDRESS = "54.152.97.131"
BASE_URL = "http://localhost:5000"

if urllib2.urlopen('http://ip.42.pl/raw').read() == AWS_IP_ADDRESS:
    log.startLogging(open('/var/log/gracio/gracio.log', 'w'))
    BASE_URL = "http://" + mongo.AWS_IP_ADDRESS

FB_APP_ID = "1113294778698674"
FB_APP_SECRET = "fd70f888513b16e6825523618ae5bf18"
FB_APP_ACCESS_TOKEN = "1113294778698674|VcknILT54UuU9aAybSXQJfLkbP4"
fb_access_token_url = "https://graph.facebook.com/v2.4/oauth/access_token?"
fb_debug_token_url = "https://graph.facebook.com/debug_token?"

app = Flask(__name__, static_url_path='')


def get_file(filename):
    try:
        src = os.path.join(os.path.abspath(os.path.dirname(__file__)), filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@app.route("/", methods=['GET'])
def index():
    content = get_file('templates/index.html')
    return Response(content, mimetype="text/html")


@app.route("/map", methods=['GET'])
def main_page():
    content = get_file('templates/index2.html')
    return Response(content, mimetype="text/html")


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

    app_callback_url = BASE_URL + "/map"

    res = make_response(redirect(app_callback_url))
    res.set_cookie("status", "0")
    res.set_cookie("user_id", user_id)
    if not user_exists:
        res.set_cookie("new_user", "1")
    else:
        res.set_cookie("new_user", "0")
    return res


# to fill in information like phone number and email (since in fb_callback,
# each user only have userid set)
#   Example: /fill_user?user_id=test&phone_number=1234567890&email=example@test.com&nickname=test_nick_name
@app.route("/fill_user")
def fill_user():
    user_id = request.args.get("user_id")
    phone_number = request.args.get("phone_number")
    email = request.args.get("email")
    nickname = request.args.get("nickname")

    mongo.fill_facebook_user(user_id, phone_number, email, nickname)
    return json.dumps({"status": 200})


@app.route("/get_user")
def get_user():
    user_id = request.args.get("user_id")

    user = mongo.get_user(user_id)
    return json.dumps({"user_id": user_id, "phone_number": user["phone_number"],
                       "email": user["email"], "nickname": user["nickname"]})


@app.route("/provide_ride")
def provide_ride():
    user_id = request.args.get("user_id")
    time = int(request.args.get("time"))
    target_address = request.args.get("target_address")
    quantity = request.args.get("quantity")

    mongo.add_provide_info(user_id, time, target_address, quantity)
    return json.dumps({"status": 200})


@app.route("/get_provided_ride")
def get_provided_ride():
    target_address = request.args.get("target_address")
    time = int(request.args.get("time"))

    return json.dumps(mongo.get_provide_info_list(time, target_address))


@app.route("/request_ride")
def request_ride():
    user_id = request.args.get("user_id")
    time = int(request.args.get("time"))
    target_address = request.args.get("target_address")
    quantity = request.args.get("quantity")

    mongo.add_request_info(user_id, time, target_address, quantity)
    return json.dumps({"status": 200})


@app.route("/get_requested_ride")
def get_requested_ride():
    target_address = request.args.get("target_address")
    time = int(request.args.get("time"))

    return json.dumps(mongo.get_request_info_list(time, target_address))


if __name__ == "__main__":
    app.run(debug=True, threaded=True)

