function upvoteButtonTemplate($element, content, replyable_content_type) {
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
    function render($element, content) {
        $element.prepend(`
            <button id="upvote-${content.id}" class="cYUyoUM3wmgRXEHv1LlZv" aria-label="upvote" aria-pressed="false" data-click-id="upvote">
                <div class="_2q7IQ0BUOWeEZoeAxN555e dplx91-0 ${button_class}"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA _39UOLMgvssWenwbRxz_iEn"></i></div>
            </button>
        `);
        $(`#upvote-${content.id}`).click(function () {
            const current_class = button_class;
            button_class = current_class === liked_class ? null_class : liked_class;
            if (button_class === liked_class) {
                // send vote to Reddit
            } else {
                // send unvote to Reddit
            }
            $( this ).children().removeClass(null_class + ' ' + liked_class).addClass(button_class);
            
        })
        $(`#upvote-${content.id}`).on('click-downvote', function() {
            const current_class = button_class;
            if (current_class === liked_class) {
                // send unvote to Reddit? (need to make sure it happens before downvote)
            }
            $( this ).children().removeClass(liked_class).addClass(null_class);
        });
    }

    return {
        init: render
        
    }
}

function scoreTemplate($element, content) {
    $( this ).siblings('div').attr('style', 'color: rgb(255, 69, 0);');
    $( this ).siblings('div').attr('style', 'color: rgb(26, 26, 27);');
    $( this ).siblings('div').attr('style', 'color: rgb(113, 147, 255);');
    $(`#upvote-${content.id}`).on('click-upvote', function() {})
    $(`#upvote-${content.id}`).on('click-downvote', function() {})
}

function downvoteButtonTemplate($element, content, replyable_content_type) {
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
    $element.append(`
        <button id="downvote-${content.id}" class="cYUyoUM3wmgRXEHv1LlZv" aria-label="downvote" aria-pressed="false" data-click-id="downvote">
            <div class="_1iKd82bq_nqObFvSH1iC_Q s1y8gf4b-0 ${button_class}"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div>
        </button>
    `);
    $(`#downvote-${content.id}`).click(function () {
        if ($( this ).children().hasClass(null_class)) {
            $( this ).children().removeClass(null_class).addClass(disliked_class);
            $( this ).siblings('button').children().removeClass(liked_class).addClass(null_class);
            // TODO: send vote to reddit
            // TODO: redraw element somehow

        } else {
            $( this ).children().removeClass(disliked_class).addClass(null_class);
            $( this ).siblings('div').attr('style', 'color: rgb(26, 26, 27);');
            // TODO: send unvote to reddit
            // TODO: redraw element somehow
        }
    })
}
/*
*/