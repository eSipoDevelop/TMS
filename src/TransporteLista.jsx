// src/TransporteLista.jsx
import React, { useContext, useState } from "react";
import { TransporteContext } from "./TransporteContext";
import { AuthContext } from "./AuthContext";  // Para obtener el rol
import { toast } from "sonner";
import Papa from "papaparse"; // Para exportar CSV
import { utils, writeFile } from "xlsx"; // Para exportar Excel
import { saveAs } from "file-saver";
import ReportePDF from "./ReportePDF"; // Componente para generar PDF

function TransporteLista() {
  const { transportes, handleEditar, handleEliminar } = useContext(TransporteContext);
  const { rol } = useContext(AuthContext);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [transporteAEliminar, setTransporteAEliminar] = useState(null);
  
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const transportesPorPagina = 6; // Puedes ajustar según tus necesidades
  
  // Cálculo de índices para paginación
  const indiceUltimo = paginaActual * transportesPorPagina;
  const indicePrimero = indiceUltimo - transportesPorPagina;
  const transportesPaginados = transportes.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(transportes.length / transportesPorPagina);
  
  const exportarCSV = () => {
    const csv = Papa.unparse(transportes);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transportes.csv");
    toast.success("📥 CSV descargado con éxito");
  };

  const exportarExcel = () => {
    const ws = utils.json_to_sheet(transportes);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transportes");
    writeFile(wb, "transportes.xlsx");
    toast.success("📥 Excel descargado con éxito");
  };

  const confirmarEliminacion = (transporte) => {
    setTransporteAEliminar(transporte);
    setModalEliminar(true);
  };

  const eliminarTransporte = () => {
    if (transporteAEliminar) {
      handleEliminar(transporteAEliminar.id);
      toast.success(`🚛 ${transporteAEliminar.nombre} eliminado con éxito.`);
      setModalEliminar(false);
      setTransporteAEliminar(null);
    }
  };

  // Funciones para cambiar de página
  const irAPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const irAPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <div>
      {/* Botones de exportación y Reporte PDF */}
      <div className="flex gap-4 mb-4">
        <ReportePDF selector="#reporte-lista" />
        <button
          onClick={exportarCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          📄 Exportar CSV
        </button>
        <button
          onClick={exportarExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          📊 Exportar Excel
        </button>
      </div>

      {/* Vista en Cards con paginación */}
      <div id="reporte-lista" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {transportesPaginados.map((t) => (
          <div key={t.id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.nombre}</h3>
              <p className="text-gray-600">Capacidad: {t.capacidad} kg</p>
              <p className="text-gray-600">Tipo: {t.tipo}</p>
            </div>
            <div className="flex mt-4 space-x-2">
              <button
                onClick={() => handleEditar(t)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
              {rol === "admin" && (
                <button
                  onClick={() => confirmarEliminacion(t)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={irAPaginaAnterior}
          disabled={paginaActual === 1}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={irAPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de confirmación de eliminación */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-semibold mb-4 text-red-600">❗ Confirmar Eliminación</h2>
            <p className="text-gray-700 mb-4">
              ¿Seguro que deseas eliminar <b>{transporteAEliminar?.nombre}</b>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModalEliminar(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={eliminarTransporte}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                ✅ Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransporteLista;
