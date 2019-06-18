class ThreddResultDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
            expand: false,
            minimize: false
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
        this.setState({ expand: !this.state.expand });
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
                className: 'ckueCN cFQOcm',
                style: {
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    padding: '10px'
                }
            }
            const url_start_index = this.props.body.indexOf(this.state.url);
            const url_end_index = url_start_index + this.state.url.length;
            const truncated_start = this.state.expand ? 0 : url_start_index - 200;
            const truncated_end = this.state.expand ? this.props.body.length + 1 : url_end_index + 100;
            const is_truncated_start = truncated_start <= 0 ? '' : '...';
            const is_truncated_end = truncated_end >= this.props.body.length ? '' : '...';
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

    renderCollapsedComment(comment) {
        return $(`
        <li class="s136il31-0 cMWqxb" id="${this.props.id}-collapsed" tabindex="-1" style="display:none">
            <div class="Comment ${this.props.id} c497l3-5 MAIAY">
                <button class="${this.props.id} c497l3-0 jtKgEe">
                    <i class="icon icon-expand qjrkk1-0 JnYFK"></i>
                </button>
                <div class="c497l3-4 bWacBs">
                    <div class="c497l3-3 cFXBbI">
                        <div>
                            <a class="s1461iz-1 RVnoX" href="https://www.reddit.com/user/${this.props.author}" target="_blank">${this.props.author}</a>
                        </div>
                        <span class="h5svje-0 cFQOcm">${numToString(this.props.score)} points</span>
                        <span class="h5svje-0 cFQOcm"> &middot; </span>
                        <a class="s17xjtj0-13 hsxhRU" href="https://www.reddit.com/${this.props.permalink}" id="CommentTopMeta--Created--t1_e7i7pcvinOverlay" rel="nofollow" target="_blank">
                            <span>${getAge(this.props.created_utc)}</span>
                        </a>
                    </div>
                </div>
            </div>
        </li>
        `)
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
                    className: 'submission-threadline'
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
                            }, `${this.props.author}`)
                        ])
                    ]),
                    React.createElement('div', {
                        className: 'c497l3-6 eCeBkc s1hmcfrd-0 ckueCN'
                    }, `${this.props.body}`)
                ])
            ]),
        ]);
    }

    renderTooltip() {
        return (
            React.createElement('div', {
                className: 'links-background'
            }, [
                React.createElement('a', {
                    title: this.state.expand ? 'Click to collapse' : 'Click to expand',
                    onClick: ((e) => this.toggleExpand(e))
                }, [
                    this.renderReason(),
                    this.renderDetails()
                ])
            ])
        );
    }

    render () {
        return this.renderComment();
    }
}
