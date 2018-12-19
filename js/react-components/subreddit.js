class Subreddit extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        showTooltip: false,
        subreddit: null,
      };

      this.showTooltip = this.showTooltip.bind(this);
      this.closeTooltip = this.closeTooltip.bind(this);
      this.tooltip = React.createRef();
    }

    showTooltip(event) {
      event.preventDefault();

      if (this.state.subreddit) {
        this.setState({ showTooltip: true }, () => {
          document.addEventListener('click', this.closeTooltip);
        });
      } else {
        let this_ = this;
        getSubreddit(this.props.subreddit, function(fetched_subreddit) {
          if (fetched_subreddit) {
            this_.setState({
                subreddit: fetched_subreddit,
                showTooltip: true
            });
          }
        });
      }
    }

    closeTooltip(event) {
        this.setState({ showTooltip: false }, () => {
            document.removeEventListener('click', this.closeTooltip);
        });
    }

    render () {
        let tooltip = (
            this.state.showTooltip ? (
                React.createElement('div', {
                    className: 'pffdxb-10 ikATnw bGIFnd'
                }, [
                    React.createElement('div', {
                        className: 'pffdxb-3 eLeKnM'
                    }, [
                        React.createElement('a', {
                            className: 'pffdxb-1 jUDXzN',
                            href: `http://www.reddit.com/${this.props.subreddit}`,
                            target: "_blank",
                        }, `${this.props.subreddit}`)
                    ]),
                    React.createElement('div', {
                        className: 'pffdxb-4 egysLp'
                    }, [
                        React.createElement('div', {
                            className: 'pffdxb-5 gqrTRv'
                        }, [
                            React.createElement('div', {
                                className: 'pffdxb-7 iJMTHi'
                            }, numToString(this.state.subreddit.subscribers)),
                            React.createElement('div', {
                                className: 'pffdxb-8 cdobkJ'
                            }, 'Subscribers')
                        ]),
                        React.createElement('div', {
                            className: 'pffdxb-6 czsqYP'
                        }, [
                            React.createElement('div', {
                                className: 'pffdxb-7 iJMTHi'
                            }, numToString(this.state.subreddit.active_user_count)),
                            React.createElement('div', {
                                className: 'pffdxb-8 cdobkJ'
                            }, 'Online')
                        ])
                    ]),
                    React.createElement('div', {
                        className: 'pffdxb-2 iHZaSo'
                    }, this.state.subreddit.public_description),
                    React.createElement('a', {
                        className: 's1w1mqsg-2 ifvzlp',
                        href: `http://www.reddit.com/${this.props.subreddit}`,
                        target: "_blank",
                    }, 'View Community')
                ])
            ): (
                null
            ));
        return React.createElement('span', {
            onMouseEnter: this.showTooltip
        }, [
            React.createElement("a", {
                "className": "subreddit s1i3ufq7-0 bsfRLa",
                href: `http://www.reddit.com/${this.props.subreddit}`,
                target: "_blank",
            }, `${this.props.subreddit}`),
            React.createElement('div', {
                className: 'dMZkik',
                onMouseLeave: this.closeTooltip,
                ref: this.tooltip
            }, tooltip)
        ]);
    }
}
