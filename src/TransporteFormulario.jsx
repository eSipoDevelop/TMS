import React, { useContext, useEffect, useState } from "react";
import { TransporteContext } from "./TransporteContext";
import { toast } from "sonner"; 

function TransporteFormulario() {
    const { handleAgregar, handleActualizar, nuevoTransporte, setNuevoTransporte, editando, setEditando, transporteEditado } = useContext(TransporteContext);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);

    // ✅ Cargar datos al editar
    useEffect(() => {
        if (editando && transporteEditado) {
            setNuevoTransporte({ ...transporteEditado });
        } else {
            setNuevoTransporte({ nombre: "", capacidad: "", tipo: "" });
        }
    }, [editando, transporteEditado, setNuevoTransporte]);

    // ✅ Manejo de cambios en el formulario con validaciones en tiempo real
    const handleChange = (e) => {
        const { name, value } = e.target;
        let nuevoValor = name === "capacidad" ? (value ? parseInt(value, 10) : "") : value;

        setNuevoTransporte((prev) => ({ ...prev, [name]: nuevoValor }));

        // 🔥 Validaciones en tiempo real
        let erroresTemp = { ...errores };
        if (name === "nombre" && !value.trim()) {
            erroresTemp.nombre = "⚠️ El nombre es obligatorio.";
        } else {
            delete erroresTemp.nombre;
        }
        if (name === "capacidad" && (isNaN(nuevoValor) || nuevoValor <= 0)) {
            erroresTemp.capacidad = "⚠️ La capacidad debe ser un número positivo.";
        } else {
            delete erroresTemp.capacidad;
        }
        if (name === "tipo" && !value) {
            erroresTemp.tipo = "⚠️ Selecciona un tipo de transporte.";
        } else {
            delete erroresTemp.tipo;
        }
        setErrores(erroresTemp);
    };

    // ✅ Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errores).length > 0) return;

        setCargando(true);
        try {
            if (editando) {
                await handleActualizar(nuevoTransporte.id, nuevoTransporte);
                setEditando(false);
                toast.success(`✏️ Transporte "${nuevoTransporte.nombre}" actualizado con éxito`);
            } else {
                await handleAgregar(nuevoTransporte);
                toast.success(`✅ Transporte "${nuevoTransporte.nombre}" agregado con éxito`);
            }
            setNuevoTransporte({ nombre: "", capacidad: "", tipo: "" });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={`mt-6 p-6 rounded-lg shadow-md w-full max-w-2xl transition-all ${editando ? "bg-yellow-100" : "bg-white"}`}>
            <h2 className={`text-lg font-semibold mb-4 ${editando ? "text-yellow-700" : "text-gray-800"}`}>
                {editando ? "✏️ Editar Transporte" : "➕ Agregar Transporte"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 🚛 Nombre */}
                <div>
                    <label className="text-gray-700 font-medium">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Ejemplo: Camión de carga"
                        value={nuevoTransporte.nombre}
                        onChange={handleChange}
                        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                    {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
                </div>

                {/* 📦 Capacidad */}
                <div>
                    <label className="text-gray-700 font-medium">Capacidad (kg)</label>
                    <input
                        type="number"
                        name="capacidad"
                        placeholder="Ejemplo: 5000"
                        value={nuevoTransporte.capacidad}
                        onChange={handleChange}
                        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                    {errores.capacidad && <p className="text-red-500 text-sm mt-1">{errores.capacidad}</p>}
                </div>

                {/* 🚢 Tipo de transporte (🔓 YA NO ESTÁ BLOQUEADO) */}
                <div>
                    <label className="text-gray-700 font-medium">Tipo de Transporte</label>
                    <select
                        name="tipo"
                        value={nuevoTransporte.tipo}
                        onChange={handleChange}
                        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="Terrestre">🚛 Terrestre</option>
                        <option value="Aéreo">✈️ Aéreo</option>
                        <option value="Marítimo">🚢 Marítimo</option>
                    </select>
                    {errores.tipo && <p className="text-red-500 text-sm mt-1">{errores.tipo}</p>}
                </div>

                {/* 🔘 Botón de envío */}
                <button
                    type="submit"
                    className={`w-full py-3 px-5 rounded text-white font-semibold tracking-wide transition-all ${
                        editando ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                    {cargando ? "⏳ Guardando..." : editando ? "✏️ Guardar Cambios" : "➕ Agregar Transporte"}
                </button>
            </form>
        </div>
    );
}

export default TransporteFormulario;
