//*****************
// This file is an example of overriding the whole Autocomplete component.
//
// This is not needed if you plan to only replace the Product, Categories or Search terms block.
//
// The override are on the render() method to use another component.
//*****************
import React, { Component } from 'react';
import ResultsWithoutNoResults from './ResultsWithoutNoResults';
import ReactESAutocomplete from '/vendor/smile/module-elasticsuite-instant-search/view/frontend/react_source/ReactESAutocomplete';

class CustomESAutocomplete extends ReactESAutocomplete {

    constructor(props) {
        super(props);

        if (window && window.ES_REACT_AUTOCOMPLETE_PROPS) {
            props = {...props, ...window.ES_REACT_AUTOCOMPLETE_PROPS};
        }

        this.resultsElement = React.createRef();

        this.name = props.name || '';
        this.title = props.title || '';
        this.label = props.label || '';
        this.submitButton = props.submitButton || '';
        this.placeholder = props.placeholder || '';
        this.maxLength = props.maxLength || 255;
        this.url = props.url || '';
        this.templates = props.templates || [];
        this.priceFormat = props.priceFormat || '';
        this.minSearchLength = props.minSearchLength || 2;
        this.storeCode = props.storeCode || null;
        this.last = 0;

        this.state = {
            value: props.value || '',
            results: [],
            resultsBuffer: {},
            loading: false,
            expanded: false
        };
    }

    expand() {
        this.setState((state) => {
            return {expanded: true};
        });
    }

    collapse() {
        this.setState((state) => {
            return {expanded: false};
        });
    }

    toggle() {
        this.setState(state => {
            return {expanded: !state.expanded};
        });
    }

    onChange(event) {
        const {url, minSearchLength, storeCode, state: {loading, resultsBuffer}} = this;

        let data = {q: event.target.value};
        if (storeCode !== null) {
            data.__store = storeCode;
        }
        let queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');

        this.setState((state) => {
            return {value: data.q};
        });

        // If search is too short, do nothing.
        if (data.q.length < minSearchLength) {
            this.setState((state) => {
                return {results: []}
            });

            return;
        }

        // Compute a cache key for the current (trimmed) input text.
        let hash = window.btoa(data.q.trim());
        // Same search has been already processed, serve the results from the cache.
        if (resultsBuffer[hash] !== undefined) {
            if (resultsBuffer[hash].length > 0) {
                this.setState((state) => {
                    return {results: resultsBuffer[hash], loading: false};
                });
            }

            return;
        }

        let current = Date.now();

        fetch(url + '?' + queryString, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                this.setState((state) => {
                    return {loading: true};
                });
                this.expand();
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                // Append results to the cache of previous requests.
                resultsBuffer[hash] = responseJson;
                if (responseJson.length > 0) {
                    if (current > this.last) {
                        this.last = current;
                        this.setState((state) => {
                            return {results: responseJson, resultsBuffer: resultsBuffer, loading: false};
                        });
                    }
                }
            })
            .catch(error => {
                if (error.name === 'AbortError') return; // expected, this is the abort, so just return
                throw error;
            });

    }

    render() {
        const {
                  name,
                  value,
                  placeholder,
                  title,
                  label,
                  submitButton,
                  maxLength,
                  state: {
                      results,
                      expanded
                  }
              } = this;

        return (
            <React.Fragment>
                <div className="field search">
                    <label className="label" htmlFor="search" data-role="minisearch-label">
                        <span>{this.label}</span>
                    </label>
                    <div className="control">
                        <input id="search"
                               type="text"
                               name={name}
                               defaultValue={value}
                               placeholder={placeholder}
                               className="input-text"
                               maxLength={maxLength}
                               role="combobox"
                               aria-haspopup="false"
                               aria-autocomplete="both"
                               autoComplete="off"
                               onChange={this.onChange.bind(this)}
                               onBlur={this.toggle.bind(this)}
                               onFocus={this.toggle.bind(this)}
                               data-block="autocomplete-form"/>

                        <ResultsWithoutNoResults ref={this.resultsElement} items={results} expanded={expanded}/>
                    </div>
                </div>
                <div className="actions">
                    <button type="submit"
                            title={this.submitButton}
                            className="action search">
                        <span>{this.submitButton}</span>
                    </button>
                </div>
            </React.Fragment>
        );
    }
};

export default CustomESAutocomplete;
