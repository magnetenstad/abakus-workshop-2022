import React, { useRef, useContext, useEffect } from 'react';
import { AppContext } from '../state/context';

import Locate from '@arcgis/core/widgets/Locate';
import esriConfig from '@arcgis/core/config.js';
import MapView from '@arcgis/core/views/MapView';
import Popup from '@arcgis/core/widgets/Popup';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';

import '../App.css';

const MapComponent = () => {
  // Required: Set this property to insure assets resolve correctly.
  esriConfig.assetsPath = './assets';
  const mapDiv = useRef(null);
  const context = useContext(AppContext);

  // Opprett kartet
  useEffect(() => {
    if (mapDiv.current) {
      // Det første vi trenger er et Map objekt med bakgrunnskart
      // Konstruktøren er allerede i koden, men vi må velge bakgrunnskartet
      // En liste med valg finner vi i API dokumentasjonen:
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
      const map = new Map({
        basemap: 'arcgis-streets-night',
      });

      // Vi ønsker så å hente data som vi kan legge til i kartet.
      // På følgende tjeneste finner dere punkter som viser en rekke turistatraksjoner i Europa:
      // Url: https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0
      // Se dokumentasjonssiden for et eksempel: https://developers.arcgis.com/javascript/latest/add-a-feature-layer/

      // Om man ønsker å ha en popup når man trykker på punktene i FeatureLayeret trenger man også å legge
      // inn en popup template i featurelayeret. Denne har vi ferdig definert her.
      const popUpTemplate = new PopupTemplate({
        title: '{name}',
        content: [
          {
            type: 'text',
            text: `<p>Type: {tourism}</p>
                  <p>{description}</p>`,
          },
        ],
      });

      // Hent dataen
      const featureLayer = new FeatureLayer({
        url: 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0',
        popupEnabled: true,
        popUpTemplate,
      });
      // Legg til dataen i kartet
      map.add(featureLayer);

      // TODO: Legge til dataen i kartet
      context.featureLayer.set(featureLayer);

      // TODO: Legg til dataen i context

      // For å kunne vise kartet må dette legges til i et MapView
      // Dokumentasjonen for MapView finnes her:
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
      // Dersom man ønsker å se Trondheimsområdet er koordinatene for det
      // ymin: 63.40182257265643,
      // xmin: 10.227928161621094,
      // ymax: 63.453731595863324,
      // xmax: 10.560264587402344

      new MapView({
        // MapView trenger minimum feltene:
        // map
        map,
        container: mapDiv.current,
        extent: {
          ymin: 63.40182257265643,
          xmin: 10.227928161621094,
          ymax: 63.453731595863324,
          xmax: 10.560264587402344,
        },
        // container
        // extent(valgfritt, men lurt å ha med)
      }).when((mapView) => {
        // Når kartet er initialisert kan vi manipulre dataen her
        var locateWidget = new Locate({
          view: mapView,
          scale: 1000,
        });
        mapView.ui.add(locateWidget, 'top-left');
        context.mapView.set(mapView);
        mapView.popup.autoOpenEnabled = false;
        mapView.on('click', (e) => {
          context.point.set({
            type: 'point',
            latitude: e.mapPoint.latitude,
            longitude: e.mapPoint.longitude,
          });
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!context.mapView.value || !context.point.value) return;

    const markerSymbol = new SimpleMarkerSymbol({});
    const pointGraphic = new Graphic({
      geometry: context.point.value,
      symbol: markerSymbol,
      id: 'startMarker',
    });
    const filtered = context.mapView.value.graphics.filter(
      (s) => s.id != 'startMarker'
    );
    context.mapView.value.graphics = filtered;
    context.mapView.value.graphics.add(pointGraphic);
  }, [context.point]);

  return <div className="mapDiv" ref={mapDiv}></div>;
};

export default MapComponent;
