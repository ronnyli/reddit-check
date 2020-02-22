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
