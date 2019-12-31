// TODO: loading animation (might need to be a GIF)
var loader = document.createElement('div');
loader.className = 'loader';
loader.innerText = 'Loading...';
var arr=[];
var google_results = document.querySelectorAll('.r>a');
google_results.forEach(elem => {
    arr.push(elem.href);
    elem.insertAdjacentElement('afterend', loader);
});
arr;
