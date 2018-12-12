function SaveButton(props) {
    let button_class = props.saved ? 'fofuhh' : '';
        button_text = props.saved ? 'unsave' : 'save';
    
    function onSave() {
        logInReddit(function(status) {
            props.handleSave();
            saveReddit(
                props.content_id,
                props.saved ? 'unsave' : 'save',
                props.replyable_content_type,
                function(status) {});
        });
    }
    if (props.replyable_content_type === 'submission'){
        return React.createElement('button', {
                className: `s1afabjy-1 ${button_class} hbyVDo b1zwxr-0 hxpTao`,
                onClick: onSave
            }, React.createElement('div', {
                className: 's1vspxim-0 cpAOsy'
            }, React.createElement('i', {
                className: 'icon icon-save s1lfar2u-2 fIkQLB'
            })),
            React.createElement('span', {
                className: 's1vspxim-1 iDplM'
            }, button_text));
    } else {
        return React.createElement('button', {
            className: `s5kaj4p-9 ${button_class} hNSNDN`,
            onClick: onSave
        }, button_text);
    }
}
