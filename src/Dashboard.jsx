import React, { useContext, useState, useEffect } from "react";
import { TransporteContext } from "./TransporteContext";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// 🔹 Configuración del Mapa
const mapContainerStyle = { width: "100%", height: "400px", borderRadius: "8px" };
const center = { lat: 19.4326, lng: -99.1332 };

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
    const [ordenGraficos, setOrdenGraficos] = useState(["bar", "pie", "line"]);
    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);
    const [predictions, setPredictions] = useState([]);

    // 🔹 Cargar Google Maps
    const { isLoaded } = useLoadScript({ googleMapsApiKey: "AIzaSyCibRfOSCUJyxdoOdEYI7mqQ5pB9VW6dhc" });

    // 🔹 Configuración de reconocimiento de voz
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

    // 🔹 Cargar configuración previa desde LocalStorage
    useEffect(() => {
        const savedOrder = localStorage.getItem("dashboard_order");
        if (savedOrder) {
            setOrdenGraficos(JSON.parse(savedOrder));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/transportes");
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

    const tiposTransporte = ["Terrestre", "Aéreo", "Marítimo"];
    const datosPorTipo = tiposTransporte.map(tipo => datosActualizados.filter(t => t.tipo === tipo).length);

    const barData = {
        labels: tiposTransporte,
        datasets: [{ label: "Cantidad", data: datosPorTipo, backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"] }]
    };

    const pieData = {
        labels: tiposTransporte,
        datasets: [{ data: datosPorTipo, backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"] }]
    };

    const lineData = {
        labels: datosActualizados.map(t => t.fecha),
        datasets: [{ label: "Capacidad", data: datosActualizados.map(t => t.capacidad), borderColor: "#FF5722", fill: false }]
    };

    const graficos = {
        bar: { titulo: "📊 Transportes por Tipo", data: barData, tipo: Bar },
        pie: { titulo: "🍰 Distribución de Transportes", data: pieData, tipo: Pie },
        line: { titulo: "📈 Evolución de la Capacidad", data: lineData, tipo: Line }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">📊 Dashboard de Transportes</h2>

            {/* 🔹 Sección de preguntas */}
            <div className="mb-4 flex items-center space-x-3">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Escribe tu pregunta..."
                />
                <button onClick={() => setListening(true)} className="bg-blue-500 text-white px-3 py-1 rounded">
                    {listening ? "🎙️ Escuchando..." : "Hablar"}
                </button>
                <button onClick={() => setListening(false)} className="bg-red-500 text-white px-3 py-1 rounded">Detener</button>
                <button onClick={() => alert("Generando gráfico...")} className="bg-green-500 text-white px-3 py-1 rounded">Generar</button>
            </div>

            {/* 🔹 Gráficos */}
            <DndContext collisionDetection={closestCorners} onDragEnd={() => {}}>
                <SortableContext items={ordenGraficos} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-3 gap-4">
                        {ordenGraficos.map((id) => (
                            <SortableItem key={id} id={id} titulo={graficos[id].titulo} data={graficos[id].data} tipo={graficos[id].tipo} onClick={setGraficoExpandido} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* 🔹 Mapa de Google */}
            {isLoaded && <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}><Marker position={center} /></GoogleMap>}
        </div>
    );
}

export default Dashboard;
