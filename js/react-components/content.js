class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            removed: this.props.removed,
            saved: this.props.saved,
            score: this.props.score,
            liked_status: this.props.liked_status,
            likes: this.props.likes,
            selftext_html: this.props.selftext_html,
            body_html: this.props.body_html
        }
    }

    handleRemove() {
        this.setState({removed: true});
    }

    handleSave() {
        this.setState({saved: !this.state.saved});
    }

    handleVote(newdata) {
        this.setState(newdata);
    }
}
