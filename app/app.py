from flask import Flask, render_template, request, jsonify
import os
import sys

sys.path.append(os.getcwd() + "/backend")
from expense_tracker import ExpenseTracker


app = Flask(__name__)


expense_tracker = ExpenseTracker()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/add_transaction", methods=["POST"])
def add_transaction():
    data = request.get_json()
    expense_tracker.add_transaction(
        data["type"], data["title"], data["tag"], data["date"], data["amount"]
    )
    return jsonify({"success": True})


@app.route("/summary", methods=["GET"])
def get_summary():
    month = request.args.get("month", None)
    year = request.args.get("year", None)
    summary_info = expense_tracker.get_summary(month, year)
    return jsonify(summary_info)


if __name__ == "__main__":
    app.run(debug=True)
