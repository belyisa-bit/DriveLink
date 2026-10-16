import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CtaBanner } from '../components/CtaBanner';
import { Hero } from '../features/home/Hero';
import { QuickSearch } from '../features/home/QuickSearch';
import { FeaturedVehicles } from '../features/home/FeaturedVehicles';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#destaques') document.getElementById('destaques')?.scrollIntoView?.({ block: 'start' });
    else if (!location.hash) window.scrollTo({ top: 0, left: 0 });
  }, [location.hash, location.key]);

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <QuickSearch />
        <FeaturedVehicles />
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-8 sm:px-8 lg:px-10">
        <CtaBanner />
      </div>
    </>
  );
}
