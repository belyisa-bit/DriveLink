import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { Logo } from './Logo';
import { navigationLinks } from '../lib/navigation';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <header className="bg-white" onKeyDown={handleKeyDown}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
        <Logo className="sm:text-4xl" />

        <button ref={toggleRef} type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-950 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand lg:hidden">
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav id="main-navigation" aria-label="Menu principal" className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col gap-6 border-t border-slate-100 pt-5 lg:flex lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-12 lg:border-0 lg:pt-0`}>
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-7">
            {navigationLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `w-fit border-b-2 py-2 text-sm font-medium text-slate-950 transition-colors hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${isActive ? 'border-brand' : 'border-transparent'}`}>
                {label}
              </NavLink>
            ))}
          </div>
          <Button to="/atendimento" onClick={() => setMenuOpen(false)}>
            Quero atendimento <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
