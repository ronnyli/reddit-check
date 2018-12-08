# Notes to Self
## TODO
### Before release
1. User testing
1. Code Cleanup
    - bogus user agents, state, large blocks of HTML
    - extra libraries that aren't necessary
    - bug fixin'
        - Raph still has "Loading..." bug
        - Blacklisted element appears for some reason (popup.js)
        - Youtube searching is bugged.
            - test https://www.youtube.com/watch?time_continue=6647&v=qLgj6zm6XoA
        - Top-level reply box should not disappear after posting
        - Occasionally the author is returned as an object
            - but goes away after waiting so it's probably Snoowrap taking some
            time to resolve its Promise
        - Make search more relevant
1. Consistent UI for post.html
1. **MVC stuff**
    - Add ability to upvote/downvote, share/save, etc.
    - Add ability to remove/edit your own posts
1. Options
    - turn off auto-search
1. Not obvious how to log in
    - even less obvious to log out
1. How do licenses work when I build on top of Reddit Check?
1. could right-clicking Open In New Tab somehow keep popup window open?
    - or make the extension an overlay so it doesn't keep closing
### After release
1. Performance improvements
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

Where to get outside help?
    - ideally trustworthy
        - Alessia, Josh, Sami
    - if can't get the above ppl how do I recruit a trustworthy stranger
