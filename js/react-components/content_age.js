function ContentAge(props) {
    return React.createElement('a', {
        className: 'age _3jOxDPIQ0KaOWpzvSQo-1s',
        href: props.href_val ? props.href_val : '#'
    }, `${getAge(props.created_utc)}`);
}