import React, { useContext } from "react";
import { TransporteContext } from "./TransporteContext";

function ModalConfirmacionActualizar() {
    const { modalActualizar, setModalActualizar, handleConfirmarActualizacion } = useContext(TransporteContext);

    if (!modalActualizar) return null; // No renderizar si está cerrado

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-lg font-semibold mb-4 text-blue-600">
                    <span role="img" aria-label="Editar">✏️</span> Confirmar Actualización
                </h2>
                <p className="text-gray-700 mb-4">
                    ¿Estás seguro de que deseas actualizar este transporte? 
                </p>

                <div className="flex justify-center gap-4">
                    {/* Botón para cancelar */}
                    <button
                        onClick={() => setModalActualizar(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
                    >
                        <span role="img" aria-label="Cancelar">❌</span> Cancelar
                    </button>

                    {/* Botón para confirmar actualización */}
                    <button
                        onClick={handleConfirmarActualizacion}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                    >
                        <span role="img" aria-label="Confirmar">✅</span> Sí, actualizar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacionActualizar;
