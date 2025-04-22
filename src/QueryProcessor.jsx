// src/QueryProcessor.jsx
import nlp from "compromise";

export function processQuery(query) {
  // Analiza la consulta y extrae términos relevantes
  const doc = nlp(query);
  // Ejemplo: detectar palabras "capacidad", "últimos", "días", "comparar"
  const hasCapacity = doc.has("capacidad");
  const daysMatch = doc.match("#Value days");
  const days = daysMatch ? parseInt(daysMatch.out("text")) : null;

  // Retornar un objeto de acción según la consulta
  if (hasCapacity && days) {
    return {
      action: "updateCapacityGraph",
      days
    };
  }
  // Si no se identifica ninguna intención, retorna una acción por defecto
  return { action: "none" };
}
