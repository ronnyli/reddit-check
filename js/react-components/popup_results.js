class PopupResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.posts.map(() => true)  // all posts visible
        }
    }

    render() {
        return React.createElement('div', {
            className: 'links-background'
        }, this.renderPosts())
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

    sortPost(postA, postB, sortKey='score', descending=true) {
        const descending_num = descending ? 1 : -1;
        return descending_num * (postB[sortKey] - postA[sortKey])
    }
}
