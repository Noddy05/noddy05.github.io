class Subsection:
    def __init__(self, title: str):
        self.title = title
        self.content = ""
        self.footnotes: str = []
        self.subsection_titles: str = []