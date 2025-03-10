# python script to load in the file at partial-brazil.json and only keep 1/20 of the points

import json

with open('partial-brazil.json') as f:
    data = json.load(f)
    
    # data is an array of points
    
    # keep every 20th point

    new_data = []
    for i in range(0, len(data), 20):
      new_data.append(data[i])

    with open('partial-brazil-20.json', 'w') as f:
      json.dump(new_data, f)



