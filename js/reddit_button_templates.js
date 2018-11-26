function upvoteButtonTemplate($element, content, replyable_content_type) {
    const $parent = $element;
    let $button = $('<button>');
    $parent.prepend($button);

    let button_class;
    const liked_class = 'gwerfb';
    const null_class = 'buaDRo';  // TODO: this is not the same as null_class for downvote arrow
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
            // send vote to Reddit
        } else {
            // send unvote to Reddit
        }
        $( this ).siblings().trigger('click-upvote');
        render();

    });
    $button.on('click-downvote', function() {
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
    function render() {
        const content_ = lscache.get('Submission:' + id);  // TODO: typically done through a controller?
              style = getLikedStatus(content_);
        $score.html(`${numToString(content_.score)}`);
        $score.attr('style', styles[style]);
    }
    $score.on('click-upvote', render);
    $score.on('click-downvote', render);
    return {
        init: render
    }
}

function downvoteButtonTemplate($element, content, replyable_content_type) {
    const $parent = $element;
    let $button = $('<button>');
    $parent.append($button);

    let button_class;
    const liked_class = 'gwerfb';
    const disliked_class = 'VzVyB';
    const null_class = 'hxcKpF';
    if ('likes' in content) {
        if (content.likes === false) {
            button_class = disliked_class;
        } else {
            button_class = null_class;
        }
    } else {
        if (content.is_self) {
            button_class = disliked_class;
        }
    }
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
            // send downvote to Reddit
        } else {
            // send unvote to Reddit
        }
        $( this ).siblings().trigger('click-downvote');
        render();

    });
    $button.on('click-upvote', function() {
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