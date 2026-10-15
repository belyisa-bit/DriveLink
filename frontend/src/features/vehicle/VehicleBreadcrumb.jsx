import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VehicleBreadcrumb({ vehicle }) {
  const brandSearch = new URLSearchParams({ brand: vehicle.brand });
  const modelSearch = new URLSearchParams({
    brand: vehicle.brand,
    model: vehicle.model,
  });

  return (
    <nav aria-label="Navegação estrutural" className="mb-7">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link
            to="/"
            className="rounded hover:text-brand focus-visible:outline-brand"
          >
            Início
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={15} />
        </li>
        <li>
          <Link
            to="/estoque"
            className="rounded hover:text-brand focus-visible:outline-brand"
          >
            Estoque
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={15} />
        </li>
        <li>
          <Link
            to={`/estoque?${brandSearch}`}
            className="rounded hover:text-brand focus-visible:outline-brand"
          >
            {vehicle.brand}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={15} />
        </li>
        <li>
          <Link
            to={`/estoque?${modelSearch}`}
            className="rounded hover:text-brand focus-visible:outline-brand"
          >
            {vehicle.model}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={15} />
        </li>
        <li aria-current="page" className="font-medium text-slate-800">
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </li>
      </ol>
    </nav>
  );
}
