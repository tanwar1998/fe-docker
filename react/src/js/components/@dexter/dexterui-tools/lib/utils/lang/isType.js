export default function isType(expr, object) {
    return expr.test(Object.prototype.toString.call(object));
}