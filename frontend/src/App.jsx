import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
              <h1 className="text-4xl font-bold text-slate-900">
                Drive<span className="text-brand">link</span>
              </h1>
              <p className="text-lg text-slate-600 mt-2">Mais que carros, novos caminhos.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
