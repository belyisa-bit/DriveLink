import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';

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
      <BrowserRouter>
        <Header />
        <main id="main-content">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
              <h1 className="text-4xl font-bold text-slate-900">
                Drive<span className="text-brand">link</span>
              </h1>
              <p className="text-lg text-slate-600 mt-2">Mais que carros, novos caminhos.</p>
            </div>
          } />
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
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
