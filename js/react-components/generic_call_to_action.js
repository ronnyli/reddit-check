function GenericCallToActionButton(props) {
    return React.createElement('a', {
        className: 's6tnjvv-17 cvgsde pbxmwi-2 bmmzQa',
        href: props.href,
        target: '_blank',
        rel: 'noopener noreferrer'
    }, props.button_text);
}

function GenericCallToAction(props) {
    return React.createElement('div', {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    }, [
        React.createElement('div', {
            className: '_1C6NYhYvuXKUDoONxrMR0d'
        }, props.button_description),
        React.createElement(GenericCallToActionButton, props)
    ])
}