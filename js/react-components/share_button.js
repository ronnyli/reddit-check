class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false
        }
        this.urlInput = React.createRef();
    }
    
    handleClick() {
        this.urlInput.current.select();
        const status = document.execCommand('copy');
        if (status) {
            this.setState({copied: true});
        }
    }

    render() {
        return React.createElement(DropdownMenu, {
            button: React.createElement('div', {
                    className: 's1o44igr-1 hNfrQO'
                }, React.createElement('button', {
                    className: 's1o44igr-0 hlpDWs'
                }, React.createElement('i', {
                    className: 'icon icon-share xwmljjCrovDE5C9MasZja _1GQDWqbF-wkYWbrpmOvjqJ'
                }),
                React.createElement('span', {
                    className: '_6_44iTtZoeY6_XChKt5b0'
                }, 'share'))),
            menu_contents: React.createElement('div', {
                className: 's1fyj3kn-15 UVOUP b1zwxr-0 hxpTao'
            }, [
                React.createElement('input', {
                    ref: this.urlInput,
                    type: 'text',
                    defaultValue: this.props.url,
                    style: {
                        fontWeight: 400,
                        width: 120,
                        margin: '6px',
                        padding: '2px',
                        border: '1px solid',
                        backgroundColor: 'rgb(246, 247, 248)'
                    }
                }),
                React.createElement('i', {
                    className: 'icon icon-link s1fyj3kn-13 hlpDWs' + (this.state.copied ? ' fofuhh' : ''),
                    onClick: ((e) => this.handleClick(e)),
                    style: {marginRight: '10px'}
                })
            ])
        });
    }
}