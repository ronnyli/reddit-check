class ThreddResultDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
            showTooltip: false
        };

        this.showTooltip = this.showTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
        this.tooltip = React.createRef();
    }

    componentWillMount() {
        let this_ = this;

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            const url_raw = tabs[0].url;
            let url = url_raw
                .split('://')[1]
                .split('#')[0]
                .split('?')[0];
            this_.setState ({ url });
        });
    }

    showTooltip(event) {
        this.setState({ showTooltip: true });
    }

    closeTooltip(event) {
        this.setState({ showTooltip: false });
    }

    renderReason() {
        let reason = null;
        if (this.props.thredd_result_type != 'link post') {
            reason =  [
                React.createElement('a', {
                    className: 'RVnoX',
                    href: 'https://www.reddit.com/user/' + this.props.author,
                    target: "_blank"
                }, this.props.author),
                React.createElement('span', {
                    className: 'cFQOcm'
                }, ' mentioned your URL in the thread:')
            ];
        } else {
            reason = [React.createElement('span', {
                className: 'cFQOcm'
            }, `Great news! The entire post is about `),
            React.createElement('span', {
                className: 'RVnoX',
            }, this.state.url)
        ];
        }
        return React.createElement('div', {
            className: 'hPglCh',
            style: {paddingBottom: '2%'}
        }, reason);
    }

    renderDetails() {
        if (this.state.url && this.props.thredd_result_type != 'link post') {
            const details_style = {
                className: 'ckueCN',
                style: {
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    padding: '10px'
                }
            }
            const url_start_index = this.props.body.indexOf(this.state.url);
            const url_end_index = url_start_index + this.state.url.length;
            const truncated_start = url_start_index - 200;
            const truncated_end = url_end_index + 100;
            const is_truncated_start = truncated_start < 0 ? '' : '...';
            const is_truncated_end = truncated_end > this.props.body.length ? '' : '...';
            const output_html = is_truncated_start +
                this.props.body.substring(truncated_start, url_start_index) +
                "<span style='background-color:yellow;'>" +
                this.props.body.substring(url_start_index, url_end_index) +
                "</span>" +
                this.props.body.substring(url_end_index, truncated_end) +
                is_truncated_end;
            return React.createElement('div', Object.assign(details_style, {
                dangerouslySetInnerHTML: {__html: output_html}
            }));
        } else {
            return null;
        }
    }

    renderTooltip(showTooltip) {
        return (
            showTooltip ? (
                React.createElement('div', {
                    className: 'links-background'
                }, [
                    React.createElement('a', {
                        href: buildCommentUrl({
                            id: this.props.link_id.indexOf('_') != -1 ?
                                this.props.link_id.split('_')[1] :
                                this.props.link_id,
                            num_comments: this.props.num_comments
                        }) + `#${this.props.id}`
                    }, [
                        this.renderReason(),
                        this.renderDetails()
                    ])
                ])
            ) : null
        );
    }

    render () {
        let tooltip = this.renderTooltip(this.state.showTooltip);
        return React.createElement('span', {
            onClick: this.showTooltip,
            style: {cursor: 'pointer'}
        }, [
            React.createElement("span", {
                className: "s1461iz-1 icon icon-info RVnoX",
                title: "Search for the most relevant comment in this post"
            }, React.createElement('span', {
                style: {display: this.props.display ? 'inline' : 'none'}
            }, '  Why is this post relevant?')),
            React.createElement('div', {
                className: 'dMZkik',
                onMouseLeave: this.closeTooltip,
                ref: this.tooltip
            }, tooltip)
        ]);
    }
}
