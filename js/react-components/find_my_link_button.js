function FindMyLinkButton(props) {
    function onClick() {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            const url_raw = tabs[0].url;
            let url = url_raw
                .split('://')[1]
                .split('#')[0]
                .split('?')[0];
            const links = document.querySelectorAll(`a[href*='${url}']`);
            links.forEach(function(link_elem, index, list_obj) { 
                link_elem.style.backgroundColor = 'yellow';
            });
            links[0].scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        });
    }

    return React.createElement('div', {
        className: 's1o44igr-1 hNfrQO'
    }, React.createElement('button', {
        className: 's1o44igr-0 hlpDWs',
        onClick: onClick
    }, React.createElement('i', {
        className: 'icon icon-link-solid xwmljjCrovDE5C9MasZja _1GQDWqbF-wkYWbrpmOvjqJ'
    }),
    React.createElement('span', {
        className: '_6_44iTtZoeY6_XChKt5b0'
    }, 'Find My Link')));
}
