
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
    console.log('loadBlacklist called.');
    $('#blacklist').text('');
    chrome.storage.sync.get(['blacklist', 'blacklist_edited', 'run_on_click'], function (storageMap) {
        $('div#loading').hide(0);
        $('#runonclick').prop('checked', storageMap['run_on_click']);
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
    console.log(url);
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

$('#runonclick').click(function() {
    $('#runonclick_saved').hide();
    $('#runonclick_saving').show();
    if (this.checked) {
        $('#runonclick_warning').show();
    } else {
        $('#runonclick_warning').hide();
    }
    chrome.storage.sync.set({
        'run_on_click': this.checked
    },function(){
        $('#runonclick_saved').show();
        $('#runonclick_saving').hide();
    });
})
