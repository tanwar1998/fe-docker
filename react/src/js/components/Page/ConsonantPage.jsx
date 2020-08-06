import React, { Fragment } from 'react';
import Collection from '../Consonant/Collection';
import FiltersPanel from '../Consonant/FiltersPanel';
import ConsonantHeader from '../Consonant/Header';
import FiltersInfo from '../Consonant/FiltersInfo';
import LoadMore from '../Consonant/LoadMore';

const selectValues = [
    'Popular',
    'Date',
];
const PARAMS = {
    LOAD_POSTS_URL: 'http://caas-publi-aa3c8qnjxs09-336471204.us-west-1.elb.amazonaws.com/api/v3/caas',
    SHOW_ITEMS_PER_STEP: 21,
};
let updateDimensionsTimer;
let updateScrollPosTimer;

export default class ConsonantPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [],
            pages: 1,
            filters: [],
            searchQuery: '',
            selelectedFilterBy: '',
            initialScrollPos: 0,
            showItemsPerPage: PARAMS.SHOW_ITEMS_PER_STEP,
            windowWidth: window.innerWidth,
            showMobileFilters: false,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.clearFilterItems = this.clearFilterItems.bind(this);
        this.loadData = this.loadData.bind(this);
        this.setInitialScrollPos = this.setInitialScrollPos.bind(this);
        this.setCardsToShowQty = this.setCardsToShowQty.bind(this);
        this.getWrapperScrollPos = this.getWrapperScrollPos.bind(this);
        this.getCardsToShowQty = this.getCardsToShowQty.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handleFilterItemClick = this.handleFilterItemClick.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.handleFiltersToggle = this.handleFiltersToggle.bind(this);
        this.handleInitialScrollPos = this.handleInitialScrollPos.bind(this);
    }

    componentDidMount() {
        this.setInitialScrollPos();
        window.addEventListener('resize', this.updateDimensions);
        window.addEventListener('resize', this.handleInitialScrollPos);

        // Load data on init;
        this.loadData().then((res) => {
            if (!res || !res.cards || !res.filters) return;

            this.setState(prevState => ({
                cards: [...prevState.cards, ...res.cards],
                filters: res.filters.map((el) => {
                    el.opened = false;
                    el.items = el.items.map((item) => {
                        item.selected = false;
                        return item;
                    });
                    return el;
                }),
            }));
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
        window.removeEventListener('resize', this.handleInitialScrollPos);
    }

    getSelectedFiltersItemsQty() {
        const res = this.state.filters.reduce((acc, val) => {
            const count = val.items.reduce((accum, value) => {
                if (value.selected) return accum + 1;
                return accum;
            }, 0);

            return acc + count;
        }, 0);

        return res;
    }

    getCardsToShowQty() {
        let res = this.state.showItemsPerPage * this.state.pages;

        if (res > this.state.cards.length) res = this.state.cards.length;

        return res;
    }

    setCardsToShowQty() {
        const currentPos = this.getWrapperScrollPos();
        this.setState(prevState => ({
            pages: prevState.pages + 1,
        }), () => {
            window.scrollTo(0, Math.abs(currentPos) + this.state.initialScrollPos);
        });
    }

    getWrapperScrollPos() {
        return 500;
        // return parseInt(this.cardsWrapper.getBoundingClientRect().top, 10);
    }

    setInitialScrollPos() {
        this.setState({ initialScrollPos: Math.abs(this.getWrapperScrollPos()) });
    }

    async loadData() {
        const response = await fetch(PARAMS.LOAD_POSTS_URL);
        const json = await response.json();
        return json;
    }

    updateDimensions = () => {
        const awaitTime = 100;

        window.clearTimeout(updateDimensionsTimer);
        updateDimensionsTimer = window.setTimeout(() => {
            this.setState({
                windowWidth: window.innerWidth,
                showMobileFilters: false,
            });
        }, awaitTime);
    };

    clearFilterItems(id) {
        this.setState(prevState => prevState.filters.map((el) => {
            if (el.id === id) {
                el.items.map((item) => {
                    item.selected = false;
                    return item;
                });
            }
            return el;
        }));
    }

    clearFilters() {
        this.setState(prevState => ({
            searchQuery: '',
            filters: prevState.filters.map((el) => {
                el.items.map((filter) => {
                    filter.selected = false;
                    return filter;
                });
                return el;
            }),
        }));
    }

    handleInitialScrollPos() {
        const awaitTime = 100;

        window.clearTimeout(updateScrollPosTimer);
        updateScrollPosTimer = window.setTimeout(() => {
            window.scrollTo(0, 0);
            this.setInitialScrollPos();
        }, awaitTime);
    }

    handleSelectChange(val) {
        this.setState({ selelectedFilterBy: val }, () => {
            console.log('UPDATED STATE: ', this.state);
        });
    }

    handleSearchInputChange(val) {
        this.setState({
            searchQuery: val,
        }, () => {
            console.log('UPDATED STATE: ', this.state);
        });
    }

    handleFilterItemClick(filterId) {
        this.setState((prevState) => {
            const res = prevState.filters.map((el) => {
                if (el.id === filterId) {
                    el.opened = !el.opened;
                }

                return el;
            });

            return { filters: res };
        });
    }

    handleCheckBoxChange(filterId, itemId) {
        this.setState((prevState) => {
            const list = prevState.filters.map((filter) => {
                if (filter.id === filterId) {
                    filter.items = filter.items.map((item) => {
                        if (item.id === itemId) item.selected = !item.selected;

                        return item;
                    });
                }

                return filter;
            });

            return {
                filters: list,
            };
        }, () => {
            console.log('UPDATED STATE: ', this.state);
        });
    }

    handleFiltersToggle() {
        this.setState(prevState => ({
            showMobileFilters: !prevState.showMobileFilters,
        }));
    }

    render() {
        return (
            <Fragment>
                <ConsonantHeader />
                <section className="consonant-page">
                    <div className="consonant-page--inner">
                        <FiltersPanel
                            filters={this.state.filters}
                            windowWidth={this.state.windowWidth}
                            showMobileFilters={this.state.showMobileFilters}
                            searchQuery={this.state.searchQuery}
                            cardsQty={this.state.cards.length}
                            onFilterClick={this.handleFilterItemClick}
                            onClearAllFilters={this.clearFilters}
                            onClearFilterItems={this.clearFilterItems}
                            onCheckboxClick={this.handleCheckBoxChange}
                            onMobileFiltersToggleClick={this.handleFiltersToggle}
                            onSearch={this.handleSearchInputChange} />
                        <div>
                            <FiltersInfo
                                filters={this.state.filters}
                                cardsQty={this.state.cards.length}
                                selectedFiltersQty={0}
                                windowWidth={this.state.windowWidth}
                                selectValues={selectValues}
                                selelectedFilterBy={this.state.selelectedFilterBy}
                                onSelect={this.handleSelectChange}
                                onSearch={this.handleSearchInputChange}
                                onMobileFiltersToggleClick={this.handleFiltersToggle} />
                            <Collection
                                showItemsPerPage={this.state.showItemsPerPage}
                                pages={this.state.pages}
                                cards={this.state.cards} />
                            <LoadMore
                                onClick={this.setCardsToShowQty}
                                shown={this.getCardsToShowQty()}
                                total={this.state.cards.length} />
                        </div>
                    </div>
                </section>
            </Fragment>
        );
    }
}
