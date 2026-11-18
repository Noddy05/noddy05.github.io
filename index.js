const blogLinksBase = document.getElementById('links_base');
const articleLinksBase = document.getElementById('article_links');

function attachLinks(){
    for(let i = 0; i < blogLinks.length; i++){
        const container = document.createElement('flex');
        container.setAttribute('id', blogShortNames[i]);
        container.setAttribute('class', 'blog-container');

        const link = document.createElement('a');
        link.setAttribute('href', blogLinks[i]);
        link.setAttribute('title', `Click to read "${blogTitles[i]}"`);

        const title = document.createElement('p');
        title.setAttribute('class', 'blog-title');
        title.innerHTML = blogShortNames[i];
        
        const image = document.createElement('img');
        image.setAttribute('src', `Blogs/${blogShortNames[i]}/thumbnail.png`);
        image.setAttribute('class', 'blog-img');

        blogLinksBase.appendChild(container);
        container.appendChild(link);
        container.appendChild(title);
        link.appendChild(image);
    }
    
    for(let i = 0; i < articleLinks.length; i++){
        const container = document.createElement('flex');
        container.setAttribute('id', articleShortNames[i]);
        container.setAttribute('class', 'article-container');

        const link = document.createElement('a');
        link.setAttribute('href', articleLinks[i]);
        link.setAttribute('title', `Click to read "${articleTitles[i]}"`);

        const textBox = document.createElement('div');
        textBox.setAttribute('class', 'article-textbox');

        const title = document.createElement('h2');
        title.setAttribute('class', 'article-title');
        title.innerHTML = articleTitles[i];

        const paragraph = document.createElement('p');
        paragraph.setAttribute('class', 'article-paragraph');
        paragraph.innerHTML = `Last edited: ${articleDates[i]}`;
        
        const image = document.createElement('img');
        image.setAttribute('src', `Articles/${articleShortNames[i]}/thumbnail.png`);
        image.setAttribute('class', 'article-img');

        articleLinksBase.appendChild(container);
        container.appendChild(link);
        container.appendChild(textBox);
        textBox.appendChild(title);
        textBox.appendChild(paragraph);
        link.appendChild(image);
    }
}


attachLinks();



// Vibe coded slide projects:
const VISIBLE = 3;                        // slides shown at once
const numArticles = blogLinksBase.children.length;
let mainProjectInShowcase = VISIBLE + Math.floor(Math.random() * numArticles);

const slides = Array.from(blogLinksBase.children);
const count = slides.length;              // number of real slides

function make_clone(slide) {
    const clone = slide.cloneNode(true);
    clone.removeAttribute("id");
    return clone;
}

// Clone VISIBLE slides at each end
blogLinksBase.prepend(...slides.slice(-VISIBLE).map(make_clone));
blogLinksBase.append(...slides.slice(0, VISIBLE).map(make_clone));

function slide_step() {
    const gap = parseFloat(getComputedStyle(blogLinksBase).columnGap) || 0;
    return blogLinksBase.children[0].offsetWidth + gap;
}

function jump_to_index(index) {
    blogLinksBase.style.scrollBehavior = "auto";
    blogLinksBase.style.scrollSnapType = "none";
    blogLinksBase.scrollLeft = index * slide_step();
    void blogLinksBase.offsetWidth;          // force reflow
    blogLinksBase.style.scrollBehavior = "";
    blogLinksBase.style.scrollSnapType = "";
}

// Start on the first real slide (the real slides begin after the VISIBLE prepended clones)
jump_to_index(mainProjectInShowcase - 1);

function updateShowcase(){
    if(mainProjectInShowcase == blogLinksBase.children.length - VISIBLE){
        blogLinksBase.scroll({ left: slide_step(), behavior: "instant" });
    }
    else if(mainProjectInShowcase == VISIBLE - 1){
        blogLinksBase.scroll({ left: (numArticles + 2) * slide_step(), behavior: "instant" });
    }

    if(mainProjectInShowcase < VISIBLE)
        mainProjectInShowcase = blogLinksBase.children.length - 1 - VISIBLE;
    else if(mainProjectInShowcase >= blogLinksBase.children.length - VISIBLE)
        mainProjectInShowcase = VISIBLE;
    for(let i = 0; i < blogLinksBase.children.length; i++){
        if(i == mainProjectInShowcase || i - numArticles == mainProjectInShowcase || i + numArticles == mainProjectInShowcase)
            blogLinksBase.children[i].classList.add('main');
        else
            blogLinksBase.children[i].classList.remove('main');
    }
    blogLinksBase.scroll({ left: (mainProjectInShowcase - 1) * slide_step(), behavior: "smooth" });
}
updateShowcase();

let hasSwiped = false;
document.getElementById("slide_left").addEventListener("click", () => {
    //links_base.scrollBy({ left: -slide_step(), behavior: "smooth" });
    hasSwiped = true;
    mainProjectInShowcase--;
    updateShowcase();
});
document.getElementById("slide_right").addEventListener("click", () => {
    //links_base.scrollBy({ left: slide_step(), behavior: "smooth" });
    hasSwiped = true;
    mainProjectInShowcase++;
    updateShowcase();
});

function autoSwipe(){
    setTimeout(() => {
        if(!hasSwiped){
            mainProjectInShowcase++;
            updateShowcase();
            autoSwipe();
        }
    }, 5000);
}
autoSwipe();


addEventListener('resize', () => {
    updateShowcase();
});