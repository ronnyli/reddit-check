const reddit_api = require('../js/reddit_api');

afterEach(() => {
    jest.clearAllMocks();
})

test('getBatchIds success', async () => {
    const mockSuccessResponse = {
        data: {
            children: [{
                data: 'first'
            }, {
                data: 'second'
            }]
        }
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const actual = await reddit_api.getBatchIds(['a', 'b', 'c']);
    expect(actual).toEqual(['first', 'second']);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.reddit.com/api/info.json?id=a,b,c');
});

test('getBatchIds with 100+ IDs', async () => {
    const all_ids = Array
    .apply(0, Array(110))
    .map(function(_,b) { return b + 1; })
    .map(elem => elem.toString());

    const mockSuccessResponse = {
        data: {
            children: [{
                data: 'first'
            }, {
                data: 'second'
            }]
        }
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const actual = await reddit_api.getBatchIds(all_ids);
    expect(actual).toEqual(['first', 'second', 'first', 'second']);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch.mock.calls[0][0]).toBe('https://api.reddit.com/api/info.json?id=' + all_ids.slice(0,100).join(','));
    expect(global.fetch.mock.calls[1][0]).toBe('https://api.reddit.com/api/info.json?id=' + all_ids.slice(100).join(','));
});

test('getBatchIds with no IDs', () => {
    global.fetch = jest.fn();
    expect(reddit_api.getBatchIds()).toBe(undefined);
    expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('getBatchIds repeating IDs', async () => {
    const all_ids = Array
    .apply(0, Array(100))
    .map(function(_,b) { return b + 1; })
    .concat([1,1,1,1,1])
    .map(elem => elem.toString());

    const mockSuccessResponse = {
        data: {
            children: [{
                data: 'first'
            }, {
                data: 'second'
            }]
        }
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const actual = await reddit_api.getBatchIds(all_ids);
    expect(actual).toEqual(['first', 'second']);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toBe('https://api.reddit.com/api/info.json?id=' + all_ids.slice(0,100).join(','));
});

test('getBatchIds fetch error', async () => {
    const mockFetchPromise = Promise.reject('failure');
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const actual = await reddit_api.getBatchIds(['a', 'b', 'c']);
    expect(actual).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toBe('https://api.reddit.com/api/info.json?id=a,b,c');
});
