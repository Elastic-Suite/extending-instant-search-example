//*****************
// This file is an example of overriding the whole Autocomplete component.
//
// This is not needed if you plan to only replace the Product, Categories or Search terms block.
//
// The override are on the render() method to use another component.
//*****************

import React, { Component } from 'react';

import LegacyResults from "/vendor/smile/module-elasticsuite-instant-search/view/frontend/react_source/Results";

import DataProviderComponents from "/vendor/smile/module-elasticsuite-instant-search/view/frontend/react_source/Results";

class ResultsWithoutNoResults extends LegacyResults {

    constructor(props) {
        super(props);
    }

    render() {
        const {
                  props : {
                      items,
                      expanded
                  }
              } = this;

        let groupedResults = this.groupBy(items, 'type'),
            Product = DataProviderComponents['product'];

        return (
            <div id="search_autocomplete" className="instant-search-result-box" style={{display: ((items.length > 0) && (expanded === true)) ? 'flex' : 'none' }}>
                <div className="col-3">
                    {this.dataProviders.map(function(dataProvider, index) {
                        if (index === 'product') {
                            return;
                        }
                        {var ComponentDataProvider = DataProviderComponents[dataProvider.type]}
                        return (
                            <dl id={'search_autocomplete' + dataProvider.type} className={dataProvider.type} key={dataProvider.type}>

                                {groupedResults[dataProvider.type] !== undefined && groupedResults[dataProvider.type].length > 0 &&
                                    <dt>{dataProvider.title}</dt>
                                }

                                {groupedResults[dataProvider.type] !== undefined && groupedResults[dataProvider.type].length > 0 &&
                                    groupedResults[dataProvider.type].map(function(result, index) {
                                        return (
                                            <ComponentDataProvider item={result} key={dataProvider.type + index}/>
                                        );
                                    })
                                }
                            </dl>
                        )
                    }.bind(this))}
                </div>
                <div className="col-7">
                    <dl id="search_autocomplete_product" className="product">
                        <dt>{this.productTitle}</dt>
                        {(groupedResults.product === undefined || groupedResults.product.length === 0) &&
                            <span className="no-results">{this.noResultTitle}</span>
                        }
                        {groupedResults.product !== undefined && groupedResults.product.length > 0 &&
                            groupedResults.product.map(function(result, index) {
                                return (
                                    <Product item={result} key={result.entity_id || "product" + index} />
                                );
                            })
                        }
                    </dl>
                </div>
            </div>
        );
    }
}

export default ResultsWithoutNoResults;
