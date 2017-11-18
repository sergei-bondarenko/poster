#!/usr/bin/env python3

from magic import Magic
from argparse import ArgumentParser
from os import listdir, path
from json import load, dump
from re import match
from random import randint
from shutil import copyfile
from time import time

'''
Creates multiple blog posts using files from a specified directory.
One file per post. Reqires a python-magic installed.
'''

class File:
    '''This class stores information about file.'''
    def __init__(self, path):
        self.path = path
        if '/' in path:
            self.filename = path.rsplit('/', 1)[1]
        else:
            self.filename = path
        self.extension = path.rsplit('.', 1)[1]
        self.mime_type = Magic(mime=True).from_file(path)
        if not self.is_good_name():
            self.new_name = "{}.{}".format(randint(0, 10**9), self.extension)
        else:
            self.new_name = self.filename

    def is_good_name(self):
        '''Check if name is short and contains only good characters.'''
        if (len(self.filename) < 256
            and match("^[a-z\[\]\(\) A-Z0-9_@=\.\+-/]+$", self.filename)):
            return True
        else:
            return False


def body(file):
    '''Makes the post body.'''
    if 'video' in file.mime_type:
        result = ('<video controls>'
            '<source src="uploads/{}" type="{}">'
            '</video>').format(file.new_name, file.mime_type)
    elif 'audio' in file.mime_type:
        result = ('<audio controls>'
            '<source src="uploads/{}" type="{}">'
            '</audio>').format(file.new_name, file.mime_type)
    elif 'image' in file.mime_type:
        result = ('<a href="uploads/{}" target="{}"><img src="uploads/{}">'
            '</a>').format(file.new_name, file.new_name, file.new_name)
    else:
        result = None
    return result

def main():
    abs_path = path.dirname(path.realpath(__file__))
    parser = ArgumentParser(
        description="Creates multiple blog posts using files from a specified "
            "directory. One file per post. Reqires a python-magic installed.")
    parser.add_argument('dir', help="Directory from which files are taken.")
    args = parser.parse_args()
    dir = args.dir

    with open(path.join(abs_path, '../data/data.json'), 'r') as f:
        data = load(f)

    files = listdir(dir)
    print("Total number of files: {}.".format(len(files)))

    for name in files:
        file = File(path.join(dir, name))
        copyfile(file.path,
            path.join(abs_path, '../uploads/{}'.format(file.new_name)))
        if file.filename != file.new_name:
            print("Renamed '{}' to '{}'.".format(file.filename, file.new_name))

        post = {
            'post_id': data['next_post_id'],
            'date_published': int(time() * 1000),
            'body': body(file)
        }
    
        data['post'].insert(0, post)
        data['next_post_id'] += 1

    with open(path.join(abs_path, '../data/data.json'), 'w') as f:
        dump(data, f, indent=4)

    print("Done. Don't forget to sign and publish.")

if __name__ == "__main__":
    main()
