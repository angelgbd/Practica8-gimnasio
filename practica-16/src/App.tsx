import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Encabezado } from "./components/Encabezado";
import { SesionProvider } from "./context/SesionContext";
import { Entrar } from "./pages/Entrar";
import { Inicio } from "./pages/Inicio";
import { Registro } from "./pages/Registro";

export default function App() {
  return (
    <SesionProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Encabezado />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SesionProvider>
  );
}
