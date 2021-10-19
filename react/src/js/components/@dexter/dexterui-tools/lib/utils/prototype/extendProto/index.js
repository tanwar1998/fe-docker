import isValidObject from '../../lang/isValidObject';

/**
* @function extendProto
* @desc a function that takes a base and object to extend and shallow
* merge. So it WON'T copy no-enumerble and Object / array will
* copy by reference.
*
* @memberof utilities
*
* @param proto {Object} a POJO, plain old javascript object, used as prototype
* @param objToExtend {Object} an object with props to extend the proto object
*
* @returns {Object} of shallow merge with proto as prototype;
*
* Object.create: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
* Object.assign: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
*/

var extendProto = function extendProto(proto, objToExtend) {
    return [proto, objToExtend].every(isValidObject) ? Object.assign(Object.create(proto), objToExtend) : {};
};
export default extendProto;