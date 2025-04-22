import React, { useState } from "react";
import { Line } from "react-chartjs-2";

function Simulacion() {
  const [dias, setDias] = useState(5);
  const [incremento, setIncremento] = useState(5);
  const [resultado, setResultado] = useState([]);

  const simular = () => {
    let capacidad = 100;
    const simulacion = [];
    const today = new Date();

    for (let i = 1; i <= dias; i++) {
      capacidad += incremento;
      const fecha = new Date(today);
      fecha.setDate(today.getDate() + i);
      simulacion.push({
        date: fecha.toISOString().split("T")[0],
        capacity: capacidad
      });
    }
    setResultado(simulacion);
  };

  const data = {
    labels: resultado.map((r) => r.date),
    datasets: [
      {
        label: "Simulación de Capacidad",
        data: resultado.map((r) => r.capacity),
        borderColor: "#36A2EB",
        fill: false
      }
    ]
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Simulación de Escenarios</h3>
      <div className="mb-4">
        <label className="mr-2">Número de días:</label>
        <input
          type="number"
          value={dias}
          onChange={(e) => setDias(parseInt(e.target.value) || 0)}
          className="border p-1 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Incremento diario:</label>
        <input
          type="number"
          value={incremento}
          onChange={(e) => setIncremento(parseInt(e.target.value) || 0)}
          className="border p-1 rounded"
        />
      </div>
      <button onClick={simular} className="bg-green-500 text-white px-4 py-2 rounded">
        Simular
      </button>

      {resultado.length > 0 && (
        <div className="mt-6" style={{ height: "300px" }}>
          <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      )}
    </div>
  );
}

export default Simulacion;
