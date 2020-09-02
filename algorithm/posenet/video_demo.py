import cv2
import argparse
import os
import os.path as osp
import json
import torch
import numpy as np

import posenet
from posenet.utils import _process_input


parser = argparse.ArgumentParser()
parser.add_argument('--model', type=int, default=75)
parser.add_argument('--scale_factor', type=float, default=1.0)
parser.add_argument('--notxt', action='store_true')
parser.add_argument('--video_dir', type=str, default='./video')
parser.add_argument('--output_dir', type=str, default='./video_json')
parser.add_argument('--save_json', type=bool, default=True)

args = parser.parse_args()

def init_model(model_config):
    model = posenet.load_model(model_config)
    model = model.cuda()
    return model
    
def inference(model, image):
    with torch.no_grad():
      input_image = torch.Tensor(image).cuda()
      heatmaps_result, offsets_result, displacement_fwd_result, displacement_bwd_result = model(input_image)
      pose_scores, keypoint_scores, keypoint_coords = posenet.decode_multiple_poses(
          heatmaps_result.squeeze(0),
          offsets_result.squeeze(0),
          displacement_fwd_result.squeeze(0),
          displacement_bwd_result.squeeze(0),
          output_stride=model.output_stride,
          max_pose_detections=10,
          min_pose_score=0.25)
          
      return pose_scores, keypoint_scores, keypoint_coords
      
def filt_poses(pose_scores, keypoint_scores, keypoint_coords):
    ind = np.argmax(pose_scores)
    n_ps = np.array([pose_scores[ind]])
    n_ks = np.array([keypoint_scores[ind]])
    n_kc = np.array([keypoint_coords[ind]])
    return n_ps, n_ks, n_kc
    
def createDirs(path):
    if osp.exists(path) is False:
        os.mkdir(path)

def judge_neg(keypoint_coord):
    y1, x1 = keypoint_coord[0]
    y2, x2 = keypoint_coord[16]
    if abs(y1-y2) < 300:
        return False
    else:
        return True

def main():   
    model = init_model(args.model)

    createDirs(args.output_dir)

    for video_filename in os.listdir(args.video_dir):
      if args.save_json == True:
        json_dir = osp.join(args.output_dir, video_filename.split('.')[0])
        createDirs(json_dir)
    
      cap = cv2.VideoCapture(osp.join(args.video_dir, video_filename))
      
      fps = int(cap.get(cv2.CAP_PROP_FPS))
      size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
      videoWriter = cv2.VideoWriter(osp.join(args.output_dir, video_filename),  cv2.VideoWriter_fourcc(*"mp4v"), fps, size)
      
      cnt = 0

      while True:
          ret, frame = cap.read()
          if ret:
              cnt += 1

              input_image, draw_image, output_scale = _process_input(frame, args.scale_factor, model.output_stride)
  
              pose_scores, keypoint_scores, keypoint_coords = inference(model, input_image)
              keypoint_coords *= output_scale
              
              pose_scores, keypoint_scores, keypoint_coords = filt_poses(pose_scores, keypoint_scores, keypoint_coords)
              
              if judge_neg(keypoint_coords[0]) is False:
                  continue
      
              draw_image = posenet.draw_skel_and_kp(draw_image, pose_scores, keypoint_scores, keypoint_coords, min_pose_score=0.00, min_part_score=0.00)
              videoWriter.write(draw_image)
              
              
              if cnt % 15 == 0 and args.save_json == True:
                points_dict = {}
                flatten_info = []
                for i in range(len(keypoint_scores[0])):
                    y, x = keypoint_coords[0][i]
                    flatten_info.append([x, y, keypoint_scores[0][i]])
                    
                points_dict['points'] = flatten_info
                
                with open(osp.join(json_dir, 'timeline_' + str(cnt) + '.json'), 'w') as f:
                    json.dump(points_dict, f, indent=4)
          else:
              break
              
      cap.release()
      videoWriter.release()
      print(video_filename + ' Done!')

if __name__ == "__main__":
    main()
