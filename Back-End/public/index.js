const HeaderDropDown = document.querySelector('.navbar-toggler1');

HeaderDropDown.addEventListener('click', function () {
    HeaderDropDown.classList.toggle('activeHeaderDropDown');
});
function redirectToContactPage() {
    window.location.href = "contact.html";
}

function facebookRedirect() {
    window.open("https://www.facebook.com/profile.php?id=61578066398191", "_blank");
}

function instagramRedirect() {
    window.open("https://www.instagram.com/domax_trading/", "_blank");
}

function tiktokRedirect() {
    window.open("https://www.tiktok.com/@domax_tradings", "_blank");
}
