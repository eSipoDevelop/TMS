import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/transportes"; // Ajusta si tu backend es distinto

function manejarErrores(error) {
  console.error("❌ Error en la API:", error);
  throw new Error(error.response?.data?.message || "Error desconocido en la API");
}

export async function obtenerTransportes() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    manejarErrores(error);
  }
}

export async function agregarTransporte(transporte) {
  try {
    const res = await axios.post(API_URL, transporte);
    return res.data;
  } catch (error) {
    manejarErrores(error);
  }
}

export async function actualizarTransporte(id, transporte) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, transporte);
    return res.data;
  } catch (error) {
    manejarErrores(error);
  }
}

export async function eliminarTransporte(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    manejarErrores(error);
  }
}
