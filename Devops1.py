from flask import Flask, request, jsonify, send_from_directory
from Scanner import scan_code

app = Flask(__name__)


# ==============================
# HOME PAGE
# ==============================

@app.route("/")
def home():
    return send_from_directory(".", "Devops1.html")


# ==============================
# JAVASCRIPT FILE
# ==============================

@app.route("/Devops1.js")
def javascript():
    return send_from_directory(".", "Devops1.js")


# ==============================
# CSS FILE
# ==============================

@app.route("/Devops1.css")
def css():
    return send_from_directory(".", "Devops1.css")


# ==============================
# SECURITY SCAN API
# ==============================

@app.route("/scan", methods=["POST"])
def scan():

    data = request.get_json()

    code = data.get("code", "")

    findings = scan_code(code)

    score = max(0, 100 - (len(findings) * 25))

    return jsonify({
        "success": True,
        "findings": findings,
        "count": len(findings),
        "score": score
    })


# ==============================
# START SERVER
# ==============================

if __name__ == "__main__":
    app.run(debug=True)