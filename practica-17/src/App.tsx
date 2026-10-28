import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Encabezado } from "./components/Encabezado";
import { RutaProtegida } from "./components/RutaProtegida";
import { SesionProvider } from "./context/SesionContext";
import { Entrar } from "./pages/Entrar";
import { Inicio } from "./pages/Inicio";
import { MisInscripciones } from "./pages/MisInscripciones";
import { Registro } from "./pages/Registro";

export default function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <div className="app-shell">
          <Encabezado />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/registro" element={<Registro />} />
            <Route element={<RutaProtegida />}>
              <Route path="/mis-inscripciones" element={<MisInscripciones />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SesionProvider>
    </BrowserRouter>
  );
}
