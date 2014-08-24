import json
import pprint

JSON_FILE = "data/euclidsElementsNodesAndLinks.json"

def get_props(filename='data/euclidElementsDeps.json'):
    """
    filename -> dict
    """
    return json.load(open(filename))

def make_index(nodes):
    """
    list of nodes -> dictionary{prop -> index}
    # check this out (list comprehension, plus tuple-list -> dict)
    return dict([(obj['prop'], i) for i, obj in enumerate(nodes)])
    """
    d = {}
    for i, obj in enumerate(nodes):
        d[obj['prop']] = i
    return d

def result(node, dep, index):
    data = get_props()
    index = make_index(data[0])
    return {"source": index[node['prop']],
            "target": index[dep] }

def generate_links():
    data = get_props()
    index = make_index(data[0]) # prop -> index
    links = []
    for node in data[0]:
        for dep in node['propDependencies']:
            links.append(result(node, dep, index))
    data['links'] = links
    return json.dumps(data)

def write_json():
    json_file = open(JSON_FILE, "w")
    json_file.write(generate_links())
    json_file.close
    print "The operation was completed successfully."

# More Pythonic way to accomplish the same. Not debugged.
# def generate_links_pythonic():
#     data = get_props()
#     index = make_index(data['nodes'])
#     data['links'] = [result(node, dep, index) for obj in data['nodes'] for dep in obj]
#     return data


