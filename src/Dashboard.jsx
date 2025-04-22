// src/Dashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import { TransporteContext } from "./TransporteContext";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Simulacion from "./Simulacion";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";
import OpenMeteoWeather from "./OpenMeteoWeather";

// Registrar Chart.js: todos los registerables y el plugin de zoom
Chart.register(...registerables, zoomPlugin);

// Configurar íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Componente para elementos arrastrables (gráficos)
function SortableItem({ id, titulo, data, tipo, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        width: "100%",
        height: "250px",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
      }}
      {...attributes}
      {...listeners}
      className="text-center cursor-pointer hover:scale-105 transition-all"
      onClick={() => onClick(id)}
    >
      <h3 className="text-sm font-semibold mb-2">{titulo}</h3>
      <div style={{ height: "80%" }}>
        {React.createElement(tipo, { data, options: { maintainAspectRatio: false, responsive: true } })}
      </div>
    </div>
  );
}

function Dashboard() {
  const { transportes } = useContext(TransporteContext);
  const [datosActualizados, setDatosActualizados] = useState(transportes);
  const [graficoExpandido, setGraficoExpandido] = useState(null);
  const [ordenGraficos, setOrdenGraficos] = useState(["bar", "pie", "line", "predLine"]);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [predictions, setPredictions] = useState([]);

  // Reconocimiento de voz
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Tu navegador no soporta la API de reconocimiento de voz");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }
    return () => recognition.abort();
  }, [listening]);

  // Cargar orden de gráficos desde localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("dashboard_order");
    if (savedOrder) {
      setOrdenGraficos(JSON.parse(savedOrder));
    }
  }, []);

  // Cargar datos de transportes cada 10s
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/transportes");
        const data = await response.json();
        setDatosActualizados(data);
      } catch (error) {
        console.error("Error al cargar los transportes:", error);
      }
    };
    fetchData();
    const intervalo = setInterval(fetchData, 10000);
    return () => clearInterval(intervalo);
  }, []);

  // Cargar predicciones (ejemplo: 5 días)
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/predict?days=5");
        const data = await res.json();
        if (data && data.predictions) {
          setPredictions(data.predictions);
        }
      } catch (error) {
        console.error("Error al obtener predicciones:", error);
      }
    };
    fetchPredictions();
  }, []);

  // Estadísticas en tarjetas
  const stats = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white shadow rounded-lg p-4 flex flex-col">
        <h3 className="text-gray-500 text-sm">Transportes Totales</h3>
        <p className="text-2xl font-bold text-gray-800 mt-2">{transportes.length}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 flex flex-col">
        <h3 className="text-gray-500 text-sm">Terrestres</h3>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {transportes.filter((t) => t.tipo === "Terrestre").length}
        </p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 flex flex-col">
        <h3 className="text-gray-500 text-sm">Aéreos</h3>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {transportes.filter((t) => t.tipo === "Aéreo").length}
        </p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 flex flex-col">
        <h3 className="text-gray-500 text-sm">Marítimos</h3>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          {transportes.filter((t) => t.tipo === "Marítimo").length}
        </p>
      </div>
    </div>
  );

  // Datos para gráficos
  const tiposTransporte = ["Terrestre", "Aéreo", "Marítimo"];
  const datosPorTipo = tiposTransporte.map(
    (tipo) => datosActualizados.filter((t) => t.tipo === tipo).length
  );

  const barData = {
    labels: tiposTransporte,
    datasets: [
      {
        label: "Cantidad",
        data: datosPorTipo,
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
      },
    ],
  };

  const pieData = {
    labels: tiposTransporte,
    datasets: [
      {
        data: datosPorTipo,
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
      },
    ],
  };

  const lineData = {
    labels: datosActualizados.map((t) => t.fecha),
    datasets: [
      {
        label: "Capacidad",
        data: datosActualizados.map((t) => t.capacidad),
        borderColor: "#FF5722",
        fill: false,
      },
    ],
  };

  const predLineData = {
    labels: predictions.map((p) => p.date),
    datasets: [
      {
        label: "Capacidad Predicha",
        data: predictions.map((p) => p.predicted_capacity),
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  const graficos = {
    bar: { titulo: "📊 Transportes por Tipo", data: barData, tipo: Bar },
    pie: { titulo: "🍰 Distribución de Transportes", data: pieData, tipo: Pie },
    line: { titulo: "📈 Evolución de la Capacidad", data: lineData, tipo: Line },
    predLine: { titulo: "🔮 Predicción de Capacidad", data: predLineData, tipo: Line },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        📊 Dashboard de Transportes
      </h2>

      {/* Estadísticas */}
      {stats}

      {/* Sección de preguntas (Reconocimiento de voz) */}
      <div className="mb-4 flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Escribe tu pregunta..."
        />
        <button
          onClick={() => setListening(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {listening ? "🎙️ Escuchando..." : "Hablar"}
        </button>
        <button
          onClick={() => setListening(false)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Detener
        </button>
        <button
          onClick={() => alert("Generando gráfico...")}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Generar
        </button>
      </div>

      {/* Sección de Gráficos (Drag & Drop) */}
      <DndContext collisionDetection={closestCorners} onDragEnd={() => {}}>
        <SortableContext items={ordenGraficos} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            {ordenGraficos.map((id) => (
              <SortableItem
                key={id}
                id={id}
                titulo={graficos[id].titulo}
                data={graficos[id].data}
                tipo={graficos[id].tipo}
                onClick={setGraficoExpandido}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Sección de Mapa con Leaflet */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Ubicación de Operaciones</h3>
        <MapContainer center={[19.4326, -99.1332]} zoom={10} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[19.4326, -99.1332]}>
            <Popup>Ciudad de México</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Sección de Simulación */}
      <Simulacion />

      {/* Sección de Datos en Tiempo Real (Clima) */}
      <OpenMeteoWeather />
    </div>
  );
}

export default Dashboard;
