# Notes to Self
## TODO
1. Code Cleanup
    - bogus user agents, state
1. Reply to comments within posts
    - Clicking Reply button doesn't trigger expanding comments
        - could be achieved by putting dedicated button outside of collapsible div?
        - or dedicated "expand" / "show replies" button
    - Clear cache for current URL if user makes a post or comment (or refresh)
        - so they can see it in browser action window
        - also I forgot to add an expiration time to comments in lscache. That should help
    - [JS markdown editor](https://simplemde.com/)
1. UI aesthetics
    - Materialize UI on initial results page and also comments page
    - copy look of Reddit mobile app
        - Footer bar contains Post button and other useful pages
        - Card has fixed height
            - text scales its size based on number of characters
            - too much text will trim the extra text with ellipsis
                - Need to click on card to read all of the text
    - https://www.joelonsoftware.com/2003/03/03/building-communities-with-software/
    - https://blog.codinghorror.com/web-discussions-flat-by-design/
    - https://blog.codinghorror.com/discussions-flat-or-threaded/
1. Show users involved for a given URL and allow to add to friends list
    - connect with similar ppl
    - just send over to Reddit for now
1. Allow for subscribing to subreddits
    - just send the user over to Reddit for now
1. Think about actions for:
    - pages without posts
    - people who don't want to post/comment
    - IDEAS:
        - "check-in" to pages, like Foursquare
1. Options
    - over 18? toggle option (filters out over 18 results)
    - turn off auto-search
1. Maybe move ALL HTML into Javascript b/c otherwise you have to remember which HTML goes where
1. User testing

Give up on UI aesthetics for now, get outside help
Things to do before User Testing:
    - Fix expanding comments
    - add refresh button
    - auto refresh after user makes a post or comment
    - link to user/subreddit when clicking

Where to get outside help?
    - ideally trustworthy
        - Alessia, Josh, Sami
    - if can't get the above ppl how do I recruit a trustworthy stranger