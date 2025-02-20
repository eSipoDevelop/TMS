import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { obtenerTransportes, agregarTransporte, actualizarTransporte, eliminarTransporte } from "./TransporteService";
import { toast } from "sonner"; // ✅ Notificaciones

const TransporteContext = createContext();

// ✅ Función `Debounce` para mejorar el rendimiento del filtrado
const useDebouncedEffect = (callback, delay, dependencies) => {
    const handler = useRef(null);
    useEffect(() => {
        if (handler.current) clearTimeout(handler.current);
        handler.current = setTimeout(callback, delay);
        return () => clearTimeout(handler.current);
    }, dependencies);
};

// ✅ Función para normalizar texto (mayúscula inicial y minúsculas después)
const normalizarTexto = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

const TransporteProvider = ({ children }) => {
    const [transportes, setTransportes] = useState([]);
    const [filtro, setFiltro] = useState({ nombre: "", tipo: "" });
    const [editando, setEditando] = useState(false);
    const [transporteEditado, setTransporteEditado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [nuevoTransporte, setNuevoTransporte] = useState({ nombre: "", capacidad: "", tipo: "" });

    // ✅ Cargar transportes al iniciar
    const cargarTransportes = useCallback(async () => {
        setCargando(true);
        try {
            const response = await obtenerTransportes();
            setTransportes(response || []);
        } catch (error) {
            toast.error("❌ Error al cargar transportes");
        } finally {
            setTimeout(() => setCargando(false), 500);
        }
    }, []);

    useEffect(() => {
        cargarTransportes();
    }, [cargarTransportes]);

    // ✅ Filtrado con `Debounce` sin modificar `setTransportes` directamente
    const [transportesFiltrados, setTransportesFiltrados] = useState([]);

    useDebouncedEffect(() => {
        setTransportesFiltrados(
            transportes.filter((t) =>
                t.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
                (filtro.tipo === "" || t.tipo === filtro.tipo)
            )
        );
    }, 500, [filtro, transportes]);

    // ✅ Agregar transporte
    const handleAgregar = async (transporte) => {
        try {
            const nuevoTransporte = await agregarTransporte(transporte);
            setTransportes((prev) => [...prev, nuevoTransporte]);
            toast.success("✅ Transporte agregado");
        } catch (error) {
            toast.error("❌ Error al agregar el transporte");
        }
    };

    // ✅ Actualizar transporte
    const handleActualizar = async (id, transporte) => {
        if (!id) {
            toast.error("❌ Error: No se puede actualizar sin ID.");
            return;
        }

        try {
            transporte.tipo = normalizarTexto(transporte.tipo); // ✅ Se normaliza correctamente
            await actualizarTransporte(id, transporte);
            setTransportes((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...transporte } : t))
            );
            toast.success("✅ Transporte actualizado");
        } catch (error) {
            toast.error("❌ Error al actualizar transporte");
        }
    };

    // ✅ Eliminar transporte
    const handleEliminar = async (id) => {
        try {
            await eliminarTransporte(id);
            setTransportes((prev) => prev.filter((t) => t.id !== id));
            toast.success("✅ Transporte eliminado");
        } catch (error) {
            toast.error("❌ Error al eliminar transporte");
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
                setFiltro,
                editando,
                setEditando,
                transporteEditado,
                setTransporteEditado,
                cargando,
                nuevoTransporte,
                setNuevoTransporte,
                handleAgregar,
                handleActualizar,
                handleEliminar,
                handleEditar,
            }}
        >
            {children}
        </TransporteContext.Provider>
    );
};

export { TransporteContext, TransporteProvider };
