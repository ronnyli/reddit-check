const anchorme = require("anchorme").default;
const snoo = require('./snoowrap_background');

function findLinksText(text) {
    let anchorme_links = anchorme(text,{
        list: true,
        emails: false,
        ips: false,
        files: false
    });
    let links = anchorme_links.map(link_obj => link_obj.encoded);
    return [...new Set(links)];
}

function _parseReddit(content) {
    const fullname = content.name || 't1_' + content.id;
    const content_type = fullname.split('_')[0];
    let txt_promise;
    if (content_type == 't3') {
        if (content.selftext) {
            text = content.selftext;
        } else {  // link post
            txt_promise = snoo.getSnoowrapRequester()
            .then(r => r.getSubmission(fullname).fetch())
            .then(submission => {
                // if (!submission.comments) {
                //     console.log(submission);
                // }
                const replies = submission.comments.map(reply => reply.body);
                return replies.join(' ');
            });
        }
    } else if (content_type == 't1') {  // comment
        text = content.body;
    }
    txt_promise = txt_promise || new Promise(resolve => resolve(text));
    return txt_promise
    .then(findLinksText)
    .then(links => links.map(link => {return {
        link: link,
        content: content
    }}));
}

function _groupby(arr, key) {
    return arr.reduce((acc, elem) => {
        acc[elem[key]] = acc[elem[key]] || [];
        acc[elem[key]].push(elem);
        return acc;
    }, Object.create(null));
}

async function findLinks(listing) {
    const all_links = await Promise.all(
        listing.map(async (elem) => await _parseReddit(elem))
    ).then(values => [].concat.apply([], values));
    return _groupby(all_links, key='link');
}

exports.findLinks = findLinks;
exports.findLinksText = findLinksText;
exports._groupby = _groupby;
exports._parseReddit = _parseReddit;
