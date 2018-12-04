function SubmissionPopupView(SubmissionModel, SubmissionController) {
    let $scrollerItem = $(`<div class="scrollerItem Post ${SubmissionModel.id} s9fusyd-17 eHSpeV s1ukwo15-0 RqhAo" id="${SubmissionModel.id}" style="max-width: 100%;" tabindex="-1"></div>`);
        $scrollerItemContent = $(`<div class="scrollerItem-content YA9IzN0YR-G5_oD5EUydl"></div>`);
        $vote_container = $('<div class="upvote-downvote _3YgWdffoKyCp7UaGAEQpoo s9fusyd-4 cRuhKC s9fusyd-3 iJSWiv"></div>');
        $title = $(`
            <div class="s56cc5r-1 jhlfXq">
                <span class="item-title y8HYJ-y_lTUHkQIc1mdCq">
                    <a class="SQnoC3ObvgnGjWt90zD9Z" data-click-id="body" href="${buildCommentUrl(SubmissionModel)}">
                        <h2 class="s56cc5r-0 jpXBut">${SubmissionModel.title}</h2>
                    </a>
                </span>
            </div>`);
        $subreddit = $(`<a class="subreddit s1i3ufq7-0 bsfRLa" data-click-id="subreddit" href="http://www.reddit.com/${SubmissionModel.subreddit_name_prefixed}" target="_blank">${SubmissionModel.subreddit_name_prefixed}</a>`);
        $user = $(`
            <div class="user wx076j-0 hPglCh">
                <a class="user-link _2tbHP6ZydRpjI44J3syuqC s1461iz-1 gWXVVu" href="https://www.reddit.com/user/${SubmissionModel.author}" target="_blank">u/${SubmissionModel.author}</a>
                <div id="UserInfoTooltip--${SubmissionModel.id}"></div>
            </div>`);
        $age = $(`<a class="age _3jOxDPIQ0KaOWpzvSQo-1s" data-click-id="timestamp" href="${buildCommentUrl(SubmissionModel)}" id="PostTopMeta--Created--false--${SubmissionModel.id}" rel="nofollow noopener">${getAge(SubmissionModel.created_utc)}</a>`);
        $comment_link = $(`<a rel="nofollow" data-click-id="comments" data-test-id="comments-page-link-num-comments" class="comments-page-link _1UoeAeSRhOKSNdY_h3iS1O _1Hw7tY9pMr-T1F4P1C-xNU s9fusyd-13 dQlfjM" href="${buildCommentUrl(SubmissionModel)}"></a>`);
        $comment = $(`
            <i class="icon icon-comment _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC" role="presentation"></i>
            <span class="FHCV02u6Cp2zYL0fhQPsO">${numToString(SubmissionModel.num_comments)}</span>`);
        $overflow_menu = $(`
            <button class="more-options s6epw68-15 jxTuag mpc6lx-1 iheKDM" aria-expanded="false" aria-haspopup="true" aria-label="more options" id="${SubmissionModel.id}-overflow-menu">
                <i class="icon icon-menu mpc6lx-2 ebwjqI"></i>
            </button>`);
        $item_source = $(`
            <div class="item-source _3AStxql1mQsrZuUIFP9xSg s9fusyd-9 TFJUf">
                <!-- // $subreddit -->
                <span class="s106g12-0 hFyNNd" role="presentation"> &middot; </span>
                <span class="posted-by _2fCzxBE1dlMh4OFc7B3Dun">Posted by</span>
                <!-- // $user -->
                <!-- // $age -->
            </div>`);
        $item_description = $(`
            <div class="item-description s9fusyd-8 hgDRGI" data-click-id="body">
                <!-- // $title -->
                <!-- // $item_source -->
            </div>`);
        $buttons = $(`
            <div class="col-right s9fusyd-11 fZehHr">
                <!-- // $comment_link -->
                <div class="s9fusyd-12 gXQfqP s1o43ulv-1 fGjVuX"></div>
                <div>
                    <!-- // $overflow_menu -->
                </div>
            </div>`);
        $item_content = $(`
            <div class="item-info _1poyrkZ7g36PawDueRza-J s9fusyd-1 hnnoJG">
                <div class="item-info-content WnMeTcero48dKo501T-19">
                    <!-- // $item_description -->
                    <!-- // $buttons -->
                </div>
            </div>`);
        upvote_button = new upvoteButtonTemplate(SubmissionModel);
        score = new scoreTemplate(SubmissionModel);
        downvote_button = new downvoteButtonTemplate(SubmissionModel);
        $upvote_button = upvote_button.init();
        $score = score.init();
        $downvote_button = downvote_button.init();
}