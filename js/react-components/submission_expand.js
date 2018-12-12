class SubmissionExpand extends Content {
    render() {
        let buttons = React.createElement('div', {
            className: '_1hwEKkB_38tIoal6fcdrt9'
        }, React.createElement('div', {
            className:'_3-miAEojrCvx_4FQ8x3P-s s1o44igr-2 hbJPLi'
        },

        React.createElement('div', {
                className: '_1UoeAeSRhOKSNdY_h3iS1O _3m17ICJgx45k_z-t82iVuO _2qww3J5KKzsD7e5DO0BvvU'
            }, React.createElement('i', {
                className: 'icon icon-comment _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC'
            }), React.createElement('span', {
                className: 'FHCV02u6Cp2zYL0fhQPsO'
            }, `${numToString(this.props.num_comments)} comments`)),

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

        React.createElement('button', {
            className: "s1afabjy-1 jqIcAC b1zwxr-0 hxpTao"
        }, React.createElement('div', {
            className:"s1vspxim-0 cpAOsy"
        }, React.createElement('i', {
            className:"icon icon-gild s1lfar2u-5 zIdCy"
        }, React.createElement('span', {
            className:"i729lw-0 ebGXPK"}))),
        React.createElement('span', {
            className:"s1vspxim-1 iDplM"
        },'Give gold')),

        React.createElement('button', {
            className:"s1afabjy-1 jqIcAC b1zwxr-0 hxpTao"
        }, React.createElement('div', {
            className: "s1vspxim-0 cpAOsy"
        }, React.createElement('i', {
            className: "icon icon-hide s1lfar2u-0 ksuhiV"
        })),
        React.createElement('span', {
            className:"s1vspxim-1 iDplM"
        }, 'hide')),

        React.createElement('button', {
            className:"s1afabjy-1 jqIcAC b1zwxr-0 hxpTao"
        }, React.createElement('div', {
            className: "s1vspxim-0 cpAOsy"
        }, React.createElement('i', {
            className: "icon icon-report _1MDjRAzxk1RSTB12748O1v s1lfar2u-1 jdmklb"
        })),
        React.createElement('span', {
            className:"s1vspxim-1 iDplM"
        }, 'report')),

        // TODO: add menu icon back in when we need it
        // React.createElement('div', null,
        // React.createElement('button', {
        //     className:"s1lfar2u-14 ksTfYp mpc6lx-1 iheKDM"
        // }, React.createElement('i', {
        //     className:"icon icon-menu mpc6lx-2 ebwjqI"
        // })))

        ), React.createElement('div', {
            className: 't4Hq30BDzTeJ85vREX7_M'
        }, `${Math.floor(this.props.upvote_ratio * 100)}% Upvoted`));
        let title = React.createElement(
            "div",
            { "className": "_1rcejqgj_laTEewtp2DbWG s1knm1ot-0 cKmWbx" },
            React.createElement(
                "span",
                { "className": "y8HYJ-y_lTUHkQIc1mdCq" },
                React.createElement(
                    "h2",
                    { "className": "s56cc5r-0 lpvuFi" },
                    this.props.title
                )
            )
        );
        let item_source = React.createElement(
            "div",
            { "className": "item-source s11bh4ne-0 kESrVn" },
            React.createElement('div', {className: 'cZPZhMe-UCZ8htPodMyJ5'},
            React.createElement('div', {className: '_3AStxql1mQsrZuUIFP9xSg nU4Je7n-eSXStTBAPMYt8'},
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
                author: this.props.author}),
            React.createElement(ContentAge, {
                created_utc: this.props.created_utc
            })
        )));
        let vote_container = React.createElement('div', {
            className: '_23h0-EcaBUorIHC-JZyh6J',
            style: {
                width: '40px',
                borderLeft: '4px solid transparent'}
        }, React.createElement('div', {
            className: 's1loulka-0 glokqy'
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
            })));
        let post_content = React.createElement('div', {
            className: '_1KNG36IrXcP5X-eLQsMjZb'
        }, item_source, title,
           this.props.selftext_html ? React.createElement('div', {
                className: 's1knm1ot-5 gGDEPn s1hmcfrd-0 ckueCN',
                dangerouslySetInnerHTML: {__html: this.props.selftext_html}
            }) : '',
            this.props.url ? React.createElement('div', {
                className: 'jlrhi6-1 bMGQBc'
            }, React.createElement('a', {
                className: 'b5szba-0 jJNEjo',
                href: `${this.props.url}`,
                target: "_blank"
            }, `${this.props.url.substring(0, 16)}...`,
            React.createElement('i', {
                className: 'icon icon-outboundLink jlrhi6-0 esUKm'
            }))) : '',
            buttons);
        let submission_container = React.createElement('div', {
            className: `s1knm1ot-9 jcdeKe _2rszc84L136gWQrkwH6IaM Post ${this.props.id} s1r9phcq-0 kpzJdf`,
            id: `${this.props.id}`,
            tabIndex: "-1" 
        }, post_content, vote_container
        );
        return submission_container;
    }
}
