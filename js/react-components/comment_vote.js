class CommentVote extends Content {
    render() {
        return React.createElement('div', {
            className: 'c497l3-2 eUvHWc'
        }, [
            React.createElement(Upvote, {
                content_id: this.props.id,
                replyable_content_type: this.props.replyable_content_type,
                score: this.state.score,
                liked_status: this.state.liked_status,
                handleVote: ((e) => this.handleVote(e))
            }),
            React.createElement(Downvote, {
                content_id: this.props.id,
                replyable_content_type: this.props.replyable_content_type,
                score: this.state.score,
                liked_status: this.state.liked_status,
                handleVote: ((e) => this.handleVote(e))
            })
        ]);
    }
}
