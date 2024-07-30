import React, { Component } from 'react';
import Price from "@magento/peregrine/lib/Price";
import Product from "/vendor/smile/module-elasticsuite-instant-search/view/frontend/react_source/Product";

class ProductWithoutPrice extends Product {

    render() {
        const {props : {item}} = this;

        return (
            <dd className={item.row_class} role="option">
                <a className="instant-search-result" href={BASE_URL + item.url} title={item.name} onMouseDown={(e) => e.preventDefault()}>
                    <div className="thumbnail"><img alt={item.name} src={item.thumbnail.startsWith('http') ? item.thumbnail : BASE_URL + item.thumbnail}/></div>
                    <div className="info">{item.name}
                        <div className="autocomplete-category">{this.productInCategoryLabel + ' ' + item.highlightCategory}</div>
                    </div>
                </a>
            </dd>
        );
    }
}

export default ProductWithoutPrice;
