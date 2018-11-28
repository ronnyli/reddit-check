function upvoteButtonTemplate($element, content, replyable_content_type) {
    const $parent = $element;
    let $button = $('<button>');
    $parent.prepend($button);
    let button_class;
    const liked_class = 'gwerfb';
    const null_class = 'buaDRo';
    if ('likes' in content) {
        if (content.likes) {
            button_class = liked_class;
        } else {
            button_class = null_class;
        }
    } else {
        if (content.is_self) {
            button_class = liked_class;
        }
    }
    $button
    .attr('id', `upvote-${content.id}`)
    .attr('class', 'cYUyoUM3wmgRXEHv1LlZv')
    .attr('aria-label', 'upvote')
    .attr('aria-pressed', false)
    .attr('data-click-id', 'upvote');
    $button.click(function () {
        const current_class = button_class;
        button_class = current_class === liked_class ? null_class : liked_class;
        if (button_class === liked_class) {
            logInReddit(function(status) {
                voteReddit(content.id, 'upvote', replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-upvote', ['liked', newcontent.score]);
                    });
            });
        } else {
            logInReddit(function(status) {
                voteReddit(content.id, 'unvote', replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-upvote', ['neutral', newcontent.score]);
                    });
            });
        }
        render();

    });
    $button.on('click-downvote', function(e, status, score) {
        const current_class = button_class;
        button_class = null_class;
        if (button_class !== current_class) {
            render();
        }
    });
    function render() {
        $button.html(`
            <div class="_2q7IQ0BUOWeEZoeAxN555e dplx91-0 ${button_class}">
                <i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA _39UOLMgvssWenwbRxz_iEn"></i>
            </div>
        `);
    }

    return {
        init: render
    }
}

function scoreTemplate($element, content) {
    const $parent = $element;
               id = content.id;
    let $score = $('<div>');
    $score.attr('class', '_1rZYMD_4xY3gRcSS3p8ODO');
    $parent.append($score);
    const styles = {
        liked: 'color: rgb(255, 69, 0);',
        neutral: 'color: rgb(26, 26, 27);',
        disliked: 'color: rgb(113, 147, 255);'
    };
    function getLikedStatus(content) {
        if ('likes' in content) {
            if (content.likes) {
                return 'liked'
            } else if (content.likes === null) {
                return 'neutral'
            } else {
                return 'disliked'
            }
        } else {
            if (content.is_self) {
                return 'liked'
            }
        }
        return 'neutral'
    }
    function render(status, score) {
        $score.html(`${numToString(score)}`);
        $score.attr('style', styles[status]);
    }
    $score.on('click-upvote click-downvote', function(_, status, score) {
        render(status, score);
    });
    return {
        init: render,
        getStatus: getLikedStatus
    }
}

function downvoteButtonTemplate($element, content, replyable_content_type) {
    const $parent = $element;
    let $button = $('<button>');
    $parent.append($button);

    const liked_class = 'gwerfb';
    const disliked_class = 'VzVyB';
    const null_class = 'hxcKpF';
    let button_class = ('likes' in content) && content.likes === false ? disliked_class : null_class;
    $button
    .attr('id', `downvote-${content.id}`)
    .attr('class', 'cYUyoUM3wmgRXEHv1LlZv')
    .attr('aria-label', 'downvote')
    .attr('aria-pressed', false)
    .attr('data-click-id', 'downvote');
    $button.click(function () {
        const current_class = button_class;
        button_class = current_class === disliked_class ? null_class : disliked_class;
        if (button_class === disliked_class) {
            logInReddit(function(status) {
                voteReddit(content.id, 'downvote', replyable_content_type,
                    function(newcontent) {
                        $button.siblings().trigger('click-downvote', ['disliked', newcontent.score]);
                    });
            });
        } else {
            logInReddit(function(status) {
                voteReddit(content.id, 'unvote', replyable_content_type,
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

    return {
        init: render
    }
}
/*
*/