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
const reddit_parser = require('../js/reddit_parser');

// test _parseReddit

// _groupby

// findLinks
test('getBatchIds success', async () => {
    const mockSuccessResponse = {
        name: 't1_abc'
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        fetch: () => mockJsonPromise,
    });
    const spy = jest.spyOn(snoo, 'getSnoowrapRequester').mockResolvedValue(new Promise(function(resolve, reject) {
        resolve({
            getSubmission: jest.fn().mockResolvedValue(mockFetchPromise)
        })
    }));
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const actual = await reddit_api.getBatchIds(['a', 'b', 'c']);
    expect(actual).toEqual(['first', 'second']);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.reddit.com/api/info.json?id=a,b,c');
});
