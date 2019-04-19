if (document.getElementById('thredd-overlay')) {
    document.getElementById("thredd-overlay").remove();
} else {
    let thredd_overlay = document.createElement('div');
    thredd_overlay.id = 'thredd-overlay';
    document.body.appendChild(thredd_overlay);
    let thredd_dragbar = document.createElement('div');
    let overlay = document.createElement('iframe');
    overlay.id = 'thredd-iframe';
    overlay.width = '525px';
    overlay.height = "100%";
    overlay.src = chrome.extension.getURL("popup.html");
    style = overlay.style;
    style.position = "fixed";
    style.zIndex = 2147483646;
    style.top = 0;
    style.right = 0;
    style.background = "#FFFFFF";
    thredd_overlay.appendChild(overlay);
}
