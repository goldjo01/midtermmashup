from flask import Flask, request, Response
from json import dumps, loads
from flask_pymongo import PyMongo
from flask import jsonify
from bson.json_util import dumps
from bson.objectid import ObjectId

app = Flask(__name__)
mongo = PyMongo(app) # database named the same as the file

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8087)

# GET
# /api/v1/expenses  -- return all Expenses
# /api/v1/expenses/356  -- return expense 346

# POST
# /api/v1/expenses  -- Create new expense data is in the data block

# curl -H "Content-Type: application/json" -X POST -d '{"date": "2017-02-28", "store": "ace", "category": "law", "item": "lawnmower", "amount": 200.55}'
#Contact GitHub API Training Shop Blog About
