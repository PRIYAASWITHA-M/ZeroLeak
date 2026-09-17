import os
from flask import Flask, request, jsonify, send_from_directory
from Scanner import scan_code

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)


@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "login.html")


@app.route("/Devops1.html")
def dashboard():
    return send_from_directory(BASE_DIR, "Devops1.html")


@app.route("/Devops1.js")
def javascript():
    return send_from_directory(BASE_DIR, "Devops1.js")


@app.route("/Devops1.css")
def css():
    return send_from_directory(BASE_DIR, "Devops1.css")


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json(silent=True) or {}
    code = data.get("code", "")

    findings = scan_code(code)
    score = max(0, 100 - (len(findings) * 25))

    return jsonify({
        "success": True,
        "findings": findings,
        "count": len(findings),
        "score": score
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)