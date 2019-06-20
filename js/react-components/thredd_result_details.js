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
        if($(event.target).is("a")) {
            return true;
        }
        this.setState({ expand: !this.state.expand });
    }

    toggleMinimize(event) {
        this.setState({ collapse: !this.state.collapse });
    }

    htmlDecode(input) {
        // Copied from https://stackoverflow.com/a/34064434
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    renderDetails() {
        const decoded_html = this.htmlDecode(this.props.body_html);
        let comment_html;
        if (decoded_html.indexOf('</a>') != -1) {
            comment_html = decoded_html;
        } else {
            comment_html = this.props.body_html;
        }
        const url_href_regex  = new RegExp('href=.(https?://)?' + this.state.url)
        const url_start_index = comment_html.search(url_href_regex);
        const url_end_index = url_start_index + this.state.url.length;
        const truncated_start = this.state.expand ? 0 : url_start_index - 200;
        const truncated_end = this.state.expand ? comment_html.length + 1 : url_end_index + 100;
        const is_truncated_start = truncated_start <= 0 ? '' : '...';
        const is_truncated_end = truncated_end >= comment_html.length ? '' : '...';
        const highlight_style = url_start_index > -1 ? " style='background-color:rgb(252, 252, 200);' " : '';
        const output_html = is_truncated_start +
            comment_html.substring(truncated_start, url_start_index) +
            highlight_style +
            comment_html.substring(url_start_index, truncated_end) +
            is_truncated_end;
        return React.createElement('div', {
            dangerouslySetInnerHTML: {__html: output_html}
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
                            href: `https://www.reddit.com/user/${this.props.author}`,
                            target: '_blank'
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
                            }, ' replied:')
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
