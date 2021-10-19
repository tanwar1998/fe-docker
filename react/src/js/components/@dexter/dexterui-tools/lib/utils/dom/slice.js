// Uses Array.prototype.slice on HTMLCollection to create an Array
// This reliably always returns an array, and is more efficient than Array.from
// https://jsperf.com/array-from-vs-array-prototype-slice
var slice = function slice(collection) {
  return Array.prototype.slice.call(collection);
};

export default slice;