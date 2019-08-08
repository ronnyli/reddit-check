const reddit_api = require('../reddit_api');

class PopupResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched_subreddit: false,
            visible: this.props.posts.map(() => true)  // all posts visible
        }
    }

    componentWillMount() {
        const subreddit_ids = this.props.posts.map(elem => elem.subreddit_id);
        reddit_api.getBatchIds(subreddit_ids)
        .then(subreddits => {
            this.props.posts.map(post => {
                post.fetched_subreddit = subreddits.find(elem => {
                    return elem.name == post.subreddit_id;
                });
            });
            SubmissionLscache.update(this.props.posts);
            this.setState({fetched_subreddit: true});
        });
    }

    render() {
        const posts = this.renderPosts();
        return React.createElement('div', {
            className: posts.length > 0 ? 'links-background' : ''
        }, posts);
    }

    renderPosts() {
        const visible_posts = this.props.posts.filter((elem, ind) => this.state.visible[ind]);
        visible_posts.sort(this.sortPost);
        const posts = visible_posts.map((post) => {
            const submissionModel = new ContentModel(post);
            submissionModel.replyable_content_type = 'submission';
            return React.createElement(SubmissionPopup,
                Object.assign({key: post.id}, submissionModel));
        });
        return posts;
    }

    sortPost(postA, postB, sortKey='usefulness_score', descending=true) {
        const descending_num = descending ? 1 : -1;
        return descending_num * (postB[sortKey] - postA[sortKey])
    }
}

module.exports = {
    PopupResults: PopupResults
}
