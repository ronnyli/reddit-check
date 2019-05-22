CLIENT_ID_DEV = 'FAKE ID';
const chrome = require("sinon-chrome");
window.chrome = chrome;
const lscache = {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    flush: jest.fn()
};
window.lscache = lscache;
const snoo = require('../js/snoowrap_background');

test('cached logInReddit', () => {
    lscache.get.mockReturnValue(true);
    snoo.logInReddit(null, (status) => {
        expect(status).toBe('Success');
    })
});

test('logInReddit', () => {
});

// test('submitPost', () => {
//     expect(0).toBe(1);
// });

// test('getCurrentUserName', () => {
//     expect(0).toBe(1);
// });

// test('searchSubreddits', () => {
//     expect(0).toBe(1);
// });

// test('getSubmission', () => {
//     expect(0).toBe(1);
// });

// test('getSubredditBatch', () => {
//     expect(0).toBe(1);
// });

// test('leaveComment', () => {
//     expect(0).toBe(1);
// });

// test('removeReddit', () => {
//     expect(0).toBe(1);
// });

// test('searchSubmissionsForURL', () => {
//     expect(0).toBe(1);
// });

// test('searchCommentsForURL', () => {
//     expect(0).toBe(1);
// });

// test('saveReddit', () => {
//     expect(0).toBe(1);
// });

// test('voteReddit', () => {
//     expect(0).toBe(1);
// });

// test('fetchAnonymousToken', () => {
//     expect(0).toBe(1);
// });

// test('getSnoowrapRequester', () => {
//     expect(0).toBe(1);
// });
