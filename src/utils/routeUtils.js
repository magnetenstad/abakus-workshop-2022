import * as route from '@arcgis/core/rest/route';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import Graphic from '@arcgis/core/Graphic';

export const getDrawnRoute = (context) => {
  return new Promise(async (resolve, reject) => {
    const routeUrl =
      'https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

    const graphics = [];
    for (var i = 0; i < context.points.value.length; i++) {
      graphics.push(new Graphic({ geometry: context.points.value[i] }));
    }
    var routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: graphics, // Pass the array of graphics
      }),
      returnDirections: false,
    });

    try {
      const data = await route.solve(routeUrl, routeParams);
      // Display the route
      resolve({
        data: data,
      });
    } catch (error) {
      resolve([]);
    }
  });
};
