#!/usr/bin/env python3
import json
from os import listdir, remove, path

'''
Cleaner for the files in uploads/ directory: Deletes files which
are not included in the data/data.json. Also finds duplicates.
'''

def main():
    abs_path = path.dirname(path.realpath(__file__))

    print("Finding duplicates...")
    with open(path.join(abs_path, '../content.json'), 'r') as f:
        content = f.read()
    files = json.loads(content)['files_optional']
    seen = {}
    for filename, value in files.items():
        if value['sha512'] not in seen:
            seen[ value['sha512'] ] = 1
        else:
            if seen[ value['sha512'] ] == 1:
                print(filename)

    with open(path.join(abs_path, '../data/data.json'), 'r') as f:
        data = f.read()
    print("\nFindind files which are not present in data/data.json...")
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

    print("Don't forget to sign and publish.")

if __name__ == "__main__":
    main()
