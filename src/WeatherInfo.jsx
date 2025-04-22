// frontend/src/WeatherInfo.jsx
import React, { useEffect, useState } from 'react';

function WeatherInfo() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Usamos el WOEID de Ciudad de México: 116545
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("https://www.metaweather.com/api/location/116545/");
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error al obtener datos de metaweather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Actualiza cada 60 segundos
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Cargando clima...</div>;
  if (!weather || weather.consolidated_weather.length === 0) {
    return <div>Error al cargar datos del clima.</div>;
  }

  // Tomamos el clima del día actual
  const todayWeather = weather.consolidated_weather[0];

  return (
    <div id="clima" className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Clima en Ciudad de México</h3>
      <p>Temperatura: {todayWeather.the_temp.toFixed(1)} °C</p>
      <p>Estado: {todayWeather.weather_state_name}</p>
    </div>
  );
}

export default WeatherInfo;
