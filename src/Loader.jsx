import React from "react";

function Loader() {
    return (
        <div className="flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="ml-3 text-blue-500 font-semibold">Cargando transportes...</p>
        </div>
    );
}

export default Loader;
