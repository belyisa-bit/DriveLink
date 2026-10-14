import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navigationLinks } from '../lib/navigation';
import { Logo } from './Logo';

const footerLinks = navigationLinks.filter(({ to }) =>
  ['/estoque', '/sobre', '/contato'].includes(to),
);

const networks = [
  { key: 'instagram', label: 'Instagram', Icon: Instagram, url: 'https://www.instagram.com/' },
  { key: 'facebook', label: 'Facebook', Icon: Facebook, url: 'https://www.facebook.com/' },
  { key: 'youtube', label: 'YouTube', Icon: Youtube, url: 'https://www.youtube.com/' },
];

export function Footer({ socialLinks = {} }) {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-5 pb-5 pt-8 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center gap-6 pb-5 lg:flex-row lg:justify-between lg:gap-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Logo />
            <p className="text-center text-sm leading-5 text-slate-800 sm:border-l sm:border-slate-300 sm:pl-6 sm:text-left">
              Novos caminhos<br />sempre com você.
            </p>
          </div>

          <nav aria-label="Menu do rodapé" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="rounded py-2 text-sm text-slate-800 transition-colors hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                {label}
              </Link>
            ))}
          </nav>

          <div aria-label="Redes sociais" className="flex items-center gap-2">
            {networks.map(({ key, label, Icon, url }) => (
              <a key={key} href={socialLinks[key] || url} target="_blank" rel="noopener noreferrer" aria-label={`${label} (abre em nova aba)`} className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-950 transition-colors hover:bg-brand-light hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                <Icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 text-center text-xs leading-5 text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 Drivelink — Projeto fictício para fins educacionais.</p>
          <p>Seu próximo carro está mais perto.</p>
        </div>
      </div>
    </footer>
  );
}
