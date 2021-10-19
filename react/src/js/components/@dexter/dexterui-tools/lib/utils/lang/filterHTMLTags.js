/**
 * @method filterTags
 * @desc Filters HTML tags and special chars that turn into HTML tags (like how &lt; = <)
 *
 * @memberof Lang
 *
 * @param string {String} String data containing tags or psuedo-tags to be striped.
 * @returns {String} Cleaned text string, stripping all HTML tags and psuedo-tags.
 */
export default function filterHTMLTags(string) {
  return string.replace(/&lt;(?:.|\n)*?&gt;/gm, '').replace(/<(?:.|\n)*?>/gm, '');
}