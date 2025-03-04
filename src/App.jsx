import React, { useContext } from "react";
import { TransporteContext } from "./TransporteContext";
import TransporteLista from "./TransporteLista";
import TransporteFormulario from "./TransporteFormulario";
import Dashboard from "./Dashboard";
import ModalConfirmacion from "./ModalConfirmacion";
import ModalConfirmacionActualizar from "./ModalConfirmacionActualizar";  
import { Toaster } from "sonner";  

function App() {
    const contexto = useContext(TransporteContext);

    if (!contexto) {
        console.error("❌ ERROR: No se obtuvo el contexto de TransporteContext.");
        return <h1 className="text-red-600 text-center">Error cargando la aplicación</h1>;
    }

    const { transportes, filtro, handleFiltro, cargando, error } = contexto;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">
                📦 Gestión de Transportes
            </h1>

            {/* 🔹 Campo de búsqueda */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    name="nombre"
                    placeholder="🔍 Buscar por nombre..."
                    value={filtro.nombre}
                    onChange={handleFiltro}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                <select
                    name="tipo"
                    value={filtro.tipo}
                    onChange={handleFiltro}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Todos</option>
                    <option value="Terrestre">🚛 Terrestre</option>
                    <option value="Aéreo">✈️ Aéreo</option>
                    <option value="Marítimo">🚢 Marítimo</option>
                </select>
            </div>

            {/* 🔹 Contenedor principal */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                {!cargando && transportes.length > 0 && <TransporteLista />}
                {cargando && <p className="text-center text-gray-500">Cargando transportes...</p>}
                {!cargando && transportes.length === 0 && <p className="text-center text-gray-500">No hay transportes disponibles.</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {/* 🔹 Dashboard */}
                <Dashboard />  {/* 🔹 Nuevo Dashboard optimizado */}

                {/* 🔹 Formulario */}
                <TransporteFormulario />
                <ModalConfirmacion />
                <ModalConfirmacionActualizar />
            </div>

            {/* ✅ Notificaciones con Sonner */}
            <Toaster position="top-right" richColors />
        </div>
    );
}

export default App;
