import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { Map, View, Overlay } from 'ol';
import { Tile, Image, Group, Vector } from 'ol/layer';
import { OSM, ImageWMS, XYZ, StadiaMaps } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, FullScreen, MousePosition, } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import { createStringXY } from 'ol/coordinate';
import { Style, Fill, Stroke } from 'ol/style';


// OpenStreetMap base map
let osm = new Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new OSM()
});


let cams = new Image({
    title: "Macedonia_CAMS_no2_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:Macedonia_CAMS_no2_2022' }
    }),
    visible: false
});


// Define your WMS overlay layers
let landuseReclassified = new Image({
    title: "Landuse Reclassified",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:Landuse_reclassified' }
    }),
    visible: false
});

let populationDensities = new Image({
    title: "Macedonia Reclassified Population Densities",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:Macedonia reclassified population densities' }
    }),
    visible: false
});

let averageNo2_2022 = new Image({
    title: "Macedonia Average NO2 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:Macedonia_average_no2_2022' }
    }),
    visible: false
});

let aadMap2022 = new Image({
    title: "Macedonia NO2 2017-2021 AAD Map 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:Macedonia_no2_2017-2021_AAd_map_2022' }
    }),
    visible: false
});

let no2Concentration2020 = new Image({
    title: "Macedonia NO2 Concentration Map 2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:Macedonia_no2_concentration_map_2020' }
    }),
    visible: false
});

let bivariateNo2_2020 = new Image({
    title: "Macedonia NO2 2020 Bivariate",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_25:macedonia_no2_2020_bivariate' }
    }),
    visible: false
});


// Add the layer groups code here:
let basemapLayers = new Group({
    title: 'Base Maps',
    layers: [osm]
});
let overlayLayers = new Group({
    title: 'Overlay Layers',
    layers: [
        cams,
        landuseReclassified,
        populationDensities,
        averageNo2_2022,
        aadMap2022,
        no2Concentration2020,
        bivariateNo2_2020
    ]
});


// Map Initialization
let mapOrigin = fromLonLat([21.43, 41.61]); // Center of North Macedonia
let zoomLevel = 7;
let map = new Map({
    target: document.getElementById('map'),
    //layers: [basemapLayers, overlayLayers],
    layers: [],
    view: new View({
        center: mapOrigin,
        zoom: zoomLevel
    }),
    projection: 'EPSG:3857'
});

// Add the map controls here:
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(
    new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-control',
        placeholder: '0.0000, 0.0000'
    })
);

// Add the LayerSwitcher control here:
var layerSwitcher = new LayerSwitcher({});
map.addControl(layerSwitcher);

// Add the Stadia Basemaps here:
var stamenWatercolor = new Tile({
    title: 'Stamen Watercolor',
    type: 'base',
    visible: false,
    source: new StadiaMaps({
        layer: 'stamen_watercolor'
    })
});
var stamenToner = new Tile({
    title: 'Stamen Toner',
    type: 'base',
    visible: false,
    source: new StadiaMaps({
        layer: 'stamen_toner'
    })
});
basemapLayers.getLayers().extend([stamenWatercolor, stamenToner]);

// Add the ESRI XYZ basemaps here:
var esriTopoBasemap = new Tile({
    title: 'ESRI Topographic',
    type: 'base',
    visible: false,
    source: new XYZ({
        attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    }),
});
var esriWorldImagery = new Tile({
    title: 'ESRI World Imagery',
    type: 'base',
    visible: false,
    source: new XYZ({
        attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Imagery/MapServer">ArcGIS</a>',
        url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    }),
});
basemapLayers.getLayers().extend([
    esriTopoBasemap, esriWorldImagery
]);



// Add the pointermove event code here:
map.on('pointermove', function(event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Add the legend code here:
var legendHTMLString = '<ul>';
function getLegendElement(title, color){
    return '<li>' + 
        '<span class="legend-color" style="background-color: ' + color + ' ">' + 
        '</span><span>' + 
        title +
        '</span></li>';
}

for(let overlayLayer of overlayLayers.getLayers().getArray()){
    if(overlayLayer.getSource() instanceof ImageWMS){
        var legendURLParams = {format: "application/json"};
        var legendUrl = overlayLayer.getSource().getLegendUrl(0, legendURLParams);
        // make the legend JSON request
        await fetch(legendUrl).then(async (response) => {
            await response.json().then((data) => {
                var layerTitle = overlayLayer.get('title');
                var layerSymbolizer = data["Legend"][0]["rules"][0]["symbolizers"][0];
                var layerColor = null;
                if("Polygon" in layerSymbolizer){
                    layerColor = layerSymbolizer["Polygon"]["fill"];
                } else if("Line" in layerSymbolizer){
                    layerColor = layerSymbolizer["Line"]["stroke"];
                }

                if(layerColor != null){
                    legendHTMLString += getLegendElement(layerTitle, layerColor);
                }
            });
        });

    } else {
        var layerStyle = overlayLayer.getStyle();
        var layerColor = layerStyle.getFill().getColor();
        var layerTitle = overlayLayer.get('title');
        legendHTMLString += getLegendElement(layerTitle, layerColor);
    }
}
// Finish building the legend HTML string
var legendContent = document.getElementById('legend-content');
legendHTMLString += "</ul>";
legendContent.innerHTML = legendHTMLString;

// Add the layer groups to the map here, at the end of the script!
map.addLayer(basemapLayers);
map.addLayer(overlayLayers);

// Legend update function
function updateLegend() {
    const legendContent = document.getElementById('legend-content');
    legendContent.innerHTML = ''; // Clear previous legend

    // Loop through overlay layers and add legend for visible ones
    overlayLayers.getLayers().forEach(layer => {
        if (layer.getVisible()) {
            if (layer.getSource() instanceof ImageWMS) {
                // For WMS raster layers, use GetLegendGraphic
                const layerName = layer.getSource().getParams().LAYERS;
                const legendUrl = `https://www.gis-geoserver.polimi.it/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerName}`;
                legendContent.innerHTML += `
                    <div style="margin-bottom:1em;">
                        <span style="font-weight:bold;">${layer.get('title')}</span><br>
                        <img src="${legendUrl}" alt="Legend for ${layer.get('title')}" style="background:#fff;max-width:200px;">
                    </div>
                `;
            }
            // Add similar logic for vector layers if needed
        }
    });
}

// Update legend on layer visibility change
overlayLayers.getLayers().forEach(layer => {
    layer.on('change:visible', updateLegend);
});

// Initial legend update
updateLegend();

// Add this where you want the slider to appear
var opacityControlDiv = document.createElement('div');
opacityControlDiv.id = 'opacity-control';
opacityControlDiv.style.position = 'absolute';
opacityControlDiv.style.top = '10px';
opacityControlDiv.style.right = '50px';
opacityControlDiv.style.zIndex = '1000';
opacityControlDiv.style.background = '#222';
opacityControlDiv.style.color = '#fff';
opacityControlDiv.style.padding = '10px';
opacityControlDiv.style.borderRadius = '8px';

var opacityLabel = document.createElement('label');
opacityLabel.setAttribute('for', 'overlay-opacity');
opacityLabel.style.marginRight = '8px';
opacityLabel.innerHTML = 'Overlay Transparency';

var opacitySlider = document.createElement('input');
opacitySlider.type = 'range';
opacitySlider.id = 'overlay-opacity';
opacitySlider.min = '0';
opacitySlider.max = '1';
opacitySlider.step = '0.01';
opacitySlider.value = '1';

opacityControlDiv.appendChild(opacityLabel);
opacityControlDiv.appendChild(opacitySlider);
document.body.appendChild(opacityControlDiv);

// Opacity slider event listener
opacitySlider.addEventListener('input', function() {
    var opacityValue = parseFloat(this.value);
    overlayLayers.getLayers().forEach(layer => {
        if (layer.getVisible()) {
            layer.setOpacity(opacityValue);
        }
    });
});
