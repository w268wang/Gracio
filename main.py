__author__ = 'wwang'

from flask import Flask, Response

app = Flask(__name__)

@app.route("/", methods=['GET'])
def index():
    return Response("abc", mimetype="text/html")

if __name__ == "__main__":
    app.run(debug=True, threaded=True)

