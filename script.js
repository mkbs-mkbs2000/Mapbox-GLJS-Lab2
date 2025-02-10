mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRraGFsaXMyMDAwIiwiYSI6ImNtNmllbGt4cjA3cGwycXEyaHA0bDcycWwifQ.hrpqSf6zeg2T5GCfRlygWg'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/muhammadkhalis2000/cm6yk8amv00kb01s16rkt56d2', // style URL
    center: [-79.3891087845972, 43.665922789825515], // starting position [lng, lat]
    zoom: 11,
});


map.on('load', () => {

    // Add a data source containing GeoJSON data
    map.addSource('restos', {
        type: 'geojson',
        data: 'https://mkbs-mkbs2000.github.io/Personal-Portfolio/data/November%202024%20UberEats.geojson'
    });

    map.addSource('ttcstops', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Mapbox-GLJS-Lab2/main/data/ttcstops.geojson'
    });

    map.addSource('ttclines', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Mapbox-GLJS-Lab2/main/data/ttclines.geojson'
    });

    
    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'ttclines',
        'paint': {
            'line-color': '#FF0000',
            'line-width': 1.5
        }
    });

    map.addLayer({
        'id': 'stops',
        'type': 'symbol',
        'source': 'ttcstops',
        'layout': {
            'icon-image': 'rail',
            'icon-size': 0.9
        }
    });

    map.addLayer({
        'id': 'restos',
        'type': 'symbol',
        'source': 'restos',
        'layout': {
            'icon-image': 'restaurant',
            'icon-size': 2,
            'icon-allow-overlap': true
        }
    });
});


// The following code is adapted from the following website in order to create a popup when the mouse hovers on the restaurant
// https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
const popup = new mapboxgl.Popup({
    closeButton: false, 
    closeOnClick: false
});

map.on('mouseenter', 'restos', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.Name;
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

map.on('mouseleave', 'restos', () => {
    popup.remove();
});