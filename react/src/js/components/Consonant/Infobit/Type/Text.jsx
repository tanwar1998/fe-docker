import React from 'react';
import { string } from 'prop-types';

const TextType = {
    text: string.isRequired,
};

/**
 * Text infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    text: String,
 * }
 * return (
 *   <Text {...props}/>
 * )
 */
const Text = ({ text }) => <p className="consonant-text-infobit">{text}</p>;

Text.propTypes = TextType;

export default Text;
