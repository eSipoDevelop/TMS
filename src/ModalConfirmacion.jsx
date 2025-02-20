import React, { useContext } from "react";
import { TransporteContext } from "./TransporteContext";

function ModalConfirmacion() {
    const { modalAbierto, setModalAbierto, confirmarEliminacion } = useContext(TransporteContext);

    if (!modalAbierto) return null; // No renderizar el modal si está cerrado

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-lg font-semibold mb-4 text-red-600">
                    <span role="img" aria-label="Advertencia">⚠️</span> Confirmar Eliminación
                </h2>
                <p className="text-gray-700 mb-4">
                    ¿Estás seguro de que deseas eliminar este transporte? 
                    <br /> <strong>Esta acción no se puede deshacer.</strong>
                </p>

                <div className="flex justify-center gap-4">
                    {/* Botón para cancelar */}
                    <button
                        onClick={() => setModalAbierto(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
                    >
                        <span role="img" aria-label="Cancelar">❌</span> Cancelar
                    </button>

                    {/* Botón para confirmar eliminación */}
                    <button
                        onClick={confirmarEliminacion}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
                    >
                        <span role="img" aria-label="Eliminar">🗑️</span> Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacion;
