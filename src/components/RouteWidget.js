import React, { useState, useContext } from 'react';
import { AppContext } from '../state/context';
import { MenuItem, TextField, Button } from '@mui/material';

import '../App.css';
import getRandomRoute from '../utils/routeUtils';

const RouteWidget = () => {
  const context = useContext(AppContext);

  const [length, setLength] = useState(0); // Lengde på kalkulert rute
  const [radius, setRadius] = useState(1.5); // Radius rundt brukerens posisjon
  const isMobile = navigator.userAgent.match(
    /Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i
  );

  // Kalkuler ca antall skritt basert på rutens lengde
  const getSteps = (length) => {
    return Math.floor(length * 1400);
  };

  const getLength = (radius) => {
    return radius / 5000;
  };

  // Finn rute
  const getRoute = () => {
    const point = context.point.value;

    getRandomRoute(point, radius, context).then((result) => {
      // Vi trenger å fjerne gamle ruter før vi legger til nye
      // Hint: grafikken legges til MapView
      const mapView = context.mapView.value;

      mapView.graphics = mapView.graphics.filter(
        (r) => r.attributes?.name != 'route'
      );

      const route = result.data.routeResults[0].route;

      route.attributes.name = 'route';
      route.symbol = {
        type: 'simple-line',
        color: 'white',
        width: 3,
      };

      mapView.graphics.add(route);
      setLength(route.attributes.Total_Kilometers);
    });
  };

  return (
    <div className={isMobile ? 'widgetContainerMobile' : 'widgetContainer'}>
      Hvor mange skritt vil du gå idag?
      <div style={{ margin: '20px' }}>
        <TextField
          id="select"
          label="Skritt"
          value={radius}
          select
          onChange={(e) => setRadius(e.target.value)}
        >
          {[2500, 5000, 7500, 10000, 100000].map((option) => (
            <MenuItem key={getLength(option)} value={getLength(option)}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Button variant="contained" color="primary" onClick={() => getRoute()}>
        Finn rute
      </Button>
      {length > 0 && (
        <div style={{ padding: '10px' }}>
          <div>{length.toFixed(1)} kilometer</div>
          <div>~ {getSteps(length)} skritt</div>
        </div>
      )}
    </div>
  );
};

export default RouteWidget;
