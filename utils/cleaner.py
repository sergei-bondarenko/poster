#!/usr/bin/env python3
from os import listdir, remove, path

'''
Cleaner for the files in uploads/ directory: Deletes files which
are not included in the data/data.json.
'''

def main():
    abs_path = path.dirname(path.realpath(__file__))
    with open(path.join(abs_path, '../data/data.json'), 'r') as f:
        data = f.read()
    for file in listdir(path.join(abs_path, '../uploads/')):
        if file.endswith('.piecemap.msgpack'):
            continue
        if file not in data:
            ans = input("{} is not in data.json. Delete? [Y/n] ".format(file))
            ans = ans.lower()
            if ans == 'yes' or ans == 'y' or ans == '':
                remove(path.join(abs_path, '../uploads/') + file)
                print('Deleted.')
            else:
                print('Skipped.')
    print("All is clean. Don't forget to sign and publish.")

if __name__ == "__main__":
    main()
