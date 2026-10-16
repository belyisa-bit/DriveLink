import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function CatalogSearch({ search, onSearch }) {
  const [text, setText] = useState(search);
  useEffect(() => { setText(search); }, [search]);

  function handleChange(event) {
    const value = event.target.value;
    setText(value);
    if (!value.trim() && search) onSearch('');
  }

  return (
    <form aria-label="Buscar no estoque" onSubmit={(event) => { event.preventDefault(); onSearch(text.trim()); }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={21} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-600" />
          <Input type="search" name="search" aria-label="Marca, modelo ou palavra-chave" placeholder="Buscar por marca, modelo ou palavra-chave…" value={text} onChange={handleChange} className="pl-12" />
        </div>
        <Button type="submit" className="sm:px-9">Buscar veículos</Button>
      </div>
    </form>
  );
}
