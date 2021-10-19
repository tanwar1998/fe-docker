// Turns the prototype of 'ob' into a string which reliably reveals its constructor name.
var getConstructor = function getConstructor(ob) {
  return Object.prototype.toString.call(ob);
};

export default getConstructor;