// frontend/src/ReportePDF.jsx
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ReportePDF({ selector = "#reporte" }) {
  const generarPDF = async () => {
    try {
      // 1) Capturar la sección del DOM
      const elemento = document.querySelector(selector);
      if (!elemento) {
        console.error("No se encontró el elemento a capturar:", selector);
        return;
      }

      // 2) Convertirlo a canvas con html2canvas
      const canvas = await html2canvas(elemento, {
        scale: 2, // Aumenta la calidad
      });
      const imgData = canvas.toDataURL("image/png");

      // 3) Crear el PDF con jsPDF
      const pdf = new jsPDF({
        orientation: "p", // portrait
        unit: "px",
        format: "a4",
      });

      // 4) Calcular ancho/alto para la imagen en el PDF
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Ajustar la imagen al ancho de la página
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // 5) Descargar el PDF
      pdf.save("reporte.pdf");
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };

  return (
    <button
      onClick={generarPDF}
      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
    >
      Generar PDF
    </button>
  );
}

export default ReportePDF;
