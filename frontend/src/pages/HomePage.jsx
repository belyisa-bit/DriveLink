import { CtaBanner } from '../components/CtaBanner';
import { Hero } from '../features/home/Hero';
import { QuickSearch } from '../features/home/QuickSearch';
import { FeaturedVehicles } from '../features/home/FeaturedVehicles';

export function HomePage() {
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
