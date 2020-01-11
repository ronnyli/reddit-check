// TODO: loading animation (might need to be a GIF)
var loader = document.createElement('div');
loader.className = 'loader';
loader.innerText = 'Loading...';
var num_thredd = document.querySelectorAll('.thredd_results').length;
var arr=[];
if (num_thredd==0) {
    var paragraph_links = document.querySelectorAll('p>a');
    paragraph_links.forEach(elem => {
        arr.push(elem.href);
        elem.insertAdjacentElement('afterend', loader);
    });
}
arr;
