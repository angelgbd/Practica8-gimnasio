import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Encabezado } from "./components/Encabezado";
import { RutaProtegida } from "./components/RutaProtegida";
import { SesionProvider } from "./context/SesionContext";

const Entrar = lazy(() =>
  import("./pages/Entrar").then((modulo) => ({ default: modulo.Entrar })),
);
const Inicio = lazy(() =>
  import("./pages/Inicio").then((modulo) => ({ default: modulo.Inicio })),
);
const MisInscripciones = lazy(() =>
  import("./pages/MisInscripciones").then((modulo) => ({
    default: modulo.MisInscripciones,
  })),
);
const Registro = lazy(() =>
  import("./pages/Registro").then((modulo) => ({ default: modulo.Registro })),
);

export default function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <div className="app-shell">
          <Encabezado />
          <Suspense
            fallback={
              <main className="page-content route-loading" role="status">
                <span className="route-loading__mark" aria-hidden="true" />
                Cargando página…
              </main>
            }
          >
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/entrar" element={<Entrar />} />
              <Route path="/registro" element={<Registro />} />
              <Route element={<RutaProtegida />}>
                <Route path="/mis-inscripciones" element={<MisInscripciones />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </SesionProvider>
    </BrowserRouter>
  );
}
