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