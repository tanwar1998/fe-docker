import React from 'react';
import PropTypes from 'prop-types';
import LeftFilterItem from '../FilterItem/LeftFilterItem';

const DESKTOP_MIN_WIDTH = 1200;
const FilterPanelLeft = (props) => {
    const {
        filters,
        windowWidth,
        showMobileFilters,
        showTotalResults,
        onFilterClick,
        clearFilterText,
        clearAllFiltersText,
        onClearAllFilters,
        onClearFilterItems,
        onCheckboxClick,
        onMobileFiltersToggleClick,
        resQty,
        children,
    } = props;

    const countSelectedInFilter = el => el.reduce((acc, val) => (val.selected ? acc + 1 : acc), 0);
    const checkFilterSelected = () => filters.some(f => countSelectedInFilter(f.items) > 0);
    const mobileFiltersTitle = (windowWidth < DESKTOP_MIN_WIDTH &&
        <div className="consonant-filters--mob-title">
            <button
                type="button"
                onClick={onMobileFiltersToggleClick}
                className="consonant-filters--mob-back">Back
            </button>
            <span>Filter by</span>
        </div>
    );
    const desktopFiltersTitle = (windowWidth >= DESKTOP_MIN_WIDTH &&
        <h3 className="consonant-filters--desk-title">Refine the results</h3>
    );
    const desktopFiltersClearBtn = (windowWidth >= DESKTOP_MIN_WIDTH &&
        <button
            type="button"
            className="consonant-filters--clear-link"
            onClick={onClearAllFilters}>{clearAllFiltersText}
        </button>
    );
    const mobileFiltersFooter = (windowWidth < DESKTOP_MIN_WIDTH &&
        <div className="consonant-filters--mobile-footer">
            {showTotalResults &&
                <span className="consonant-filters--mobile-footer-total-res">{resQty} results</span>
            }
            {
                checkFilterSelected() &&
                <button
                    type="button"
                    className="consonant-filters--mobile-footer-clear"
                    onClick={onClearAllFilters}>{clearAllFiltersText}
                </button>
            }
            <button
                type="button"
                className="consonant-filters--mobile-footer-btn"
                onClick={onMobileFiltersToggleClick}>
                {checkFilterSelected() ? 'Apply' : 'Done'}
            </button>
        </div>
    );

    let updatedChildren = [];
    const renderChildren = (key) => {
        const res = updatedChildren.filter(el => el.key === key);

        return res.length > 0 ? res : null;
    };

    if (!Array.isArray(children)) updatedChildren.push(children);
    else updatedChildren = children;

    return (
        <div className={showMobileFilters ? 'consonant-filters consonant-filters_opened' : 'consonant-filters'}>
            {
                <div className="consonant-filters--header">
                    {mobileFiltersTitle}
                    {desktopFiltersTitle}
                    {desktopFiltersClearBtn}
                </div>
            }
            {renderChildren('filtersSideSearch')}
            {
                filters.length > 0 &&
                <div className="consonant-filters--list">
                    {filters.map(item =>
                        (<LeftFilterItem
                            key={item.id}
                            name={item.group}
                            icon={item.icon}
                            items={item.items}
                            itemsSelected={countSelectedInFilter(item.items)}
                            results={resQty}
                            id={item.id}
                            isOpened={item.opened}
                            onCheck={onCheckboxClick}
                            onClick={onFilterClick}
                            onClearAll={onClearFilterItems}
                            clearFilterText={clearFilterText} />))}
                </div>
            }
            {renderChildren('filtersSideBookmarks')}
            {mobileFiltersFooter}
        </div>
    );
};

export default FilterPanelLeft;

FilterPanelLeft.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.element])),
        PropTypes.element,
        PropTypes.bool,
    ]),
    filters: PropTypes.arrayOf(PropTypes.object),
    windowWidth: PropTypes.number,
    showMobileFilters: PropTypes.bool,
    showTotalResults: PropTypes.bool,
    onFilterClick: PropTypes.func.isRequired,
    clearFilterText: PropTypes.string.isRequired,
    clearAllFiltersText: PropTypes.string.isRequired,
    onClearAllFilters: PropTypes.func.isRequired,
    onClearFilterItems: PropTypes.func.isRequired,
    onCheckboxClick: PropTypes.func.isRequired,
    onMobileFiltersToggleClick: PropTypes.func.isRequired,
    resQty: PropTypes.number,
};

FilterPanelLeft.defaultProps = {
    filters: [],
    windowWidth: window.innerWidth,
    showMobileFilters: false,
    showTotalResults: true,
    resQty: 0,
    children: [],
};
