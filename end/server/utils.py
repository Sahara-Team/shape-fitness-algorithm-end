from Crypto.Cipher import AES
import base64
import numpy as np
import os
import json
import os.path as osp
import math
import uuid

mean_score = 0


def euclidean_distance(x1, y1, x2, y2):
    return np.square(x1 - x2) + np.square(y1 - y2)

def load_sequence_data(data):
    for ind, info in enumerate(data):
        useful_info = normalize(np.array(info))
        useful_info /= np.linalg.norm(useful_info)
        useful_info *= 100
        if ind == 0:
            eigen_vec = useful_info.copy()
        else:
            eigen_vec *= useful_info
    return eigen_vec
    
def checkout_dynamic_lens(lst, data):
    lst.append(data)
    if len(lst) < 5:
        return None
    elif len(lst) == 5:
        return lst
    else:
        lst.remove(lst[0])
        return lst

def normalize(ori):
    data = ori.copy()[:, :2]
    
    features = []
    vectors = []
    for i in range(5, len(data)):
        for j in range(i + 2, len(data)):
            vec_x = data[i][0] - data[j][0]
            vec_y = data[i][1] - data[j][1]
            vectors.append([vec_x, vec_y])
            
    for i in range(0, len(vectors)):
        x1, y1 = vectors[i]
        for j in range(i + 1, len(vectors)):
            if (i + j) % 2 == 0:
                continue
            x2, y2 = vectors[j]
            features.append(euclidean_distance(x1, y1, x2, y2))
            
    return features


def cosine_vector_distance(a, b):
    if a.shape != b.shape:
        raise RuntimeError(
            "array {} shape not match {}".format(a.shape, b.shape))
    if a.ndim == 1:
        a_norm = np.linalg.norm(a)
        b_norm = np.linalg.norm(b)
    else:
        raise RuntimeError("array dimensions {} not right".format(a.ndim))
    similiarity = np.dot(a, b.T)/(a_norm * b_norm)
    return similiarity


def sigmoid_function(z):
    fz = 1/(1 + math.exp(-z))
    return fz



