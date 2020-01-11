// TODO: loading animation (might need to be a GIF)
// TODO: create a new loader element for every link
var loader = document.createElement('div');
loader.className = 'loader';
loader.innerText = 'Loading...';
var num_thredd = document.querySelectorAll('.thredd_results').length;
var arr=[];
if (num_thredd==0) {
    var google_results = document.querySelectorAll('.r>a');
    google_results.forEach(elem => {
        arr.push(elem.href);
        elem.insertAdjacentElement('afterend', loader);
    });
}
arr;
