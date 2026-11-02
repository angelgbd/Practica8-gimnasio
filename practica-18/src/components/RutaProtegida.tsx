import { Navigate, Outlet, useLocation } from "react-router";
import { useSesion } from "../context/SesionContext";

export function RutaProtegida() {
  const { usuario } = useSesion();
  const location = useLocation();

  if (usuario) return <Outlet />;

  return (
    <Navigate
      to="/entrar"
      replace
      state={{
        from: {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
      }}
    />
  );
}
