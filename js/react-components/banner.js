class Banner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true  // TODO: set this value based on lscache
        }
    }

    handleClose() {
        // TODO: set lscache to hide this banner
        this.setState({open: false});
    }

    render() {
        return React.createElement('div', {
            style: {
                display: this.state.open ? 'block' : 'none',
                position: 'absolute',
                left: '2.5%',
                right: '2.5%',
                width: '95%',
                borderRadius: '3%',
                backgroundColor: this.props.backgroundColor
            }
        }, [
            React.createElement('p', {
                style: {
                    margin: '4%',
                    textAlign: 'center',
                }
            }, [
                this.props.bannerText
            ]),
            React.createElement('div', {
                style: {
                    position: 'absolute',
                    top: '1%',
                    right: '2.5%',
                    cursor: 'pointer'
                },
                onClick: ((e) => this.handleClose(e))
            }, [
                'X'
            ])
        ]);
    }
}
