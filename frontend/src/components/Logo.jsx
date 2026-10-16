import { Link } from 'react-router-dom';

export function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Drivelink — início" className={`inline-block shrink-0 rounded text-3xl font-extrabold tracking-[-0.06em] text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${className}`}>
      Dr<span className="relative">i<span aria-hidden="true" className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500" /></span>ve<span className="text-brand">link</span>
    </Link>
  );
}
