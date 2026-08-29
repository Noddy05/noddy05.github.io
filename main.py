from math_field import *
from subsection import *
from html_gen import *
from os import listdir
from pathlib import Path
import time


def update_js_links(path):
    with open(path) as f:
        lines = f.readlines()

    new_lines = [ f'const blogLinks = {links}\n', 
        f'const shortNames = {short_names}\n', 
        f'const titles = {titles}', ]
    if(len(lines) >= len(new_lines)):
        for i in range(len(new_lines)):
            lines[i] = new_lines[i]
        lines[len(new_lines) - 1] += '\n'
    else:
        lines = new_lines

    with open(path, "w") as f:
        f.writelines(lines)

links = []
short_names = []
titles = []
def build_posts():
    global links, short_names, titles
    links = []
    short_names = []
    titles = []

    print('Creating pages')
    for file in listdir('BlogFiles/'):
        start = time.time()
        file_name = Path(file.title()).stem
        post = HTMLBuilder()
        post.gen_post(file_name)

        print('- Generated blog for ' + post.short_name + f' in {(time.time() - start) * 1000:.2f} milliseconds')
        links.append(post.blog_html_path())
        short_names.append(post.short_name)
        titles.append(post.title)

    update_js_links('blogs.js')

build_posts()