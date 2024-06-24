import { createScene } from 'flipdisc-server'
import { getForecastLatLon } from '../src/weather/api.js';
import WeatherView from '../src/weather/view.js';

const defaults = {
  lat: '37.7705462',
  lon: '-122.4428217'
}

const schema = {
  title: 'Weather',
  description: 'Weather forecast',
  properties: {
    lat: {
      type: 'string',
      default: defaults.lat
    },
    lon: {
      type: 'string',
      default: defaults.lon
    }
  }
}

const formatTemp = temp => {
  return temp + '°';
}


const calculateSunPercentage = (sunrise, sunset) => {
  const currentTime = new Date();

  if (currentTime < sunrise) return 0;
  if (currentTime > sunset) return 100;

  const totalDaylightSeconds = (sunset- sunrise) / 1000;
  const elapsedDaylightSeconds = (currentTime - sunrise) / 1000;

  const percentage = (elapsedDaylightSeconds / totalDaylightSeconds) * 100;

  return percentage;
}


const weather = async function(options) {
  options = { ...defaults, ...options };
  const { lat, lon } = options;
  const scene = new createScene();
  let view, forecast, sunrise, sunset;

  scene.once('loaded', async () => {
    const weather = await getForecastLatLon(lat, lon);
    if (!weather) return

    forecast = weather.forecast;
    sunrise = weather.sunrise;
    sunset = weather.sunset;
    
    const current = forecast[0];
    const temp = formatTemp(current.temperature);
    const sunPercentage = calculateSunPercentage(sunrise, sunset);
    view = new WeatherView(temp, sunPercentage)

    scene.add(view);
  })
  
  scene.useLoop(() => {
    if (!forecast) return;
    const current = forecast[0];
    const temp = formatTemp(current.temperature);
    const sunPercentage = calculateSunPercentage(sunrise, sunset);

    view.text = temp;
    view.update(sunPercentage)
  }, 0.1)

  return scene;
}

export { weather as scene, schema }