function upvoteButtonTemplate(contentModel, contentController) {
    let $button = $('<button>');
    const button_class = {
        liked: 'gwerfb',
        neutral: 'buaDRo;',
        disliked: 'buaDRo;'
    };
    $button
    .attr('id', `upvote-${contentModel.id}`)
    .attr('class', 'cYUyoUM3wmgRXEHv1LlZv')
    .attr('aria-label', 'upvote')
    .attr('aria-pressed', false)
    .attr('data-click-id', 'upvote');
    $button.click(function () {
        if (contentModel.getLikedStatus() === 'liked') {
            // currently liked so unvote
            contentController.vote('unvote', contentModel);
        } else {
            contentController.vote('vote', contentModel);
        }
        contentController.
        const current_class = button_class;
        button_class = current_class === liked_class ? null_class : liked_class;
        if (button_class === liked_class) {
            logInReddit(function(status) {
                voteReddit(contentModel.id, 'upvote', contentModel.replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-upvote', ['liked', newcontent.score]);
                    });
            });
        } else {
            logInReddit(function(status) {
                voteReddit(contentModel.id, 'unvote', contentModel.replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-upvote', ['neutral', newcontent.score]);
                    });
            });
        }
        render();

    });
    function render() {
        $button.html(`
            <div class="_2q7IQ0BUOWeEZoeAxN555e dplx91-0 ${button_class[contentModel.getLikedStatus()]}">
                <i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA _39UOLMgvssWenwbRxz_iEn"></i>
            </div>
        `);
    }

    function init() {
        render();
        return $button;
    }

    contentModel.addSubscriber('likes', render);

    return {
        init: init,
        render: render
    }
}

function scoreTemplate(contentModel) {
    let $score = $('<div>');
    $score.attr('class', '_1rZYMD_4xY3gRcSS3p8ODO');
    const styles = {
        liked: 'color: rgb(255, 69, 0);',
        neutral: 'color: rgb(26, 26, 27);',
        disliked: 'color: rgb(113, 147, 255);'
    };
    
    function render() {
        $score.html(`${numToString(contentModel.score)}`);
        $score.attr('style', styles[getLikedStatus()]);
    }
    function init() {
        render();
        return $score;
    }
    // TODO: I can fake updating contentModel in the controller to trigger render
    // so $score is only reacting to changes in contentModel
    contentModel.addSubscriber('score', render);
    contentModel.addSubscriber('likes', render);
    return {
        init: init,
        render: render
    }
}

function downvoteButtonTemplate(contentModel) {
    let $button = $('<button>');
    const liked_class = 'gwerfb';
    const disliked_class = 'VzVyB';
    const null_class = 'hxcKpF';
    let button_class = ('likes' in contentModel) && contentModel.likes === false ? disliked_class : null_class;
    $button
    .attr('id', `downvote-${contentModel.id}`)
    .attr('class', 'cYUyoUM3wmgRXEHv1LlZv')
    .attr('aria-label', 'downvote')
    .attr('aria-pressed', false)
    .attr('data-click-id', 'downvote');
    $button.click(function () {
        const current_class = button_class;
        button_class = current_class === disliked_class ? null_class : disliked_class;
        if (button_class === disliked_class) {
            logInReddit(function(status) {
                voteReddit(contentModel.id, 'downvote', contentModel.replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-downvote', ['disliked', newcontent.score]);
                    });
            });
        } else {
            logInReddit(function(status) {
                voteReddit(contentModel.id, 'unvote', contentModel.replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-downvote', ['neutral', newcontent.score]);
                    });
            });
        }
        render();

    });
    $button.on('click-upvote', function(e, status, score) {
        const current_class = button_class;
        button_class = null_class;
        if (button_class !== current_class) {
            render();
        }
    });
    function render() {
        $button.html(`
            <div class="_1iKd82bq_nqObFvSH1iC_Q s1y8gf4b-0 ${button_class}">
                <i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i>
            </div>
        `);
    }
    function init() {
        render();
        return $button;
    }

    return {
        init: init,
        render: render
    }
}
/*
*/