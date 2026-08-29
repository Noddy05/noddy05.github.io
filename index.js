const linksBase = document.getElementById('links_base');

function attachLinks(){
    for(let i = 0; i < blogLinks.length; i++){
        const link = document.createElement('a');
        link.setAttribute('href', blogLinks[i]);
        link.setAttribute('title', `Click to read "${titles[i]}"`);
        link.innerHTML = shortNames[i];
        linksBase.appendChild(link);
    }
}

attachLinks();