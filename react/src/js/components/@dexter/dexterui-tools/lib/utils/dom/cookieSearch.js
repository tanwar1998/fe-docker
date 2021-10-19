export default function cookieSearch(pattern) {
    var _document = document,
        cookie = _document.cookie;


    return !!pattern.test(cookie);
}