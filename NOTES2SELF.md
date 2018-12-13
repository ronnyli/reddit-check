# Notes to Self
## TODO
### Before release
1. User testing
1. Code Cleanup
    - bogus user agents, state, large blocks of HTML
    - extra libraries that aren't necessary
    - bug fixin'
        - Blacklisted element appears for some reason (popup.js)
        - Top-level reply box should not disappear after posting
        - Make search more relevant
1. Consistent UI for post.html
1. **MVC stuff**
    - Add ability to remove/edit your own posts
1. Options
    - turn off auto-search
1. Not obvious how to log in
    - even less obvious to log out
1. How do licenses work when I build on top of Reddit Check?
1. Switch React to production.min.js
    - remove development.min.js from the folder
### After release
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
1. Hover over subreddit to see Community Details
1. Build website for Thredd
    - context menu link to provide feedback can go to website
1. Pagination
1. Move ALL HTML into Javascript b/c otherwise you have to remember which HTML goes where
1. Think about actions for:
    - pages without posts
    - people who don't want to post/comment
    - IDEAS:
        - "check-in" to pages, like Foursquare
1. additional Reddit API stuff
    - Hide
    - Report
    - etc.
1. could right-clicking Open In New Tab somehow keep popup window open?
    - or make the extension an overlay so it doesn't keep closing

Where to get outside help?
    - ideally trustworthy
        - Alessia, Josh, Sami
    - if can't get the above ppl how do I recruit a trustworthy stranger
