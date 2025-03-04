import React, { useContext, useState, useEffect } from "react";
import { TransporteContext } from "./TransporteContext";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";

function Dashboard() {
    const { transportes } = useContext(TransporteContext);
    const [datosActualizados, setDatosActualizados] = useState(transportes);
    const [graficoExpandido, setGraficoExpandido] = useState(null);

    // 🔹 Simulación de actualización en tiempo real
    useEffect(() => {
        const intervalo = setInterval(() => {
            fetch("/api/transportes") // 📌 Sustituir con API real cuando esté disponible
                .then(response => response.json())
                .then(data => setDatosActualizados(data))
                .catch(() => setDatosActualizados(prev => [...prev])); // Mantiene datos previos si la API falla
        }, 10000);

        return () => clearInterval(intervalo);
    }, []);

    // 🔹 Datos para los gráficos
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

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">📊 Dashboard de Transportes</h2>

            {/* 📊 Gráficos distribuidos en dos columnas */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: "bar", titulo: "📊 Transportes por Tipo", data: barData, tipo: Bar },
                    { id: "pie", titulo: "🍰 Distribución de Transportes", data: pieData, tipo: Pie },
                    { id: "line", titulo: "📈 Evolución de la Capacidad", data: lineData, tipo: Line }
                ].map(({ id, titulo, data, tipo: ChartType }) => (
                    <div
                        key={id}
                        className="bg-gray-100 p-2 rounded-lg shadow text-center cursor-pointer hover:scale-105 transition-all"
                        onClick={() => setGraficoExpandido(id)}
                        style={{ width: "100%", maxWidth: "250px", height: "200px" }} // 📏 Tamaño más compacto
                    >
                        <h3 className="text-sm font-semibold mb-2">{titulo}</h3>
                        <div className="h-4/5">
                            <ChartType data={data} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔍 Modal para gráficos en tamaño grande */}
            {graficoExpandido && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full text-center relative">
                        <button className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => setGraficoExpandido(null)}>❌ Cerrar</button>
                        <h2 className="text-lg font-semibold mb-4">
                            {graficoExpandido === "bar" ? "📊 Transportes por Tipo" :
                            graficoExpandido === "pie" ? "🍰 Distribución de Transportes" : "📈 Evolución de la Capacidad"}
                        </h2>
                        {graficoExpandido === "bar" && <Bar data={barData} />}
                        {graficoExpandido === "pie" && <Pie data={pieData} />}
                        {graficoExpandido === "line" && <Line data={lineData} />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
