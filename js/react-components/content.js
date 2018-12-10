class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saved: this.props.saved,
            score: this.props.score,
            liked_status: this.props.liked_status,
            likes: this.props.likes
        }
    }

    handleVote(newdata) {
        this.setState(newdata);
    }

    handleSave() {
        this.setState({saved: !this.state.saved});
    }
}
