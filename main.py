from math_field import *
from subsection import *
from html_gen import *
from os import listdir
from pathlib import Path
import time

links = []
short_names = []
titles = []
dates = []
ranking = []

def update_js_links(path: str, prefix: str):
    sortedList = list(zip(links, short_names, titles, dates, ranking))
    sortedList.sort(key = lambda x: x[-1], reverse = True)

    sorted_links = [ x[0] for x in sortedList ]
    sorted_short_names = [ x[1] for x in sortedList ]
    sorted_titles = [ x[2] for x in sortedList ]
    sorted_dates = [ x[3] for x in sortedList ]

    with open(path) as f:
        lines = f.readlines()

    new_lines = [ f'const {prefix}Links = {sorted_links}\n', 
        f'const {prefix}ShortNames = {sorted_short_names}\n', 
        f'const {prefix}Titles = {sorted_titles}\n', 
        f'const {prefix}Dates = {sorted_dates}', ]
    if(len(lines) >= len(new_lines)):
        for i in range(len(new_lines)):
            lines[i] = new_lines[i]
        lines[len(new_lines) - 1] += '\n'
    else:
        lines = new_lines

    with open(path, "w") as f:
        f.writelines(lines)


def build_posts():
    global links, short_names, titles, dates, ranking, currentToFolder, currentFromFolder

    from_folder = 'BlogFiles/'
    to_folder = 'Blogs/'

    print('Creating interactive articles')
    for file in listdir(from_folder):
        start = time.time()
        file_name = Path(file.title()).stem
        post = HTMLBuilder()
        post.gen_post(file_name, to_folder, from_folder)

        print('- Generated blog for ' + post.short_name + f' in {(time.time() - start) * 1000:.2f} milliseconds')
        links.append(post.blog_html_path(to_folder))
        short_names.append(post.short_name)
        titles.append(post.title)
        dates.append('')
        ranking.append(0);

    update_js_links('blogs.js', 'blog')


    links = []
    short_names = []
    titles = []
    dates = []
    ranking = []

    from_folder = 'ArticleFiles/'
    to_folder = 'Articles/'
    print('Creating non-interactive articles')
    for file in listdir(from_folder):
        start = time.time()
        file_name = Path(file.title()).stem
        post = HTMLBuilder()
        post.gen_post(file_name, to_folder, from_folder)

        print('- Generated blog for ' + post.short_name + f' in {(time.time() - start) * 1000:.2f} milliseconds')
        links.append(post.blog_html_path(to_folder))
        short_names.append(post.short_name)
        titles.append(post.title)
        dates.append(post.date)

        dateSplit = post.date.split('/')
        ranking.append(int(dateSplit[0]) + 32 * (int(dateSplit[1]) + 13 * int(dateSplit[2])));

    update_js_links('articles.js', 'article')
    

build_posts()