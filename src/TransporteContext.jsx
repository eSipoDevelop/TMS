import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  obtenerTransportes,
  agregarTransporte,
  actualizarTransporte,
  eliminarTransporte
} from "./TransporteService";
import { toast } from "sonner";

export const TransporteContext = createContext();

export function TransporteProvider({ children }) {
  const [transportes, setTransportes] = useState([]);
  const [filtro, setFiltro] = useState({ nombre: "", tipo: "" });
  const [editando, setEditando] = useState(false);
  const [transporteEditado, setTransporteEditado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoTransporte, setNuevoTransporte] = useState({
    nombre: "",
    capacidad: "",
    tipo: ""
  });

  const cargarTransportes = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerTransportes();
      setTransportes(data || []);
      setError(null);
    } catch (e) {
      setError("Error al cargar transportes");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTransportes();
  }, [cargarTransportes]);

  // Filtro
  const handleFiltro = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  const transportesFiltrados = transportes.filter((t) => {
    const coincideNombre = t.nombre.toLowerCase().includes(filtro.nombre.toLowerCase());
    const coincideTipo = filtro.tipo ? t.tipo === filtro.tipo : true;
    return coincideNombre && coincideTipo;
  });

  // CRUD
  const handleAgregar = async (transporte) => {
    try {
      const nuevo = await agregarTransporte(transporte);
      setTransportes((prev) => [...prev, nuevo]);
    } catch (e) {
      toast.error("Error al agregar transporte");
    }
  };

  const handleActualizar = async (id, transporte) => {
    try {
      await actualizarTransporte(id, transporte);
      setTransportes((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...transporte } : t))
      );
    } catch (e) {
      toast.error("Error al actualizar transporte");
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarTransporte(id);
      setTransportes((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      toast.error("Error al eliminar transporte");
    }
  };

  const handleEditar = (transporte) => {
    setEditando(true);
    setTransporteEditado(transporte);
    setNuevoTransporte({ ...transporte });
  };

  return (
    <TransporteContext.Provider
      value={{
        transportes: transportesFiltrados,
        filtro,
        handleFiltro,
        cargando,
        error,
        editando,
        setEditando,
        transporteEditado,
        setTransporteEditado,
        nuevoTransporte,
        setNuevoTransporte,
        handleAgregar,
        handleActualizar,
        handleEliminar,
        handleEditar
      }}
    >
      {children}
    </TransporteContext.Provider>
  );
}
