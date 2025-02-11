mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRraGFsaXMyMDAwIiwiYSI6ImNtNmllbGt4cjA3cGwycXEyaHA0bDcycWwifQ.hrpqSf6zeg2T5GCfRlygWg'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/muhammadkhalis2000/cm6yk8amv00kb01s16rkt56d2', // style URL
    center: [-79.3891087845972, 43.665922789825515], // starting position [lng, lat]
    zoom: 11,
});


map.on('load', () => {

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

    // Adding the layer for TTC Subway Lines first. The code is adapted from the following link, because I want to customise the color based on the lines that Torontonians are familiar w based on the TTC Map
    // https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'ttclines',
        'paint': {
            'line-width': 2,
            'line-color': [
            'match',                                        // Uses the 'match' function to initialise the customisation of line colors
            ['get', 'NAME'],                                // Indicates that it is based on NAME property in the ttclines.geojson file
            'Line 1: Yonge-University Subway', '#D4AF37',   // Setting Line 1 to Metallic Gold colour
            'Line 2: Bloor-Danforth Subway', '#00A86B',     // Setting Line 2 to Jade Green colour
            'Line 4: Sheppard Subway', '#800080',           // Setting Line 4 to Purple colour
            '#FF0000'
        ]}
    });

    // Then I added the TTC stops over it
    map.addLayer({
        'id': 'stops',
        'type': 'symbol',
        'source': 'ttcstops',
        'layout': {
            'icon-image': 'rail',   // Main customisation is to use the 'rail' icon from the Mapbox API instead of a circle
            'icon-size': 1
        }
    });

    // Then I added the UberEats restaurant layer over it
    map.addLayer({
        'id': 'restos',
        'type': 'symbol',
        'source': 'restos',
        'layout': {
            'icon-image': 'restaurant', // Main customisation is to use the 'restaurant' icon from the Mapbox API instead of a circle
            'icon-size': 2,
            'icon-allow-overlap': true  // I want the icons to overlap one another so that it is clear to viewers how many restaurants I have visited. When I made this as 'false', it hides a lot of the restaurants located in DT due to close proximity
        }
    });
});


// The code from this point below is adapted from the following website in order to create a popup when the mouse hovers on the restaurant. I want to show the name and nearest TTC Subway stop to it
// https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

// Defining the popup. It is set outside so that it is in global scope and can be referred by the mouseenter and mouseleave events.
const popup = new mapboxgl.Popup({
    closeButton: false,     // The idea is to make the popup close when the mouse leaves. So no close button shld be present on the popup
    closeOnClick: false     // The idea is to make the popup close when the mouse leaves. So no clicking of mouse is required
});

// Initialising the mouseenter event to popup 
map.on('mouseenter', 'restos', (e) => {
    map.getCanvas().style.cursor = 'pointer';                       // Changing the cursor to a pointer when the mouse hovers on the restaurant

    const coordinates = e.features[0].geometry.coordinates.slice(); // Getting the coordinates of the restaurant that the mouse is hovering on
    const description = e.features[0].properties.Name + '<br>' + e.features[0].properties.Cuisine + '<br>' + e.features[0].properties.NearestTTC;
                                                                    // Setting description to be the name, cuisine, and nearest TTC Stop

    popup
        .setLngLat(coordinates)                                     // Setting the popup to be located on the coordinates of the restaurant
        .setHTML(description)                                       // Setting the description in the popup
        .addTo(map);                                                // Adding the popup to the map
});

// Initialising the mouseleave event to remove the popup
map.on('mouseleave', 'restos', () => {
    map.getCanvas().style.cursor = '';                              // Changing the cursor back to default when the mouse hovers away from the restaurant
    popup.remove();                                                 // Removing the popup from the map
});