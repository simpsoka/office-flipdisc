import SunCalc from 'suncalc'

async function getGridPoints(lat, lon) {
  const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
  try {
    const res = await fetch(pointsUrl);
    if (!res.ok) {
      throw new Error(`Error status: ${res.status}`);
    }
    const data = await res.json();
    return data.properties;
  } catch (error) {
    console.error(`Failed to fetch grid points: ${error.message}`);
    throw error;  // Re-throw error to handle it in the calling function
  }
}

async function getForecast(office, gridX, gridY) {
  const forecastUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;
  try {
    const res = await fetch(forecastUrl);
    if (!res.ok) {
      throw new Error(`Error status: ${res.status}`);
    }
    const data = await res.json();
    return data.properties.periods;
  } catch (error) {
    console.error(`Failed to fetch forecast: ${error.message}`);
    throw error;  // Re-throw error to handle it in the calling function
  }
}

async function getForecastLatLon(lat, lon) {
  try {
    const { cwa: office, gridX, gridY } = await getGridPoints(lat, lon);
    const forecast = await getForecast(office, gridX, gridY);
    const { sunrise, sunset } = SunCalc.getTimes(new Date(), lat, lon);
    return { forecast, sunrise, sunset };
  } catch (error) {
    console.error(`Failed to get forecast for lat: ${lat}, lon: ${lon} - ${error.message}`);
    return { error: error.message };
  }
}

export { getForecastLatLon };