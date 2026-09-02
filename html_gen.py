from math_field import *
from subsection import *
import os
from os import listdir
from pathlib import Path
import time

class HTMLBuilder():
    math_commands = {
        '\\O': '\\mathcal{O}',
        '\\Z': '\\mathbb{Z}',
        '\\C': '\\mathbb{C}',
        '\\R': '\\mathbb{R}',
        '\\Q': '\\mathbb{Q}',
        '\\P': '\\mathbb{P}',
        '\\E': '\\mathbb{E}',
        '\\N': '\\mathbb{N}',
        '\\A': '\\mathbf{A}',   
    }
    color_codes = {
        'loop': 'keyword',
        'for': 'keyword',
        'while': 'keyword',
        'continue': 'keyword',
        'to': 'keyword',
        'if': 'keyword',
        'else': 'keyword',
        'end': 'keyword',
        'from': 'keyword',
        'output': 'keyword',
        'return': 'keyword',
        'break': 'keyword',

        '+': 'operation',
        '-': 'operation',
        '*': 'operation',
        '/': 'operation',
        '>': 'operation',
        '<': 'operation',
        '=': 'operation',
        'not': 'operation',
        'and': 'operation',
        'or': 'operation',
        '..': 'operation',

        '...': 'literal',
        '1': 'literal',
        '2': 'literal',
        '3': 'literal',
        '4': 'literal',
        '5': 'literal',
        '6': 'literal',
        '7': 'literal',
        '8': 'literal',
        '9': 'literal',
        '0': 'literal',
        'true': 'literal',
        'false': 'literal',

        'len': 'built-in',
    }

    custom_keywords = {
        '~': [ '~', 'variable', True ],
        '//': [ '\n', 'comment', False ],
        '##': [ '##', 'built-in', True ],
    }

    format_commands = {
        '\\noindent': '',
        r'\\': '<br>',
    }

    valid_command_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    def __init__(self):
        self.subsections: Subsection = [ Subsection("1) Introduction") ]
        self.index = 0
        self.is_math_field = False
        self.title = "Unknown title"
        self.short_name = "Unknown name"
        self.math_fields: MathField = []
        self.num_footnotes = 0
        self.num_figures = 0
        self.scripts = []
        self.styles = []


    def starts_with(self, compare_to, all_text):
        return compare_to == all_text[self.index:self.index + len(compare_to)]

    def start_math_field(self):
        self.math_fields.append(MathField(self.index))
    def read_command(self, all_text):
        command_name = '\\'

        # i think all chars are valid for starting chars so just set j to be + 2 since we dont 
        # care about the first char:
        j = self.index + 2
        if(j > len(all_text)):
            return [ ]

        if all_text[self.index + 1] not in self.valid_command_chars:
            return [ all_text[self.index:j] ]
        
        command_name += all_text[j - 1]

        while j < len(all_text) and all_text[j] in self.valid_command_chars:
            command_name += all_text[j]
            j += 1

        args = []

        open_braces = 0
        if all_text[j] == '{':
            open_braces += 1

        while j < len(all_text) and open_braces > 0:
            j += 1
            arg_value = ''
            while open_braces > 0:
                if all_text[j] == '{':
                    open_braces += 1
                elif all_text[j] == '}':
                    open_braces -= 1
                else:
                    arg_value += all_text[j]
                j += 1
            args.append(arg_value)

            if j < len(all_text) and all_text[j] == '{':
                open_braces += 1

        return [ command_name, *args ]

    def recreate_command(self, command):
        out = command[0]
        for i in range(1, len(command)):
            out += '{' + command[i] + '}'
        return out

    def move_command(self, command):
        self.index += len(self.recreate_command(command)) - 1

    def try_color(self, code, i, keyword, type):
        j = i + len(keyword)

        new_code = code
        skip = 0
        if new_code[i:j] == keyword:
            extra = f'<keyword class="{type}">{code[i:j]}</keyword>'
            skip = len(extra)
            new_code = f'{code[0:i]}{extra}{code[j:]}'
        return [ new_code, skip ]

    def color_inside(self, code, i, start_marking, end_marking, keyword, remove_markings: bool):
        if(code[i:i + len(start_marking)] == start_marking):
            new_code = code

            j = i + 1
            while j < len(new_code) and new_code[j:j + len(end_marking)] != end_marking:
                j += 1

            start = i
            end = j
            if remove_markings:
                start = i + len(start_marking)
                end = j + len(end_marking)

            extra = f'<keyword class="{keyword}">{new_code[start:j]}</keyword>'
            new_code = f'{new_code[0:i]}{extra}{new_code[end:]}'
            skip = len(extra)
            return [ new_code, skip ]

        return [ code, 0 ]

    def colorize_code(self, code):
        i = 0
        new_code = code
        while i < len(new_code) - 1:
            output = []
            for key, value in zip(self.custom_keywords.keys(), self.custom_keywords.values()):
                output = self.color_inside(new_code, i, key, value[0], value[1], value[2])
                if(output[1] > 0):
                    new_code = output[0]
                    i += output[1]

            for key, value in zip(self.color_codes.keys(), self.color_codes.values()):
                output = self.try_color(new_code, i, key, value)
                if output[1] > 0:
                    i += output[1] - 1
                    new_code = output[0]
                    break
                
            i += 1
        return new_code

    def parse(self, char, all_text):
        if char == '\n':
            return char

        if char == '$':
            self.is_math_field = not self.is_math_field

            if self.is_math_field:
                self.start_math_field()
            return char

        if char == '\\':
            command = self.read_command(all_text)
            command_recreated = self.recreate_command(command)
            #print(command)

            if command[0] == '\\begin':
                if command[1] == 'equation*':
                    self.is_math_field = True
                    self.start_math_field()
                elif command[1] == 'equation':
                    self.is_math_field = True
                    self.start_math_field()

                self.math_fields[len(self.math_fields) - 1].content += command_recreated
                return char

            elif command[0] == '\\end':
                if command[1] == 'equation*':
                    self.is_math_field = False
                elif command[1] == 'equation':
                    self.is_math_field = False

                self.math_fields[len(self.math_fields) - 1].content += command_recreated
                return char

            if command[0] == '\\[':
                self.is_math_field = True
                self.start_math_field()
                return char

            if command[0] == '\\]':
                self.is_math_field = False
                return char
            
            elif command[0] == '\\shortname':
                self.short_name = command[1]
                self.move_command(command)
                return ''
            
            elif command[0] == '\\script':
                self.move_command(command)
                self.scripts.append(command[1])
                return ''
            
            elif command[0] == '\\style':
                self.move_command(command)
                self.styles.append(command[1])
                return ''
            
            elif command[0] == '\\section':
                self.title = command[1]
                self.move_command(command)
                return ''
            
            elif command[0] == '\\figtext':
                self.move_command(command)
                return f'<p class="image-text">Figure {self.num_figures}: {command[1]}</p>'
            
            elif command[0] == '\\div':
                self.move_command(command)
                return f'<div id="{command[1]}" class="{command[2]}"></div>'
            
            elif command[0] == '\\code':
                self.move_command(command)
                code = self.colorize_code(command[1])
                return f'<pre><code class="language-html">{code}</code></pre>'
            
            elif command[0] == '\\subsection':
                self.move_command(command)

                ss_name = f"{len(self.subsections) + 1}) {command[1]}"
                self.subsections.append(Subsection(ss_name))
                return f'<h2 id="{len(self.subsections)}">{ss_name}</h2>'
            
            elif command[0] == '\\footnote':
                self.move_command(command)
                ss_index = len(self.subsections) - 1

                self.subsections[ss_index].footnotes.append(command[1])
                self.num_footnotes += 1
                return f'<a href="#footnote_{self.num_footnotes}">$^{self.num_footnotes}$</a>'
            
            elif command[0] == '\\subsubsection':
                self.move_command(command)
                ss_index = len(self.subsections) - 1
                sss_index = len(self.subsections[ss_index].subsection_titles)

                title = f'{ss_index + 1}.{sss_index + 1}) {command[1]}'
                self.subsections[ss_index].subsection_titles.append(title)

                return f'<h3 id="{ss_index + 1}_{sss_index + 1}">{title}</h3>'
            
            elif command[0] == '\\textsc':
                self.move_command(command)
                return f'<textsc>{command[1]}</textsc> '
            
            elif command[0] == '\\href':
                self.move_command(command)
                return f'<a target="_blank" href="{command[1]}">{command[2]}</a>'
            
            elif command[0] == '\\underline':
                self.move_command(command)
                return f'<u>{command[1]}</u> '
            
            elif command[0] == '\\fig':
                self.move_command(command)
                self.num_figures += 1
                return f'<img src="{command[1]}" width="{command[2]}%"> '

            if not self.is_math_field:
                for key, value in zip(self.format_commands.keys(), self.format_commands.values()):
                    if(command[0] == key):
                        self.move_command(command)
                        return value
            else:
                for key, value in zip(self.math_commands.keys(), self.math_commands.values()):
                    if(command[0] == key):
                        self.move_command(command)
                        return value

        return char

    def read_page(self, file_name):
        with open(file_name) as file:
            all_text = file.read()

            while self.index < len(all_text):
                text = self.parse(all_text[self.index], all_text)
                self.subsections[len(self.subsections) - 1].content += text
                self.index += 1

        #print(parsed_text)

    def gen_html(self, file_name):
        if(not os.path.isfile(file_name)):
            open(file_name, 'x')

        self.subsections[0].content = f'<img src="thumbnail.png" id="thumbnail"><h2 id="1">{self.subsections[0].title}</h2>{self.subsections[0].content}'

        self.subsections[0].content += '<div id="toc"><h2>Table of contents</h2><p>'
        for i in range(len(self.subsections)):
            self.subsections[0].content += '<br><a href="#' + str(i + 1) + '">' + self.subsections[i].title + '</a>'
            for j in range(len(self.subsections[i].subsection_titles)):
                self.subsections[0].content += f'<br><a href="#{i + 1}_{j + 1}">$\\quad${self.subsections[i].subsection_titles[j]}</a>'
        self.subsections[0].content += '</p></div>'

        with open('html_header.txt') as html_header:
            with open(file_name, 'w') as file:
                file.write(html_header.read() + "\n")
                file.write('\t<title>' + self.short_name + '</title>\n')

                for stylesheet in self.styles:
                    file.write(f'\t<link rel="stylesheet" type="text/css" href="./{stylesheet}">')

                file.write('</head>\n<body>\n')

                file.write('<div id="content">')

                file.write('<flexbox class="header"><img class="logo" src="../../zeta_spiral_hq_cropped.png">' +
                    '<div id="header-text"><h1>' + self.title + '</h1></div></flexbox>')

                footnote_so_far = 0
                for subsection, i in zip(self.subsections, range(len(self.subsections))):
                    file.write('<div class="page">')
                    file.write('<p>' + subsection.content + '</p>')

                    for footnote in subsection.footnotes:
                        footnote_so_far += 1
                        file.write(f'<br id="footnote_{footnote_so_far}"><footnote>$\\quad${footnote_so_far}. {footnote}</footnote>')

                    file.write('</div>')

                file.write('</div>')

                file.write('</body></html>')
                for script in self.scripts:
                    file.write(f'\n<script src="../../dest/{self.short_name}/{script}"></script>')

    def blog_folder_path(self):
        return 'Blogs/' + self.short_name
    def blog_html_path(self):
        return self.blog_folder_path() + '/index.html'


    def gen_post(self, post_name: str):
        self.read_page("BlogFiles/" + post_name + ".tex")
        if(not os.path.exists(self.blog_folder_path())):
            os.makedirs(self.blog_folder_path())

        self.gen_html(self.blog_html_path())