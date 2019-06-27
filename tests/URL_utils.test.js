const url_utils = require('../js/URL_utils');

beforeEach(() => {
    global.chrome;
});

afterEach(() => {
    jest.clearAllMocks();
    delete global.chrome;
});

test('trimURL no http', function() {
    const url = 'chrome://extensions';
    expect(url_utils.trimURL(url)).toBe(url);
});

test('trimURL youtube video', function() {
    const url = 'https://www.youtube.com/watch?v=llNuwhZWXKA';
    expect(url_utils.trimURL(url)).toBe('www.youtube.com/watch?v=llNuwhZWXKA');
});

test('trimURL http only', function() {
    const url = 'https://www.abc.com?abc=123';
    expect(url_utils.trimURL(url, true)).toBe('www.abc.com?abc=123');
});

test('trimURL success', function() {
    const url = 'https://www.youtube.com/results?search_query=abc#def';
    expect(url_utils.trimURL(url)).toBe('www.youtube.com/results');
});

test('getCanonicalUrl success', function(done) {
    const results = ['abc'];
    const mockCallback = jest.fn((_, callback) => callback(results));
    global.chrome = {
        tabs: {
            executeScript: mockCallback
        },
        runtime: {
            lastError: null
        }
    };
    url_utils.getCanonicalUrl(canonical_url => {
        expect(canonical_url).toBe('abc');
        done();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('getCanonicalUrl undefined results', function(done) {
    const results = undefined;
    const mockCallback = jest.fn((_, callback) => callback(results));
    global.chrome = {
        tabs: {
            executeScript: mockCallback
        },
        runtime: {
            lastError: null
        }
    };
    url_utils.getCanonicalUrl(canonical_url => {
        expect(canonical_url).toBe(null);
        done();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('getCanonicalUrl chrome.runtime.lastError is true', function(done) {
    const results = undefined;
    const mockCallback = jest.fn((_, callback) => callback(results));
    global.chrome = {
        tabs: {
            executeScript: mockCallback
        },
        runtime: {
            lastError: true
        }
    };
    url_utils.getCanonicalUrl(canonical_url => {
        expect(canonical_url).toBe(null);
        done();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('getTabUrl with parameters', function(done) {
    const tabs = [{
        url: 'abc#def'
    }];
    const mockCallback = jest.fn((_, callback) => callback(tabs));
    global.chrome = {
        tabs: {
            query: mockCallback,
            executeScript: mockCallback
        },
        runtime: {
            lastError: false
        }
    };
    url_utils.getTabUrl(url => {
        expect(url).toEqual(tabs[0]);
        done();
    });
});

test('getTabUrl with parameters but no canonical link', function(done) {
    const tabs = [{
        url: 'abc#def'
    }];
    const mockCallback = jest.fn((_, callback) => callback(tabs));
    global.chrome = {
        tabs: {
            query: mockCallback,
            executeScript: mockCallback
        },
        runtime: {
            lastError: true
        }
    };
    url_utils.getTabUrl(url => {
        expect(url).toEqual('abc#def');
        done();
    });
});

test('getTabUrl success', function(done) {
    const tabs = [{
        url: 'abc'
    }];
    const mockCallback = jest.fn((_, callback) => callback(tabs));
    global.chrome = {
        tabs: {
            query: mockCallback
        }
    };
    url_utils.getTabUrl(url => {
        expect(url).toEqual('abc');
        done();
    });
});

test('getYoutubeURLs not video link', function() {
    const url = 'https://www.youtube.com/results?search_query=abc#def';
    expect(url_utils.getYoutubeURLs(url)).toEqual([]);
});

test('getYoutubeURLs success', function() {
    const url = 'https://www.youtube.com/watch?v=llNuwhZWXKA';
    expect(url_utils.getYoutubeURLs(url)).toEqual([
        'www.youtube.com/watch?v=llNuwhZWXKA',
        'youtu.be/llNuwhZWXKA'
    ]);
});

test('getYoutubeURLs with other parameters', function() {
    const url = 'https://www.youtube.com/watch?v=llNuwhZWXKA&foo=bar';
    expect(url_utils.getYoutubeURLs(url)).toEqual([
        'www.youtube.com/watch?v=llNuwhZWXKA',
        'youtu.be/llNuwhZWXKA'
    ]);
});
