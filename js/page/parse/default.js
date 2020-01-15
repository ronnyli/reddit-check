var num_thredd = document.querySelectorAll('.thredd_results').length;
var arr=[];
if (num_thredd==0) {
    var paragraph_links = document.querySelectorAll('p>a');
    paragraph_links.forEach(elem => arr.push(elem.href));
}
arr;
