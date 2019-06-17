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

test('_groupby success', () => {
    const arr = [{
        a: 1,
        b: 'b'
    }, {
        a: 2,
        b: 'a'
    }, {
        a: 1,
        b: 'c'
    }, {
        a: 3,
        b: 'd'
    }]
    const _grp = reddit_parser._groupby(arr, 'a');
    expect(_grp).toEqual({
        1: [{a: 1, b: 'b'}, {a: 1, b: 'c'}],
        2: [{a: 2, b: 'a'}],
        3: [{a: 3, b: 'd'}]
    });
});

test('_parseReddit selftext success', async () => {
    const content = {
        name: 't3_abc',
        selftext: 'wwwalsasdf [http://www.abc.com](www.abc.com) and www.google.com kadsfsadf'
    };
    const actual = await reddit_parser._parseReddit(content);
    expect(actual).toEqual([{
        link: 'www.abc.com',
        content: content
    }, {
        link: 'www.google.com',
        content: content
    }]);
});

test('_parseReddit linkpost success', async () => {
    const content = {
        name: 't3_abc',
        domain: 'imgur.com'
    };
    const mockSuccessResponse = {
        replies: [{
            body: 'abcdefg\\'
        }, {
            body: 'www.google.com'
        }, {
            body: 'lakfalsdf www.abc.com asdfasdf www.def.com'
        }]
    }
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const spy = jest.spyOn(snoo, 'getSnoowrapRequester').mockResolvedValue(new Promise(function(resolve, reject) {
        resolve({
            getSubmission: jest.fn(() => {
                return {fetch: () => mockJsonPromise}
            })
        })
    }));
    const actual = await reddit_parser._parseReddit(content);
    expect(actual).toEqual([{
        link: 'www.google.com',
        content: content
    }, {
        link: 'www.abc.com',
        content: content
    }, {
        link: 'www.def.com',
        content: content
    }]);
    spy.mockRestore();
});
test('_parseReddit comment success', async () => {
    const content = {
        id: 'abc',
        body: 'wwwalsasdf [http://www.abc.com](www.abc.com) and www.google.com kadsfsadf'
    };
    const actual = await reddit_parser._parseReddit(content);
    expect(actual).toEqual([{
        link: 'www.abc.com',
        content: content
    }, {
        link: 'www.google.com',
        content: content
    }]);
});

test('findLinksText only returns unique URLs', () => {
    let text = 'wwwalsasdf [http://www.abc.com](www.abc.com) and www.google.com kadsfsadf';
    let links = reddit_parser.findLinksText(text);
    expect(links).toEqual([
        'www.abc.com',
        'www.google.com'
    ])
});

test('findLinks success', async () => {
    const listing = [{
        id: 'abc',
        body: 'wwwalsasdf [http://www.abc.com](www.abc.com) and www.google.com kadsfsadf'
    }, {id: 'cdf',
        body: 'wwwalsasdf [http://www.xyz.com](www.abc.com) and www.zzzzze.com kadsfsadf'
    }];
    const actual = await reddit_parser.findLinks(listing);
    expect(actual).toEqual({
        "www.abc.com": [{link: "www.abc.com", content: listing[0]}, {link: "www.abc.com", content: listing[1]}],
        "www.google.com": [{link: "www.google.com", content: listing[0]}],
        "www.xyz.com": [{link: "www.xyz.com", content: listing[1]}],
        "www.zzzzze.com": [{link: "www.zzzzze.com", content: listing[1]}],
    });
});
