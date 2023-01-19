import os
import json
from datetime import datetime

# Opening JSON file
json_file = open(os.getcwd() + '\songs_final.json',encoding="utf-8")

# returns JSON object as 
# a dictionary
data = json.load(json_file)
with open("songs_csv_with_features_updated.json", "w",encoding="utf-8") as outfile:
    for json_ in data['songs']:
        json_["timestamp"] = datetime.now().timestamp()
        json.dump(json_, outfile,ensure_ascii=False)
        outfile.write('\n')
json_file.close()