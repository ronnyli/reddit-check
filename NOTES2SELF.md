# Notes to Self
## TODO
1. Code Cleanup
    - bogus user agents, state
1. Display comments page
    - make it look nicer
1. Reply to comments within posts
    - IF POST IS ARCHIVED THEN CANNOT REPLY
    - Reply button below each comment (how youtube does it)
        - if not signed in, clicking button triggers sign-in flow
    - Top-level comment at top of screen
        - do not show if post is archived
        - if not signed in, clicking div triggers sign-in
    - move message about post being archived to top of screen and have it hidden by default
    - [JS markdown editor](https://simplemde.com/)
1. List of subscribed subreddits when submitting post
1. UI aesthetics
    - Materialize UI on initial results page and also comments page
    - https://www.joelonsoftware.com/2003/03/03/building-communities-with-software/
    - https://blog.codinghorror.com/web-discussions-flat-by-design/
    - https://blog.codinghorror.com/discussions-flat-or-threaded/
1. Show inbox when/if someone responds to your post
    - actually not recommended by Joel
1. Clear cache for current URL if user makes a post
    - so they can see it in browser action window
1. Show users involved for a given URL and allow to add to friends list
    - connect with similar ppl
1. Allow for subscribing to subreddits
    - just send the user over to Reddit for now
