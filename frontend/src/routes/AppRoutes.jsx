import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { StockPage } from '../pages/StockPage';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/estoque" element={<StockPage />} />
      <Route path="/estoque/:slug" element={<VehicleDetailsPage />} />
      <Route
        path="/destaques"
        element={<Navigate to="/#destaques" replace />}
      />
      <Route path="/sobre" element={<AboutPage />} />
<Route path="/contato" element={<ContactPage />} />
      {[
        ['/atendimento', 'Quero ser atendido'],
      ].map(([path, title]) => (
        <Route
          key={path}
          path={path}
          element={
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
              <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
              <p className="mt-3 text-slate-600">Página em desenvolvimento.</p>
            </div>
          }
        />
      ))}
      <Route
        path="*"
        element={<p className="p-10 text-center">Página não encontrada.</p>}
      />
    </Routes>
  );
}
