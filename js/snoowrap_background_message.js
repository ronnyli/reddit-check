/*
Functions to send snoowrap messages to background.js
*/
function getCurrentUserName(callback) {
    chrome.runtime.sendMessage({
        'action' : 'getCurrentUserName'
    }, callback)
}

function getSubmission(id, callback)  {
    chrome.runtime.sendMessage({
        'action' : 'getSubmission',
        'id' : id
    }, callback)
}

function logInReddit(callback) {
    chrome.runtime.sendMessage({
        'action' : 'logInReddit',
        'interactive' : true
    }, callback)
}

function leaveComment(id, text, replyable_content_type, callback) {
    chrome.runtime.sendMessage({
        'action': 'leaveComment',
        'id': id,
        'text': text,
        'replyable_content_type': replyable_content_type
    }, callback)
}

function searchSubreddits(query, callback) {
    chrome.runtime.sendMessage({
        'action': 'searchSubreddits',
        'query': request.term
    }, callback)
}

