import React, { useState, useContext } from 'react';
import { AppContext } from '../state/context';
import { MenuItem, TextField, Button } from '@mui/material';
import UploadAndDisplayImage from './UploadImage';

import '../App.css';
import { getDrawnRoute } from '../utils/routeUtils';

const RouteWidget = () => {
  const context = useContext(AppContext);

  const isMobile = navigator.userAgent.match(
    /Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i
  );

  // Finn rute
  const getRoute = () => {
    getDrawnRoute(context).then((result) => {
      const mapView = context.mapView.value;
      const route = result.data.routeResults[0].route;

      route.attributes.name = 'route';
      route.symbol = {
        type: 'simple-line',
        color: context.basemapIndex.value ? 'white' : 'black',
        width: 3,
      };

      mapView.graphics.add(route);
    });
  };

  return (
    <div className={isMobile ? 'widgetContainerMobile' : 'widgetContainer'}>
      <p>Trykk på kartet for å tegne en rute!</p>

      <Button variant="contained" color="primary" onClick={() => getRoute()}>
        Finn rute
      </Button>
      <Button onClick={() => context.points.set([])}>Fjern markører</Button>
      <Button
        onClick={() => {
          context.mapView.value.graphics =
            context.mapView.value.graphics.filter(
              (r) => r.attributes?.name != 'route'
            );
        }}
      >
        Fjern stier
      </Button>
      <Button onClick={() => context.basemapIndex.set((i) => i + 1)}>
        Bytt tema
      </Button>
      <UploadAndDisplayImage />
    </div>
  );
};

export default RouteWidget;
