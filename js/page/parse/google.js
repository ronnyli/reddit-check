var num_thredd = document.querySelectorAll('.thredd_results').length;
var arr=[];
if (num_thredd==0) {
    var google_results = document.querySelectorAll('.r>a');
    google_results.forEach(elem => arr.push(elem.href));
}
arr;
