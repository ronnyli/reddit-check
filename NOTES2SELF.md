# Notes to Self
## TODO
1. User testing
1. Banner
    - Copy
    - Nicer look
    - CTA to feedback form
1. Link Search
    - Nicer look
        - Loading animation
        - Number blocks logo
    - Bugfix
        - Breaks on some web pages like Penny Arcade
1. chrome_settings_overrides
    - https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/develop/browsers/chrome/manifest.json#L26-L36
    - Create a Thredd search bar
1. Find My Link
    - it is not obvious that this feature exists
    - make it a sticky footer button when comment element is not in view
    - Add "back to top" sticky footer when submission element is not in view
1. Code Cleanup
    - bogus user agents, state, large blocks of HTML
    - extra libraries that aren't necessary
    - Bugfix:
        - when posts/comments link to subreddits/users, the href does not go where you would expect
1. Analytics that respects privacy
    - copy DuckDuckGo [atb method](https://help.duckduckgo.com/privacy/atb/)
        - only know how many times something was clicked, but not what was clicked nor who did it
        - use DuckDuckGo's method of encryption
        - update privacy policy to reflect DuckDuckGo's
    - how it works
        - request to `atb.js?event=open_thredd`
        - response = {"status":"success","for_more_info":"https://help.thredd.com/privacy/atb/"}
        - How DuckDuckGo requests atb.js: ```
        /*
        * Params:
        *  - url: request URL
        *  - etag: set an if-none-match header
        */
        function loadExtensionFile(params) {
            var xhr = new XMLHttpRequest();
            var url = params.url;

            xhr.open('GET', url);

            if (params.etag) {
                xhr.setRequestHeader('If-None-Match', params.etag);
            }

            xhr.timeout = params.timeout || 30000;

            xhr.send(null);

            return new Promise(function (resolve, reject) {
                xhr.ontimeout = function () {
                    reject(new Error(url + ' timed out'));
                };
                xhr.onreadystatechange = function () {
                    var done = XMLHttpRequest.DONE ? XMLHttpRequest.DONE : 4;
                    if (xhr.readyState === done) {
                        if (xhr.status === 200 || xhr.type && xhr.type === 'internal') {
                            xhr.data = returnResponse(xhr, params.returnType);
                            if (!xhr.data) reject(new Error(url + ' returned no data'));
                            resolve(xhr);
                        } else if (xhr.status === 304) {
                            console.log(url + ' returned 304, resource not changed');
                            resolve(xhr);
                        } else {
                            reject(new Error(url + ' returned ' + xhr.status));
                        }
                    }
                };
            });
        }
        ```
1. Performance improvements
1. IndexedDB to bypass 5MB LocalStorage limit (DDG uses Dexie)
    - would need to implement expiring old data
        - probably as part of `changeAction`
        - all records should have an indexed timestamp called `expires_at`
            - created as part of the model initialization process
    - `db.url` should be indexed on `[url+submission_id], api_source, page_num`
        - use `Table.put()` or `Table.bulkPut()` to ignore primary key conflict
    - `Table.update()` can be used to prevent over-riding existing Submission data with inferior data
        - returns 0 if provided key not found **or** provided changes are identical to current values
        - if 1 then do a full update and run `snoo.getSubmission()` later
    - not sure what to do about Comments, probably same as now
1. Sorting and filtering
    - have a filter for "At least X comments" (initial value = 1) so you have something to read
        - turn this filter on by default
1. Pagination
1. Move ALL HTML into Javascript b/c otherwise you have to remember which HTML goes where
1. additional Reddit API stuff
    - Edit
    - Hide
    - Report
    - etc.
