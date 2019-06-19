class ThreddResultDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
            expand: false,
            collapse: false
        };
    }

    componentWillMount() {
        console.log(this.props.body_html)
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

    toggleExpand(event) {
        this.setState({ expand: !this.state.expand });
    }

    toggleMinimize(event) {
        this.setState({ collapse: !this.state.collapse });
    }

    renderDetails() {
        const url_start_index = this.props.body_html.indexOf(this.state.url);
        const url_end_index = url_start_index + this.state.url.length;
        const truncated_start = this.state.expand ? 0 : url_start_index - 200;
        const truncated_end = this.state.expand ? this.props.body_html.length + 1 : url_end_index + 100;
        const is_truncated_start = truncated_start <= 0 ? '' : '...';
        const is_truncated_end = truncated_end >= this.props.body_html.length ? '' : '...';
        // const output_html = is_truncated_start +
        //     this.props.body_html.substring(truncated_start, url_start_index) +
        //     "<span style='background-color:yellow;'>" +
        //     this.props.body_html.substring(url_start_index, url_end_index) +
        //     "</span>" +
        //     this.props.body_html.substring(url_end_index, truncated_end) +
        //     is_truncated_end;
        const output_html = this.props.body_html.substring(truncated_start, truncated_end);
        return React.createElement('div', {
            dangerouslySetInnerHTML: {__html: this.props.body_html}
        });
    }

    renderCollapsedComment(comment) {
        return React.createElement('div', {
            className: 's136il31-0 cMWqxb',
            onClick: ((e) => this.toggleMinimize(e))
        }, [
            React.createElement('div', {
                className: 'Comment c497l3-5 MAIAY'
            }, [
                React.createElement('button', {
                    className: 'c497l3-0 jtKgEe'
                }, [
                    React.createElement('i', {
                        className: 'icon icon-expand qjrkk1-0 JnYFK'
                    })
                ]),
                React.createElement('div', {
                    className: 'c497l3-4 bWacBs'
                }, [
                    React.createElement('div', {
                        className: 'c497l3-3 cFXBbI'
                    }, [
                        React.createElement('a', {
                            className: 's1461iz-1 RVnoX',
                            href: `https://www.reddit.com/user/${this.props.author}`
                        }, `${this.props.author}`),
                        React.createElement('span', {
                            className: 'cFQOcm'
                        }, 'commented. Click to expand.')
                    ])
                ])
            ])
        ]);
    }

    renderComment() {
        return React.createElement('div', {
            className: 's136il31-0 cMWqxb'
        }, [
            React.createElement('div', {
                className: 'fxv3b9-1 jDSCcP fxv3b9-2 czhQfm'
            }, [React.createElement('div',{
                className: 'fxv3b9-0 efNcNS',
                style: {height: 'calc(100% - 20px'}
            }, [
                React.createElement('i', {
                    className: 'submission-threadline',
                    title: 'Click to minimize',
                    onClick: ((e) => this.toggleMinimize(e))
                })
            ])]),
            React.createElement('div', {
                className: `Comment ${this.props.id} c497l3-5 MAIAY`
            }, [
                React.createElement('div', {
                    className: 'c497l3-2 eUvHWc no-height'
                }),
                React.createElement('div', {
                    className: 'c497l3-4 jHfOJm'
                }, [
                    React.createElement('div', {
                        className: 'c497l3-3 clkVGJ s17xjtj0-21 heFPGG'
                    }, [
                        React.createElement('div', {
                            className: 'wx076j-0 hPglCh'
                        }, [
                            React.createElement('a', {
                                className: 's1461iz-1 RVnoX',
                                href: `https://www.reddit.com/user/${this.props.author}`,
                                target: '_blank'
                            }, `${this.props.author}`),
                            React.createElement('span', {
                                className: 'cFQOcm'
                            }, ' says:')
                        ])
                    ]),
                    React.createElement('div', {
                        className: 'c497l3-6 eCeBkc s1hmcfrd-0 ckueCN',
                        title: this.state.expand ? 'Click to collapse' : 'Click to expand',
                        onClick: ((e) => this.toggleExpand(e))
                    }, this.renderDetails())
                ])
            ]),
        ]);
    }

    render () {
        if (this.state.url && this.props.thredd_result_type != 'link post') {
            if (this.state.collapse) {
                return this.renderCollapsedComment();
            } else {
                return this.renderComment();
            }
        } else {
            return null;
        }
    }
}
