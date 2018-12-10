/*
For now, comments are still rendered mostly in JQuery so
this file just contains little sub-components.
// TODO: make an actual Comment compoenent
*/

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

class CommentSave extends Content {
    render() {
        return React.createElement(SaveButton, {
            content_id: this.props.id,
            replyable_content_type: this.props.replyable_content_type,
            saved: this.state.saved,
            handleSave: ((e) => this.handleSave(e))
        });
    }
}
