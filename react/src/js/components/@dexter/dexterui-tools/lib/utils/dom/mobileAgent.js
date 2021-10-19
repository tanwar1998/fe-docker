export default function mobileAgent() {
    if (!window.navigator) return false;
    var mobilePlatformStrings = ['iPhone', 'Android'];
    var _window = window,
        userAgent = _window.navigator.userAgent;


    return mobilePlatformStrings.some(function (platform) {
        var reg = new RegExp(platform);
        document.body.classList.add('mobile');
        return reg.test(userAgent);
    });
}