//<button class="s1afabjy-1  hbyVDo b1zwxr-0 hxpTao"><div class="s1vspxim-0 cpAOsy"><i class="icon icon-save s1lfar2u-2 fIkQLB"></i></div><span class="s1vspxim-1 iDplM">save</span></button>

function RemoveButton(props) {
    let button_class = props.removed ? 'bFttyl' : '';
        button_text = props.removed ? 'deleted' : 'delete';
    function onRemove() {
        if (!props.removed) {
            removeReddit(
                props.content_id,
                props.replyable_content_type,
                function(status) {
                    if (status === 'Success') {
                        props.handleRemove();
                    }
                }
            );
        }
    }
    if (props.replyable_content_type === 'submission'){
        return React.createElement('button', {
                className: `s1afabjy-1 ${button_class} hbyVDo b1zwxr-0 hxpTao`,
                disabled: props.removed,
                onClick: onRemove
            }, React.createElement('div', {
                className: 's1vspxim-0 cpAOsy'
            }, React.createElement('i', {
                className: 'icon icon-remove s1lfar2u-2 fIkQLB'
            })),
            React.createElement('span', {
                className: 's1vspxim-1 iDplM'
            }, button_text));
    } else {
        return React.createElement('button', {
            className: `s5kaj4p-9 ${button_class} hNSNDN`,
            disabled: props.removed,
            onClick: onRemove
        }, button_text);
    }
}
