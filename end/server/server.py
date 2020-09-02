from flask import Flask, request, jsonify, redirect, url_for, send_file, send_from_directory, Response
from flask_cors import CORS

import json
import requests

import os
import os.path as osp

import joblib
import numpy as np

from inference import *
from database import *
from utils import *
from const import CONST_DYNAMIC_TYPES

app = Flask(__name__)
CORS(app, resources=r'/*')

@app.route("/")
def hello():
    return 'Welcome to Sahara Fitness!'

@app.route("/user/login", methods=['GET', 'POST'])
def login():
    data = json.loads(request.get_data().decode('utf-8'))
    code = data['code']
    openid, session_key = wx_code_to_session(code)
    if openid and session_key:
        user_info = get_user_info_with_openid(openid)
        if user_info is None:
            new_userid = add_new_user(openid)
            response_data = json.dumps({
                'userid': new_userid
            })
        else:
            response_data = json.dumps({
                'userid': user_info.userid
            })
    else:
        return 'code invailed'
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

def wx_code_to_session(code):
    appId = 'wxaab4415a5a86abde'
    appSecret = '834f813f96e0ce20f08562fe7f822352'
    request_data = {
        'appid': appId,
        'secret': appSecret,
        'js_code': code,
        'grant_type': 'authorization_code'
    }
    wx_code2Session_api = 'https://api.weixin.qq.com/sns/jscode2session'
    response_data = requests.get(wx_code2Session_api, params=request_data)
    data = response_data.json()
    openid = data['openid']
    session_key = data['session_key']
    return openid, session_key

@app.route("/user/info_userid", methods=['GET', 'POST'])
def user_info_with_userid():
    request_data = json.loads(request.get_data().decode('utf-8'))
    userid = request_data['userid']
    user_info = get_user_info_with_userid(userid)
    response_data = json.dumps({
        'id': user_info.userid,
        'age': user_info.age,
        'gender': user_info.gender,
        'height': user_info.height,
        'weight': user_info.weight
    })
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

@app.route("/user/info_set", methods=['GET', 'POST'])
def set_user_info():
    request_data = json.loads(request.get_data().decode('utf-8'))
    userid = request_data['userid']
    openid = get_openid_with_userid(userid)
    age = request_data['age']
    gender = request_data['gender']
    height = request_data['height']
    weight = request_data['weight']
    new_user_info = User(userid=userid, 
                         openid=openid, 
                         age=age, 
                         gender=gender, 
                         height=height, 
                         weight=weight)
    user_info = update_user_info(new_user_info)
    response_data = json.dumps({
        'id': user_info.userid,
        'age': user_info.age,
        'gender': user_info.gender,
        'height': user_info.height,
        'weight': user_info.weight
    })
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

@app.route("/info/category", methods=['GET'])
def all_categories():
    categories = get_all_categories()
    data = []
    for item in categories:
        temp = {
            'id': item.categoryid,
            'name': item.categoryname,
            'image': item.categoryimage
        }
        data.append(temp)
    response_data = json.dumps({
        'category': data
    })
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

@app.route("/info/item_cateid", methods=['GET', 'POST'])
def items_with_categoryid():
    request_data = json.loads(request.get_data().decode('utf-8'))
    categoryid = request_data['categoryid']
    items = get_items_with_categoryid(categoryid)
    data = []
    for item in items:
        itemid = item.itemid
        imageurl = get_images_with_itemid(itemid)[0].imageurl
        temp = {
            'id': item.itemid,
            'name': item.itemname,
            'imageurl': imageurl
        }
        data.append(temp)
    response_data = json.dumps({
        'item': data
    })
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

@app.route("/info/item_itemid", methods=['GET', 'POST'])
def item_info_with_itemid():
    request_data = json.loads(request.get_data().decode('utf-8'))
    itemid = request_data['itemid']
    item = get_item_info_with_itemid(itemid)
    images = get_images_with_itemid(itemid)
    imageurls = []
    for image in images:
        temp = {
            'url': image.imageurl
        }
        imageurls.append(temp)
    response_data = json.dumps({
        'id': itemid,
        'name': item.itemname,
        'intro': item.itemintro,
        'images': imageurls
    })
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

@app.route("/info/record_userid", methods=['GET', 'POST'])
def records_with_userid():
    request_data = json.loads(request.get_data().decode('utf-8'))
    userid = request_data['userid']
    records = get_records_with_userid(userid)
    data = []
    for record in records:
        temp = {
            'itemname': get_itemname_with_itemid(record.itemid),
            'date': str(record.date)
        }
        data.append(temp)
    response_data = json.dumps({
        'record': data
    })
    print(response_data)
    return Response(response=response_data, status=200, mimetype="application/json")

@app.route("/info/record_new", methods=['GET', 'POST'])
def new_record():
    request_data = json.loads(request.get_data().decode('utf-8'))
    userid = request_data['userid']
    itemid = request_data['itemid']
    add_new_record(userid=userid,
                  itemid=itemid)
    return 'ok'

@app.route("/item/static", methods=['GET', 'POST'])
def static_item():
    request_json = request.get_json(force=True)
    if request_json:
        if request_json['type'] == 'mabu':
            result = fitness_mabu(request_json['data'])
        elif request_json['type'] == 'yoga':
            result = fitness_yoga(request_json['data'])
        else:
            return "Sorry, no type matched."
            
        result = result[0].tolist()
        response_data = json.dumps({
            'type': request_json['type'],
            'result': result
        })
        return Response(response=response_data, status=200, mimetype="application/json")
    else:
        return "Sorry, no json data received."
        
        
@app.route("/item/dynamic", methods=['GET', 'POST'])
def dynamic_item():
    request_json = request.get_json(force=True)
    if request_json:
        if request_json['type'] == 'sd':
            cur_data = checkout_dynamic_lens(sequence_data[request_json['type']], request_json['data'])
            if cur_data is None:
                result = [0, 100]
            else:
                result = fitness_sd(cur_data)
                result = result[0].tolist()
            
        response_data = json.dumps({
            'type': request_json['type'],
            'result': result
        })
        return Response(response=response_data, status=200, mimetype="application/json")
    else:
        return "Sorry, no json data received."


@app.route("/score", methods=['GET', 'POST'])
def score():
    request_json = request.get_json(force=True)
    if request_json:
        score = 0.5
        mean_score = 0.5
        if request_json['type'] == 'jianshencao01':
            score, mean_score = dancing_score(
                request_json['type'], request_json['data'], request_json['timeline'])
                
        response_data = json.dumps({
            'type': request_json['type'],
            'result': str(score),
            'mean_result': str(mean_score)
        })
        return Response(response=response_data, status=200, mimetype="application/json")
    else:
        return "Sorry, no json data received."

@app.route("/file/<filetype>/<filename>", methods=['GET'])
def get_file(filetype, filename):
    dir_path = os.getcwd() + "/" + filetype + "/"
    print('GET FILE: ', dir_path + filename)
    return send_from_directory(dir_path, filename, as_attachment=True)


def fitness_mabu(data):
    return static_inference(mabu_model, data)
    
def fitness_yoga(data):
    return static_inference(yoga_model, data)

def fitness_sd(data):
    return dynamic_inference(sd_model, data)

def init_models():
    global mabu_model, yoga_model, sd_model
    mabu_model = joblib.load(os.getcwd() + "/models/mabu_lg.pkl")
    yoga_model = joblib.load(os.getcwd() + "/models/yoga_lg.pkl")
    sd_model = joblib.load(os.getcwd() + "/models/sd_lg.pkl")
    
def init_sequence_data():
    global sequence_data
    sequence_data = dict()
    for dyn_tiem in CONST_DYNAMIC_TYPES:
      sequence_data[dyn_tiem] = []
    

if __name__ == "__main__":
    init_models()
    init_sequence_data()
    app.run(threaded=True,
            host='0.0.0.0',
            port=443,
            ssl_context=('server.crt', 'server.key'),
            debug=True)
