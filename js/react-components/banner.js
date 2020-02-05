class Banner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            close: lscache.get(this.props.bannerName) || false
        }
    }

    handleClose() {
        lscache.set(this.props.bannerName, true, this.props.bannerSleep);
        this.setState({close: true});
    }

    render() {
        return React.createElement('div', {
            style: {
                display: this.state.close ? 'none' : 'block',
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
                    margin: '2%',
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
