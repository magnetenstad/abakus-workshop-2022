import React, { useContext } from 'react';
import { AppContext } from '../state/context';
import { Button } from '@mui/material';
import UploadAndDisplayImage from './UploadImage';

import '../App.css';
import { getDrawnRoute } from '../utils/routeUtils';
import { maxWidth } from '@mui/system';

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
        color: context.basemapIndex.value % 2 ? 'white' : 'black',
        width: 3,
      };

      mapView.graphics.add(route);
    });
  };

  return (
    <div
      className={isMobile ? 'widgetContainerMobile' : 'widgetContainer'}
      style={{ maxWidth: '350px' }}
    >
      <p>
        Legg til markører på kartet for å tegne en rute. Du kan tegne på
        frihånd, eller laste opp et bilde å tegne fra 😃
      </p>
      <UploadAndDisplayImage />
      <br />
      <Button variant="contained" color="primary" onClick={() => getRoute()}>
        Tegn rute
      </Button>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
        <Button variant="outlined" onClick={() => context.points.set([])}>
          Fjern markører
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            context.mapView.value.graphics =
              context.mapView.value.graphics.filter(
                (r) => r.attributes?.name != 'route'
              );
          }}
        >
          Fjern ruter
        </Button>
      </div>
      <br />
      <Button onClick={() => context.basemapIndex.set((i) => i + 1)}>
        Bytt tema
      </Button>
    </div>
  );
};

export default RouteWidget;
