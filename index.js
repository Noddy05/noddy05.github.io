const linksBase = document.getElementById('links_base');

function attachLinks(){
    for(let i = 0; i < blogLinks.length; i++){
        const container = document.createElement('flex');
        container.setAttribute('id', shortNames[i]);
        container.setAttribute('class', 'article-container');

        const link = document.createElement('a');
        link.setAttribute('href', blogLinks[i]);
        link.setAttribute('title', `Click to read "${titles[i]}"`);

        const title = document.createElement('p');
        title.setAttribute('class', 'article-title');
        title.innerHTML = shortNames[i];
        
        const image = document.createElement('img');
        image.setAttribute('src', `Blogs/${shortNames[i]}/thumbnail.png`);
        image.setAttribute('class', 'article-img');

        linksBase.appendChild(container);
        container.appendChild(link);
        container.appendChild(title);
        link.appendChild(image);
    }
}

attachLinks();


// Vibe coded slide projects:
const links_base = document.getElementById("links_base");
const VISIBLE = 3;                        // slides shown at once

const slides = Array.from(links_base.children);
const count = slides.length;              // number of real slides

function make_clone(slide) {
    const clone = slide.cloneNode(true);
    clone.removeAttribute("id");
    return clone;
}

// Clone VISIBLE slides at each end
links_base.prepend(...slides.slice(-VISIBLE).map(make_clone));
links_base.append(...slides.slice(0, VISIBLE).map(make_clone));

function slide_step() {
    const gap = parseFloat(getComputedStyle(links_base).columnGap) || 0;
    return links_base.children[0].offsetWidth + gap;
}

function jump_to_index(index) {
    links_base.style.scrollBehavior = "auto";
    links_base.style.scrollSnapType = "none";
    links_base.scrollLeft = index * slide_step();
    void links_base.offsetWidth;          // force reflow
    links_base.style.scrollBehavior = "";
    links_base.style.scrollSnapType = "";
}

// Start on the first real slide (the real slides begin after the VISIBLE prepended clones)
jump_to_index(VISIBLE);

let scroll_timer;
links_base.addEventListener("scroll", () => {
    clearTimeout(scroll_timer);
    scroll_timer = setTimeout(() => {
        const i = Math.round(links_base.scrollLeft / slide_step());
        if (i < VISIBLE) jump_to_index(i + count);                  // in the left clones
        else if (i >= VISIBLE + count) jump_to_index(i - count);    // in the right clones
    }, 100);
});

document.getElementById("slide_left").addEventListener("click", () => {
    links_base.scrollBy({ left: -slide_step(), behavior: "smooth" });
});
document.getElementById("slide_right").addEventListener("click", () => {
    links_base.scrollBy({ left: slide_step(), behavior: "smooth" });
});