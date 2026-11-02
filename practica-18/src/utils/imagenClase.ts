export function imagenParaClase(nombre: string): string {
  const normalizado = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalizado.includes("yoga") || normalizado.includes("pilates")) {
    return "/images/yoga.svg";
  }

  if (
    normalizado.includes("spinning") ||
    normalizado.includes("ciclo") ||
    normalizado.includes("cardio")
  ) {
    return "/images/spinning.svg";
  }

  return "/images/funcional.svg";
}
