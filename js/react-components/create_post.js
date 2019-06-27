function CreatePostButton(props) {
    return React.createElement('a', {
        className: 's6tnjvv-17 cvgsde pbxmwi-2 bmmzQa',
        href: `https://www.reddit.com/submit?url=${props.encodedUrl}`,
        target: '_blank',
        rel: 'noopener noreferrer'
    }, 'Create Post');
}

function CreatePost(props) {
    return React.createElement('div', {
        className: 'links-background',
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    }, [
        React.createElement('div', {
            className: '_1C6NYhYvuXKUDoONxrMR0d'
        }, "Don't see a relevant thread? Start your own!"),
        React.createElement(CreatePostButton, props)
    ])
}