import React, { useState, useEffect } from "react";

function OpenMeteoWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const lat = 19.4326;
        const lon = -99.1332;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error("Error al obtener datos de Open-Meteo:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (loading) return <p>Cargando clima...</p>;
  if (!weather || !weather.current_weather) return <p>Error al cargar datos del clima.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Clima en Ciudad de México</h3>
      <p>Temperatura: {weather.current_weather.temperature} °C</p>
      <p>Velocidad del viento: {weather.current_weather.windspeed} km/h</p>
    </div>
  );
}

export default OpenMeteoWeather;
