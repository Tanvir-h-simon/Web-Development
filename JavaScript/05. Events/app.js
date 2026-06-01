function subscribe() {
    document.getElementById('subsTxt').innerHTML = 'Subscribed';
    document.getElementById('subscribeBtn').innerHTML = 'Subscribed';
}
// subscribe();

function Love() {
    document.getElementById('loveTxt').innerHTML = 'Loved';
    document.getElementById('loveBtn').innerHTML = 'Loved';
}

function keyPress() {
    document.getElementById('keyPressTxt').innerHTML = 'Logged In';
}

function onLoad() {
    alert('Page Loaded');
    document.getElementById('keyPressTxt').innerHTML = 'Page Loaded';
}