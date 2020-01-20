# Notes to Self
## TODO
1. Link Search
    - Nicer look
        - Loading animation
1. User testing
1. Code Cleanup
    - bogus user agents, state, large blocks of HTML
    - extra libraries that aren't necessary
    - Bugfix:
        - when posts/comments link to subreddits/users, the href does not go where you would expect
1. Performance improvements
1. IndexedDB to bypass 5MB LocalStorage limit
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
