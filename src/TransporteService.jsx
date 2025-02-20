import axios from "axios";

// ⚠️ Verifica que esta URL sea correcta
const API_URL = "http://127.0.0.1:8000/transporte"; // ⚠️ Verifica que esto sea correcto

// ✅ Función genérica para manejar errores de API
const manejarErrores = (error) => {
    console.error("❌ Error en la API:", error);
    throw new Error(error.response?.data?.message || "Error desconocido en la API");
};

// ✅ Obtener transportes con mejor manejo de errores
export const obtenerTransportes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        manejarErrores(error);
    }
};

// ✅ Agregar transporte con mejor manejo de errores
export const agregarTransporte = async (transporte) => {
    try {
        console.log("🟢 Datos que se enviarán a la API:", transporte);  // 👀 Log de los datos antes de enviarlos

        const response = await axios.post(API_URL, transporte);
        console.log("✅ Transporte agregado:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al agregar transporte:", error.response?.data || error.message);
        manejarErrores(error);
    }
};


// ✅ Actualizar transporte con mejor manejo de errores
export const actualizarTransporte = async (id, transporte) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/transporte/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transporte),
        });

        if (!response.ok) {
            throw new Error(`Error en la actualización: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error en actualizarTransporte:", error); // ✅ Verifica el error
        throw error;
    }
};


// ✅ Eliminar transporte con mejor manejo de errores
export const eliminarTransporte = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        manejarErrores(error);
    }
};
