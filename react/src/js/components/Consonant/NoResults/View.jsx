import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import { RenderDisplayMsg } from '../Helpers/rendering';
import { useConfig } from '../Helpers/hooks';

const viewType = {
    description: string,
    replaceValue: string,
    title: string.isRequired,
};

const defaultProps = {
    description: '',
    replaceValue: '',
};

/**
 * No results message that is shown when search returned 0 results;
 *
 * @component
 * @example
 * const props= {
    title: String
    description: String,
    replaceValue: String,
 * }
 * return (
 *   <NoResultsView {...props}/>
 * )
 */
const View = (props) => {
    const {
        title,
        description,
        replaceValue,
    } = props;

    const getConfig = useConfig();

    const displayMsg = RenderDisplayMsg(description, replaceValue);
    const useLightTheme = getConfig('collection', 'headerTheme') === 'light';

    const titleClassName = classNames({
        'consonant-NoResultsView-title': true,
        'consonant-NoResultsView-title--withLightTheme': useLightTheme,
    });

    const descriptionClassName = classNames({
        'consonant-NoResultsView-description': true,
        'consonant-NoResultsView-description--withLightTheme': useLightTheme,
    });

    return (
        <div
            data-testid="consonant-NoResultsView"
            className="consonant-NoResultsView">
            <strong
                className={titleClassName}>
                {title}
            </strong>
            {description &&
                <div
                    className={descriptionClassName}>
                    {displayMsg}
                </div>
            }
        </div>
    );
};

View.propTypes = viewType;
View.defaultProps = defaultProps;

export default View;
