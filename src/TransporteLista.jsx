import React, { useContext, useState, useEffect } from "react";
import { TransporteContext } from "./TransporteContext";
import { toast } from "sonner"; 
import Papa from "papaparse"; // Para exportar CSV
import { utils, writeFile } from "xlsx"; // Para exportar Excel
import { saveAs } from "file-saver"; // Para descargar archivos

function TransporteLista() {
    const { transportes, handleEditar, handleEliminar } = useContext(TransporteContext);
    const [orden, setOrden] = useState({ campo: "nombre", asc: true });
    const [cargando, setCargando] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const transportesPorPagina = 5;
    const [filtro, setFiltro] = useState({ nombre: "", tipo: "" });
    const [modalEliminar, setModalEliminar] = useState(false);
    const [transporteAEliminar, setTransporteAEliminar] = useState(null);

    // ✅ Simulación de carga inicial
    useEffect(() => {
        const timer = setTimeout(() => setCargando(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // ✅ Función para cambiar el orden de los transportes
    const cambiarOrden = (campo) => {
        setOrden((prevOrden) => ({
            campo,
            asc: prevOrden.campo === campo ? !prevOrden.asc : true,
        }));
    };

    // ✅ Filtrar transportes según la búsqueda y el tipo seleccionado
    const transportesFiltrados = transportes.filter((transporte) =>
        (filtro.nombre ? transporte.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) : true) &&
        (filtro.tipo ? transporte.tipo === filtro.tipo : true)
    );

    // ✅ Ordenar transportes
    const transportesOrdenados = [...transportesFiltrados].sort((a, b) => {
        if (a[orden.campo] < b[orden.campo]) return orden.asc ? -1 : 1;
        if (a[orden.campo] > b[orden.campo]) return orden.asc ? 1 : -1;
        return 0;
    });

    // ✅ Paginación
    const indiceUltimo = paginaActual * transportesPorPagina;
    const indicePrimero = indiceUltimo - transportesPorPagina;
    const transportesPaginados = transportesOrdenados.slice(indicePrimero, indiceUltimo);
    const totalPaginas = Math.ceil(transportesOrdenados.length / transportesPorPagina);
    const irAPaginaAnterior = () => setPaginaActual((prev) => Math.max(prev - 1, 1));
    const irAPaginaSiguiente = () => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));

    // ✅ Función para mostrar el modal de confirmación antes de eliminar
    const confirmarEliminacion = (transporte) => {
        setTransporteAEliminar(transporte);
        setModalEliminar(true);
    };

    // ✅ Función para eliminar transporte tras confirmación
    const eliminarTransporte = () => {
        if (transporteAEliminar) {
            handleEliminar(transporteAEliminar.id);
            toast.success(`🚛 ${transporteAEliminar.nombre} eliminado con éxito.`);
            setModalEliminar(false);
            setTransporteAEliminar(null);
        }
    };

 // ✅ Función para exportar como CSV
 const exportarCSV = () => {
    const csv = Papa.unparse(transportes);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transportes.csv");
    toast.success("📥 CSV descargado con éxito");
};

// ✅ Función para exportar como Excel
const exportarExcel = () => {
    const ws = utils.json_to_sheet(transportes);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transportes");
    writeFile(wb, "transportes.xlsx");
    toast.success("📥 Excel descargado con éxito");
};



    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl transition-all">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                {/* 🔘 Botones de exportación */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={exportarCSV}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                >
                    📄 Exportar CSV
                </button>
                <button
                    onClick={exportarExcel}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                >
                    📊 Exportar Excel
                </button>
            </div>
               
               
                📋 Lista de Transportes
            </h2>

            {/* 🔍 Barra de búsqueda y filtro */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="🔍 Buscar transportes..."
                    value={filtro.nombre}
                    onChange={(e) => setFiltro((prev) => ({ ...prev, nombre: e.target.value }))}
                    className="border p-3 rounded w-full md:w-1/2 focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <select
                    value={filtro.tipo}
                    onChange={(e) => setFiltro((prev) => ({ ...prev, tipo: e.target.value }))}
                    className="border p-3 rounded w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 transition-all"
                >
                    <option value="">Todos</option>
                    <option value="Terrestre">🚛 Terrestre</option>
                    <option value="Aéreo">✈️ Aéreo</option>
                    <option value="Marítimo">🚢 Marítimo</option>
                </select>
            </div>

            {/* 🔄 Cargando */}
            {cargando ? (
                <p className="text-center text-gray-600">⏳ Cargando transportes...</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 shadow-sm">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="border p-3 cursor-pointer hover:bg-blue-600 transition-all" onClick={() => cambiarOrden("nombre")}>
                                        Nombre {orden.campo === "nombre" ? (orden.asc ? "⬆️" : "⬇️") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer hover:bg-blue-600 transition-all" onClick={() => cambiarOrden("capacidad")}>
                                        Capacidad {orden.campo === "capacidad" ? (orden.asc ? "⬆️" : "⬇️") : ""}
                                    </th>
                                    <th className="border p-3 cursor-pointer hover:bg-blue-600 transition-all" onClick={() => cambiarOrden("tipo")}>
                                        Tipo {orden.campo === "tipo" ? (orden.asc ? "⬆️" : "⬇️") : ""}
                                    </th>
                                    <th className="border p-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transportesPaginados.map((transporte) => (
                                    <tr key={transporte.id} className="text-center border-b hover:bg-gray-100 transition-all">
                                        <td className="border p-2">{transporte.nombre}</td>
                                        <td className="border p-2">{transporte.capacidad} kg</td>
                                        <td className="border p-2">{transporte.tipo}</td>
                                        <td className="border p-2">
                                            <button onClick={() => handleEditar(transporte)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-all">
                                                ✏️ Editar
                                            </button>
                                            <button onClick={() => confirmarEliminacion(transporte)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all">
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* 🚨 Modal de confirmación de eliminación */}
            {modalEliminar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center transition-all duration-300">
                        <h2 className="text-lg font-semibold mb-4 text-red-600">❗ Confirmar Eliminación</h2>
                        <p className="text-gray-700 mb-4">¿Seguro que deseas eliminar <b>{transporteAEliminar?.nombre}</b>?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setModalEliminar(false)} className="bg-gray-500 text-white px-4 py-2 rounded">❌ Cancelar</button>
                            <button onClick={eliminarTransporte} className="bg-red-500 text-white px-4 py-2 rounded">✅ Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransporteLista;
