# Notes to Self
## TODO
1. Code Cleanup
    - bogus user agents, state
1. Reply to comments within posts
    - IF POST IS ARCHIVED THEN CANNOT REPLY
        - remember to do this with the top level comment box
    - Reply button below each comment (how youtube does it)
        - if not signed in, clicking button triggers sign-in flow
            - remember to do this with the top level comment box
    - Top-level comment at top of screen
        - do not show if post is archived
        - if not signed in, clicking div triggers sign-in
    - Clicking Reply button doesn't trigger expanding comments
        - could be achieved by putting dedicated button outside of collapsible div?
        - or dedicated "expand" / "show replies" button
    - [JS markdown editor](https://simplemde.com/)
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
    - just send over to Reddit for now
1. Allow for subscribing to subreddits
    - just send the user over to Reddit for now
1. Think about actions for:
    - pages without posts
    - people who don't want to post/comment
    - IDEAS:
        - "check-in" to pages, like Foursquare
1. Look at the results for reddit.com for an example of what should ideally be avoided
    - Avoid NSFW subreddits (or at least set an option to avoid those subreddits)
1. Maybe move ALL HTML into Javascript b/c otherwise you have to remember which HTML goes where
