// The line below is enough to replace only the "Product" component.
DataProviderComponents['product'] = ProductWithoutPrice;

// The lines after are for more advanced customisation.
// This is about overriding the global component
if (window.ES_REACT_AUTOCOMPLETE_PROPS && (window.ES_REACT_AUTOCOMPLETE_PROPS.formSelector !== undefined)) {
    const elementId = window.ES_REACT_AUTOCOMPLETE_PROPS.formSelector || 'search_mini_form';
    if (document.getElementById(elementId)) {
        const element             = document.getElementById(elementId);
        const ReactESAutocomplete = React.lazy(() => import('CustomESAutocomplete'));
        ReactDOM.render(<React.Suspense fallback={<div dangerouslySetInnerHTML={{__html: element.innerHTML}}/>}>
            <CustomESAutocomplete originalContent={element.innerHTML}/>
        </React.Suspense>, element);
    }
}
