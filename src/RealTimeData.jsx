// frontend/src/RealTimeData.jsx
import React, { useState, useEffect } from 'react';

function RealTimeData() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reemplaza 'TU_API_KEY' con tu API key real
  const API_KEY = "TU_API_KEY";
  const city = "Mexico City";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error al obtener el clima:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Actualiza los datos cada 60 segundos
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [city, API_KEY]);

  if (loading) {
    return <p>Cargando datos en tiempo real...</p>;
  }

  if (!weather || weather.cod !== 200) {
    return <p>Error al cargar datos del clima.</p>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Clima en {city}</h3>
      <p>Temperatura: {weather.main.temp} °C</p>
      <p>Condición: {weather.weather[0].description}</p>
    </div>
  );
}

export default RealTimeData;
