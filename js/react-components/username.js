function Username(props) {
    return React.createElement(
        "div",
        { "className": "user wx076j-0 hPglCh" },
        React.createElement(
        "a",
        { "className": "user-link _2tbHP6ZydRpjI44J3syuqC s1461iz-1 gWXVVu",
        href: `https://www.reddit.com/user/${props.author}`,
        target: "_blank" },
        `u/${props.author}`
        ),
        React.createElement("div", { id: `UserInfoTooltip--${props.id}` })
    );
}
