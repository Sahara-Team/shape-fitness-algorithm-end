import numpy as np
import time
from utils import *
import os.path as osp
from const import CONST_DANCING_PATHS

def static_inference(model, data):
    data = normalize(np.array(data))
    ndata = np.array([data])
    pred = model.predict_proba(ndata)
    return np.round(pred, decimals=4)
    

def dynamic_inference(model, data):
    data = load_sequence_data(data)
    ndata = np.array([data])
    pred = model.predict_proba(ndata)
    return np.round(pred, decimals=4)
    
    
def dancing_score(_type, client_data, timeline):
    path = CONST_DANCING_PATH[_type]
    
    line = int(timeline) % (76)
    line = 15 if ((line // 15) * 15) == 0 else ((line // 15) * 15)
    filepath = osp.join(path,'timeline_' + str(line) + '.json')
    server_data = json.load(open(filepath, 'r'))
    server_data = np.array(server_data['points'])
    
    # client_data ´¦Àí
    p = cosine_vector_distance(np.array(normalize(server_data)), np.array(normalize(np.array(client_data))))
    # [-1, 1] -> [0, 1]
    p = (p + 1) / 2
    mean_score = p
    if p <= 0.5:
        score = -2.4 * p * p + 2.4 * p
    else:
        score = 0.5333 * p * p + 0.4667
        
    if line == 15:
        mean_score = score
    else:
        mean_score = (score + mean_score) / 2
    return np.round(score, decimals=4), np.round(mean_score, decimals=4)