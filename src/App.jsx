import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { TransporteContext } from "./TransporteContext";
import Dashboard from "./Dashboard";
import TransporteLista from "./TransporteLista";
import TransporteFormulario from "./TransporteFormulario";
import ModalConfirmacion from "./ModalConfirmacion";
import ModalConfirmacionActualizar from "./ModalConfirmacionActualizar";
import { Toaster } from "sonner";
import LoginForm from "./LoginForm";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const contexto = useContext(TransporteContext);

  if (!contexto) {
    console.error("❌ ERROR: No se obtuvo el contexto de TransporteContext.");
    return <h1 className="text-red-600 text-center">Error cargando la aplicación</h1>;
  }

  const { filtro, handleFiltro, transportes, cargando, error } = contexto;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-600 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Super Herramienta Logística Futuresca</h1>
        {/* Si quieres mostrar el usuario, quítalo si no lo deseas */}
        <div className="text-sm">Usuario</div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar sin íconos */}
        <aside className="w-64 bg-gray-50 border-r shadow-sm">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="block p-2 text-gray-700 rounded-md hover:bg-primary-100 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="block p-2 text-gray-700 rounded-md hover:bg-primary-100 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/transportes"
                  className="block p-2 text-gray-700 rounded-md hover:bg-primary-100 transition-colors"
                >
                  Transportes
                </Link>
              </li>
              <li>
                <Link
                  to="/formulario"
                  className="block p-2 text-gray-700 rounded-md hover:bg-primary-100 transition-colors"
                >
                  Formulario
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Routes>
            <Route path="/" element={<h2 className="text-xl">Bienvenido a la página de inicio</h2>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transportes" element={<TransporteLista />} />
            <Route path="/formulario" element={<TransporteFormulario />} />
            <Route path="/login" element={<LoginForm />} /> {/* Nuevo */}
            <Route path="/dashboard" element={<ProtectedRoute>
      <Dashboard /> </ProtectedRoute>
  }
/>
          </Routes>

          {/* Sección de Búsqueda (global) */}
          <section id="busqueda" className="mb-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Búsqueda Global</h2>
            <div className="flex gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="🔍 Buscar por nombre..."
                value={filtro.nombre}
                onChange={handleFiltro}
                className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 flex-1"
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
          </section>

          {/* Vista Rápida de la Lista de Transportes */}
          <section id="transportes" className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Lista de Transportes (Vista Rápida)</h2>
            {!cargando && transportes.length > 0 && <TransporteLista />}
            {cargando && <p className="text-center text-gray-500">Cargando transportes...</p>}
            {!cargando && transportes.length === 0 && (
              <p className="text-center text-gray-500">No hay transportes disponibles.</p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
          </section>

          {/* Dashboard embebido */}
          <section id="dashboard" className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard de Transportes</h2>
            <Dashboard />
          </section>

          {/* Formulario embebido */}
          <section id="formulario" className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Agregar/Editar Transporte</h2>
            <TransporteFormulario />
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-primary-600 text-white text-center p-2">
        © 2025 Super Herramienta Logística Futuresca
      </footer>

      {/* Modales */}
      <ModalConfirmacion />
      <ModalConfirmacionActualizar />

      {/* Notificaciones con Sonner */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
