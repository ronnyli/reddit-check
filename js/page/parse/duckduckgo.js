var num_thredd = document.querySelectorAll('.thredd_results').length;
var arr=[];
if (num_thredd==0) {
    var ddg_results = document.querySelectorAll('.result__a');
    ddg_results.forEach(elem => arr.push(elem.href));
}
arr;
