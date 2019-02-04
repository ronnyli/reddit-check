class RefineSearch extends React.Component {
    constructor(props) {
        super(props);
        this.urlInput = React.createRef();
    }

    handleClick() {
        let window_url = new URI(window.location.href);
        const input_url = this.urlInput.current.value;
        window_url.setSearch('override_url', input_url);
        let refresh_window = window.open(window_url.toString(), '_self');
        refresh_window.opener = null;
    }

    render () {
        return React.createElement(DropdownMenu, {
            button: React.createElement('span', {
                className: '_6_44iTtZoeY6_XChKt5b0'
            }, 'Refine Search'),
            menu_contents: React.createElement('div', {
                className: 's1fyj3kn-15 UVOUP b1zwxr-0 hxpTao'
            }, [
                React.createElement('input', {
                    ref: this.urlInput,
                    type: 'text',
                    defaultValue: this.props.url,
                    style: {
                        fontWeight: 400,
                        border: '1px solid',
                        backgroundColor: 'rgb(246, 247, 248)'
                    }
                }),
                React.createElement('span', {
                    className: '_6_44iTtZoeY6_XChKt5b0',
                    onClick: ((e) => this.handleClick(e))
                }, 'Search')
            ]),
            menu_style: {left:'auto'}
        });
    }
}
