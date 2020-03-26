
var gBlacklist = [];

function getblockurl(index, item) {
    var id = 'blockurl_'+index
    var dellink = "del_"+index
    var divstr = '<div class="blockurl">'+
        '<span class="urlstr">'+item+'</span>'+
        '<span class="delete">'+
            '<a href="#" class="dellink" id="'+dellink+'">Delete</a>'+
        '</span></div>'
    return divstr
}

$('body').on('click', 'a.dellink', function() {
    var id=$(this).attr('id')
    var numId=id.split('_')[1]
    numId = +numId
    var url = gBlacklist[numId]
    gBlacklist.splice(numId, 1)
    saveBlacklist(gBlacklist, "Removed '"+url+"' from blacklist.")
    return false
});

function loadBlacklist()
{
    $('#blacklist').text('');
    chrome.storage.sync.get([
        'blacklist',
        'blacklist_edited',
        'disable_link_preview',
        'disable_flashing_notification',
        'disable_popup_notification',
        'run_on_click'
    ], function (storageMap) {
        $('div#loading').hide(0);
        $('#run_on_click').prop('checked', storageMap['run_on_click']);
        $('#disable_link_preview').prop('checked', storageMap['disable_link_preview']);
        $('#disable_flashing_notification').prop('checked', storageMap['disable_flashing_notification']);
        $('#disable_popup_notification').prop('checked', storageMap['disable_popup_notification']);
        if ((!storageMap['blacklist_edited']) || storageMap['blacklist']){
            gBlacklist = storageMap['blacklist'] || [];
            if (!storageMap['blacklist_edited']) {
                // add default blacklist items
                gBlacklist.push('www.google', 'mail.google');
            }
            $.each(gBlacklist, function(index, item) {
                $("#blacklist").append(getblockurl(index, item))
            });

            if (gBlacklist.length == 0) {
                $('div#emptynotice').show(0);
            } else {
                $('div#emptynotice').hide(0);
            }
        } else {
            $('div#emptynotice').show(0);
        }
    });
}

$('#blockform').submit(function() {
    var url = $('input#blockurl').val();
    if (url.length > 0) {
        $('input#blockurl').val('');
        gBlacklist.push(url);
        saveBlacklist(gBlacklist, 'Added \''+url+'\' to blacklist.');
    } else {
        alert('Empty URL.')
    }
    return false
});

function setStatus(text) {
    $('#statusarea').text(text);
}


$('#clear').click(function() {
    saveBlacklist([],'Blacklist cleared.');
});

function saveBlacklist(blacklist, message)
{
    chrome.storage.sync.set({
        'blacklist':blacklist,
        'blacklist_edited': true
    },function(){
        setStatus(message);
        loadBlacklist();
    });
}
loadBlacklist();

document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener('click', function(e) {
        const status_id = this.id + '_status';
        let status = document.getElementById(status_id);
        if (!status) {
            status = document.createElement('span');
            this.insertAdjacentElement('afterend', status);
        };
        status.id = status_id;
        status.style.paddingLeft = '15px';
        status.style.color = 'black';
        status.textContent = 'Saving...';
        let setting = {};
        setting[this.id] = this.checked;
        chrome.storage.sync.set(setting, function() {
            status.style.color = 'green';
            status.textContent = 'Saved!';
        });
    });
});

$('#run_on_click').click(function() {
    if (this.checked) {
        $('#runonclick_warning').show();
    } else {
        $('#runonclick_warning').hide();
    }
});
