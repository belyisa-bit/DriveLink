import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ToastProvider } from './components/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {[
            ['/estoque', 'Estoque'],
            ['/destaques', 'Destaques'],
            ['/sobre', 'Sobre'],
            ['/contato', 'Contato'],
            ['/atendimento', 'Quero ser atendido'],
          ].map(([path, title]) => (
            <Route key={path} path={path} element={
              <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
                <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
                <p className="mt-3 text-slate-600">Página em desenvolvimento.</p>
              </div>
            } />
          ))}
          <Route path="*" element={<p className="p-10 text-center">Página não encontrada.</p>} />
        </Routes>
        </main>
        <Footer />
        </div>
      </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
