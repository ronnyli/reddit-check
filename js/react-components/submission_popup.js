class SubmissionPopup extends Content {
    render() {
        let vote_container = React.createElement('div', {
            className: 'upvote-downvote-outer _3YgWdffoKyCp7UaGAEQpoo'
        }, React.createElement('div', {
            className: 's9fusyd-4 cRuhKC'
        }, React.createElement('div', {
            className: 's9fusyd-3 iJSWiv'
        }, React.createElement(Upvote, {
                content_id: this.props.id,
                replyable_content_type: this.props.replyable_content_type,
                score: this.state.score,
                liked_status: this.state.liked_status,
                handleVote: ((e) => this.handleVote(e))
            }), React.createElement(Score, {
                liked_status: this.state.liked_status,
                score: this.state.score
            }), React.createElement(Downvote, {
                content_id: this.props.id,
                replyable_content_type: this.props.replyable_content_type,
                score: this.state.score,
                liked_status: this.state.liked_status,
                handleVote: ((e) => this.handleVote(e))
            }))));
        let title = React.createElement(
                "div",
                { "className": "s56cc5r-1 jhlfXq" },
                React.createElement(
                    "span",
                    { "className": "item-title y8HYJ-y_lTUHkQIc1mdCq" },
                    React.createElement(
                        "a",
                        { "className": "SQnoC3ObvgnGjWt90zD9Z",
                        href: `${buildCommentUrl(this.props)}`},
                        React.createElement(
                            "h2",
                            { "className": "s56cc5r-0 jpXBut" },
                            this.props.title
                        )
                    )
                )
            );
        let comment = React.createElement('a', {
                className:'comments-page-link _1UoeAeSRhOKSNdY_h3iS1O _1Hw7tY9pMr-T1F4P1C-xNU s9fusyd-13 dQlfjM',
                href: `${buildCommentUrl(this.props)}`
            }, React.createElement('i', {
                className: 'icon icon-comment _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC'
            }), React.createElement('span', {
                className: 'FHCV02u6Cp2zYL0fhQPsO'
            }, `${numToString(this.props.num_comments)}`));

        let overflow_menu = React.createElement(DropdownMenu, {
            button: React.createElement(
                "button",
                { "className": "more-options s6epw68-15 jxTuag mpc6lx-1 iheKDM",
                id: `${this.props.id}-overflow-menu` },
                React.createElement("i", { "className": "icon icon-menu mpc6lx-2 ebwjqI" })
            ),
            menu_contents: [
                React.createElement('div', {
                    className: 's1fyj3kn-15 UVOUP b1zwxr-0 hxpTao'
                }, React.createElement(ShareButton, {
                        url: this.props.url,
                        replyable_content_type: this.props.replyable_content_type,
                        menu_style: {left:'auto', right:0}
                })),
                React.createElement('div', {
                    className: 's1fyj3kn-15 UVOUP b1zwxr-0 hxpTao'
                }, React.createElement(SaveButton, {
                    content_id: this.props.id,
                    replyable_content_type: this.props.replyable_content_type,
                    saved: this.state.saved,
                    handleSave: ((e) => this.handleSave(e))
                })),
                ((lscache.get('is_logged_in_reddit') &&
                ((this.props.author.name || this.props.author) === lscache.get('reddit_username'))) ?
                React.createElement('div', {
                    className: 's1fyj3kn-15 UVOUP b1zwxr-0 hxpTao'
                }, React.createElement(RemoveButton, {
                    content_id: this.props.id,
                    replyable_content_type: this.props.replyable_content_type,
                    removed: this.state.removed,
                    handleRemove: ((e) => this.handleRemove(e))
                })) : null)
            ],
            menu_style: {left:'auto', right:0}
        });

        let item_source = React.createElement(
                "div",
                { "className": "item-source _3AStxql1mQsrZuUIFP9xSg s9fusyd-9 TFJUf" },
                React.createElement(Subreddit, {
                    subreddit: this.props.subreddit_name_prefixed}),
                React.createElement(
                  "span",
                  { "className": "s106g12-0 hFyNNd", role: "presentation" },
                  String.fromCharCode(183)
                ),
                React.createElement(
                  "span",
                  { "className": "posted-by _2fCzxBE1dlMh4OFc7B3Dun" },
                  "Posted by"
                ),
                React.createElement(Username, {
                    author: this.props.author.name || this.props.author}),
                React.createElement(ContentAge, {
                    href_val: buildCommentUrl(this.props),
                    created_utc: this.props.created_utc
                })
            );
        let item_description = React.createElement("div", {
                "className": "item-description s9fusyd-8 hgDRGI"},
                title,
                item_source);
        let buttons = React.createElement(
                "div",
                { "className": "col-right s9fusyd-11 fZehHr" },
                comment,
                React.createElement("div", { "className": "s9fusyd-12 gXQfqP s1o43ulv-1 fGjVuX" },
                overflow_menu)
            );
        let item_content = React.createElement(
                "div",
                { "className": "item-info _1poyrkZ7g36PawDueRza-J s9fusyd-1 hnnoJG" },
                React.createElement("div", { "className": "item-info-content WnMeTcero48dKo501T-19" },
                item_description,
                buttons)
            );
        let scrollerItemContent = React.createElement("div", {
                className: "scrollerItem-content YA9IzN0YR-G5_oD5EUydl"},
                vote_container,
                item_content);
        let scrollerItem = React.createElement("div", {
                className: `scrollerItem Post ${this.props.id} s9fusyd-17 eHSpeV s1ukwo15-0 RqhAo`,
                id: `${this.props.id}`,
                style: {'maxWidth': '100%'},
                tabIndex: "-1" },
                scrollerItemContent);
        return scrollerItem;
    }
}