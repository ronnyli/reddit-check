class SubmissionPopup extends Content {
    render() {
        const thredd_result_details = this.props.thredd_result_type == 'comment' ?
            this.props.thredd_result_details :
            {
                author: this.props.author.name || this.props.author,
                body_html: this.props.selftext_html || this.props.selftext,
                id: this.props.id,
                link_id: this.props.id,
                num_comments: this.props.num_comments
            };
        let title = React.createElement(
                "div", {
                    "className": "s56cc5r-1 jhlfXq",
                    "style": {
                        marginTop: "6px"
                    }
                }, React.createElement(
                    "span", {
                        "className": "item-title y8HYJ-y_lTUHkQIc1mdCq"
                    },
                    React.createElement(
                        "a", {
                            "className": "SQnoC3ObvgnGjWt90zD9Z",
                            href: `${buildCommentUrl(this.props)}`,
                            target: '_self'
                        }, [
                            React.createElement(
                                "h2",
                                { "className": "s56cc5r-0 jpXBut" },
                                this.props.title
                            )
                    ]),
                    React.createElement(ThreddResultDetails,
                        Object.assign({
                            thredd_result_type: this.props.thredd_result_type,
                            display: this.state.thredd_result_details_display
                        }, thredd_result_details))
                )
            );
        let comment = React.createElement('a', {
                className:'comments-page-link _1UoeAeSRhOKSNdY_h3iS1O _1Hw7tY9pMr-T1F4P1C-xNU s9fusyd-13 dQlfjM',
                style: {
                    width: '160px'
                },
                href: `${buildCommentUrl(this.props)}`,
                target: '_self'
            }, React.createElement('i', {
                className: 'icon icon-comment _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC'
            }), React.createElement('span', {
                className: 'FHCV02u6Cp2zYL0fhQPsO'
            }, `Open ${numToString(this.props.num_comments)} comments`));

        let buttons = React.createElement('div',
            {className: '_1UoeAeSRhOKSNdY_h3iS1O',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between'
                }
            },
            [comment,
            React.createElement('div', {
                style: {
                    display: 'flex',
                    flexDirection: 'row'
                }
            }, [
                React.createElement(ShareButton, {
                        url: this.props.url,
                        replyable_content_type: this.props.replyable_content_type
                }),
                React.createElement(SaveButton, {
                    content_id: this.props.id,
                    replyable_content_type: this.props.replyable_content_type,
                    saved: this.state.saved,
                    handleSave: ((e) => this.handleSave(e))
                }),
                React.createElement(OpenInRedditButton, {
                    permalink: this.props.permalink
                }),
                ((lscache.get('is_logged_in_reddit') &&
                ((this.props.author.name || this.props.author) === lscache.get('reddit_username'))) ?
                React.createElement(DropdownMenu, {
                button: React.createElement(
                    "button",
                    { "className": "more-options s6epw68-15 jxTuag mpc6lx-1 iheKDM",
                    id: `${this.props.id}-overflow-menu` },
                    React.createElement("i", { "className": "icon icon-menu mpc6lx-2 ebwjqI" })),
                menu_contents: [
                    React.createElement(RemoveButton, {
                                content_id: this.props.id,
                                replyable_content_type: this.props.replyable_content_type,
                                removed: this.state.removed,
                                handleRemove: ((e) => this.handleRemove(e))
                            })
                ],
                menu_style: {left:'auto', right:0}
                })
                 : null)
            ])
        ]);

        let button_container = React.createElement('div', {
            className: '_1hwEKkB_38tIoal6fcdrt9'
        }, React.createElement('div', {
            className:'_3-miAEojrCvx_4FQ8x3P-s s1o44igr-2 hbJPLi'
        }, buttons));

        const fetched_subreddit = this.props.fetched_subreddit || {};
        const subreddit_props = Object.assign({
            subreddit: this.props.subreddit_name_prefixed
        }, fetched_subreddit);
        let item_source = React.createElement('div', {}, [
            React.createElement(SubredditPicture, subreddit_props),
            React.createElement(
                "div",
                { "className": "item-source _3AStxql1mQsrZuUIFP9xSg s9fusyd-9 TFJUf" }, [
                    React.createElement(SubredditText, subreddit_props),
                    React.createElement('div', {
                        style: {
                            display: 'block'
                        }
                    }, [
                        React.createElement(
                          "span",
                          { "className": "posted-by _2fCzxBE1dlMh4OFc7B3Dun" },
                          "Posted by"
                        ),
                        React.createElement(Username, {
                            author: this.props.author.name || this.props.author}),
                        React.createElement(
                          "span",
                          { "className": "s106g12-0 hFyNNd", role: "presentation" },
                          String.fromCharCode(183)
                        ),
                        React.createElement(
                          "span", {
                            "className": "h5svje-0 cFQOcm"
                          }, `${numToString(this.props.score)} points`
                        ),
                        React.createElement(
                          "span",
                          { "className": "s106g12-0 hFyNNd", role: "presentation" },
                          String.fromCharCode(183)
                        ),
                        React.createElement(ContentAge, {
                            href_val: buildCommentUrl(this.props),
                            created_utc: this.props.created_utc
                        })
                    ])
                ]
            )]
        );
        let item_description = React.createElement("div", {
                "className": "item-description s9fusyd-8 hgDRGI"},
                item_source,
                title);
        let item_content = React.createElement(
                "div",
                { "className": "item-info _1poyrkZ7g36PawDueRza-J s9fusyd-1 hnnoJG" },
                React.createElement("div", { "className": "item-info-content" },
                item_description,
                buttons)
            );
        let scrollerItemContent = React.createElement("div", {
                className: "scrollerItem-content YA9IzN0YR-G5_oD5EUydl"},
                item_content);
        let scrollerItem = React.createElement("div", {
            className: `scrollerItem Post ${this.props.id} s9fusyd-17 eHSpeV s1ukwo15-0 RqhAo`,
            id: `${this.props.id}`,
            style: {'maxWidth': '100%'},
            tabIndex: "-1",
            onMouseEnter: (e => this.setState({thredd_result_details_display: true})),
            onMouseLeave: (e => this.setState({thredd_result_details_display: false}))
        }, scrollerItemContent);
        return scrollerItem;
    }
}