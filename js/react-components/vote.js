function Upvote(props) {
    const button_class = {
        liked: 'gwerfb',
        neutral: 'buaDRo',
        disliked: 'buaDRo'
    };
    const like_values = {
        liked: true,
        neutral: null,
        disliked: false
    };
    function onUpvote() {
        (function(liked_status) {
            switch(liked_status) {
                case 'liked':
                    return props.handleVote({
                        likes: null,
                        score: props.score - 1,
                        liked_status: 'neutral'
                    });
                case 'neutral':
                    return props.handleVote({
                        likes: true,
                        score: props.score + 1,
                        liked_status: 'liked'
                    });
                case 'disliked':
                    return props.handleVote({
                        likes: true,
                        score: props.score + 2,
                        liked_status: 'liked'
                    });
            }
        })(props.liked_status);
        voteReddit(props.content_id,
            props.liked_status === 'liked' ? 'unvote' : 'upvote',
            props.replyable_content_type,
            function(status) {
                if (status !== 'Success') {
                    props.handleVote({
                        likes: like_values[props.liked_status],
                        score: props.score,
                        liked_status: props.liked_status
                    });
                }
            }
        );
    }
    return React.createElement('button', {
        className: 'cYUyoUM3wmgRXEHv1LlZv',
        onClick: onUpvote
    }, React.createElement('div', {
        className: `_2q7IQ0BUOWeEZoeAxN555e dplx91-0 ${button_class[props.liked_status]}`
    }, React.createElement('i', {
        className: 'icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA _39UOLMgvssWenwbRxz_iEn'
    })));
}

function Downvote(props) {
    const button_class = {
        liked: 'hxcKpF',
        neutral: 'hxcKpF',
        disliked: 'VzVyB'
    };
    const like_values = {
        liked: true,
        neutral: null,
        disliked: false
    };
    function onDownvote() {
        (function(liked_status) {
            switch(liked_status) {
                case 'liked':
                    return props.handleVote({
                        likes: false,
                        score: props.score - 2,
                        liked_status: 'disliked'
                    });
                case 'neutral':
                    return props.handleVote({
                        likes: false,
                        score: props.score - 1,
                        liked_status: 'disliked'
                    });
                case 'disliked':
                    return props.handleVote({
                        likes: null,
                        score: props.score + 1,
                        liked_status: 'neutral'
                    });
            }
        })(props.liked_status);
        voteReddit(props.content_id,
            props.liked_status === 'disliked' ? 'unvote' : 'downvote',
            props.replyable_content_type,
            function(status) {
                if (status !== 'Success') {
                    props.handleVote({
                        likes: like_values[props.liked_status],
                        score: props.score,
                        liked_status: props.liked_status
                    });
                }
            }
        );
    }
    return React.createElement('button', {
        className: 'cYUyoUM3wmgRXEHv1LlZv',
        onClick: onDownvote
    }, React.createElement('div', {
        className: `_1iKd82bq_nqObFvSH1iC_Q s1y8gf4b-0 ${button_class[props.liked_status]}`
    }, React.createElement('i', {
        className: 'icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC'
    })));
}

function Score(props) {
    const styles = {
        liked: 'rgb(255, 69, 0)',
        neutral: 'rgb(26, 26, 27)',
        disliked: 'rgb(113, 147, 255)'
    };
    return React.createElement('div', {
        className: '_1rZYMD_4xY3gRcSS3p8ODO',
        style: {
            color: styles[props.liked_status]
        }
    }, numToString(props.score));
}
