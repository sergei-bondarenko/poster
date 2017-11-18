#!/usr/bin/env python3
from os import listdir, remove

'''
Cleaner for the files in uploads/ directory: Deletes files which
are not included in the data/data.json
'''

def main():
    with open('../data/data.json', 'r') as f:
        data = f.read()
    for file in listdir('../uploads/'):
        if file not in data:
            ans = input("{} is not in data.json. Delete? [Y/n] ".format(file))
            ans = ans.lower()
            if ans == 'yes' or ans == 'y' or ans == '':
                remove('../uploads/' + file)
                print('Deleted')
            else:
                print('Skipped')

if __name__ == "__main__":
    main()
