CLIENT_ID_DEV = 'FAKE ID';
FIREFOX_CLIENT_ID_DEV = 'FAKE ID';
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

afterEach(() => {
    jest.clearAllMocks();
    chrome.flush();
})

test('setSnoowrapFromAuthCode success', async () => {
    const first_run=1;
    window.first_run = first_run;
    const callback = jest.fn();
    const logoutContextMenu = jest.fn();
    window.logoutContextMenu = logoutContextMenu;
    const loginContextMenu = jest.fn();
    window.loginContextMenu = loginContextMenu;
    const snoowrap = require('snoowrap');
    const spy = jest.spyOn(snoowrap, 'fromAuthCode').mockResolvedValue(new Promise(function(resolve, reject) {
        const fake_user = {
            name: 'fake'
        }
        resolve({
            getMe: jest.fn().mockResolvedValue(fake_user)
        })
    }));
    const status = await snoo.setSnoowrapFromAuthCode('foo', callback)
    expect(status).toBe('Success')
    expect(callback).toBeCalledWith('Success');
    expect(snoowrap.fromAuthCode).toBeCalledWith({
        code: 'foo',
        userAgent: chrome.runtime.id + ':' + 'v0.0.1' + ' (by /u/sirius_li)',
        clientId: CLIENT_ID_DEV,
        redirectUri: chrome.identity.getRedirectURL('provider_cb')
    })
    expect(loginContextMenu).not.toHaveBeenCalled();
    expect(logoutContextMenu).toBeCalledWith(false);
    spy.mockRestore();
});

test('setSnoowrapFromAuthCode catches error', async () => {
    const callback = jest.fn();
    const snoowrap = require('snoowrap');
    const spy = jest.spyOn(snoowrap, 'fromAuthCode').mockResolvedValue(new Promise(function(resolve, reject) {
        reject('FAKE ERROR')
    }));
    const status = await snoo.setSnoowrapFromAuthCode('foo', callback)
    expect(status).toBe('FAKE ERROR')
    expect(callback).toBeCalledWith('FAKE ERROR');
    expect(snoowrap.fromAuthCode).toBeCalledWith({
        code: 'foo',
        userAgent: chrome.runtime.id + ':' + 'v0.0.1' + ' (by /u/sirius_li)',
        clientId: CLIENT_ID_DEV,
        redirectUri: chrome.identity.getRedirectURL('provider_cb')
    })
    expect(logoutContextMenu).not.toHaveBeenCalled();
    expect(loginContextMenu).toBeCalledWith(false);
    spy.mockRestore();
});

test('checkRedirectUrl invalid redirect URI', () => {
    const url = '';
    expect(() => snoo.checkRedirectUrl(url)).toThrow('Invalid redirect URI');
});

test('checkRedirectUrl chrome runtime error', () => {
    chrome.runtime.lastError = 'chrome runtime error';
    const url = '';
    expect(() => snoo.checkRedirectUrl(url)).toThrow('chrome runtime error');
});

test('checkRedirectUrl', () => {
    const redirectUri = 'https://app-id.chromiumapp.org/provider_cb';
    chrome.identity.getRedirectURL.returns(redirectUri);
    const urlinput = redirectUri + '?code=fake_code';
    const spy = jest.spyOn(snoo, 'setSnoowrapFromAuthCode');
    const callback = jest.fn();
    snoo.checkRedirectUrl(urlinput, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('fake_code');
});

test('cached logInReddit', () => {
    lscache.get.mockReturnValueOnce(true);
    snoo.logInReddit(null, (status) => {
        expect(chrome.identity.launchWebAuthFlow.notCalled).toBe(true);
        expect(status).toBe('Success');
    })
});

test('logInReddit', () => {
    const snoowrap = require('snoowrap');
    const spy = jest.spyOn(snoowrap, 'getAuthUrl').mockReturnValueOnce('abcdef');
    snoo.logInReddit(12345, (status) => {});
    expect(chrome.identity.launchWebAuthFlow.calledOnce).toBe(true);
    const callArgs = chrome.identity.launchWebAuthFlow.getCall(0).args;
    expect(callArgs[0]).toEqual({
        'interactive': 12345,
        'url': 'abcdef'
    });
    const anonFun = (redirecturl) => {
        checkRedirectUrl(redirecturl, (code) => {
            setSnoowrapFromAuthCode(code, callback)
        });
    }
    // check that the anonymous function strings match
    // source: https://stackoverflow.com/q/45644098
    expect((''+callArgs[1]).replace(/\s+/g, '')).toBe((''+anonFun).replace(/\s+/g, ''));
    expect(lscache.get).toBeCalledWith('is_logged_in_reddit');
    expect(lscache.get.mock.calls.length).toBe(1);
    spy.mockRestore();
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
