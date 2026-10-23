import { useState } from 'react';
import { Camera, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { VehiclePhotoCredit } from '../../components/VehiclePhotoCredit';
import { resolveVehicleImageUrl } from '../../lib/axios';

export function VehicleGallery({ vehicle }) {
  const [activeUrl, setActiveUrl] = useState(null);
  const [failedUrls, setFailedUrls] = useState([]);
  const photos = [...(vehicle.images || [])].sort(
    (a, b) =>
      Number(b.isMain) - Number(a.isMain) ||
      (a.displayOrder || 0) - (b.displayOrder || 0),
  );
  const urls = [
    ...new Set(
      [vehicle.mainImageUrl, ...photos.map((photo) => photo.url)].filter(
        Boolean,
      ),
    ),
  ];
  const available = urls.filter((url) => !failedUrls.includes(url));
  const selected = available.includes(activeUrl) ? activeUrl : available[0];
  const index = available.indexOf(selected);
  const name = `${vehicle.brand} ${vehicle.model}`;
  const fail = (url) =>
    setFailedUrls((current) =>
      current.includes(url) ? current : [...current, url],
    );
  function step(direction) {
    if (available.length > 1)
      setActiveUrl(
        available[(index + direction + available.length) % available.length],
      );
  }

  return (
    <section
      aria-label={`Fotos de ${name}`}
      className="min-w-0"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-stone-100">
        {selected ? (
          <img
            src={resolveVehicleImageUrl(selected)}
            alt={`${name} — foto ${urls.indexOf(selected) + 1}`}
            width="900"
            height="600"
            decoding="async"
            onError={() => fail(selected)}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <Car size={48} aria-hidden="true" />
            <span>Imagem indisponível</span>
          </div>
        )}
        {available.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => step(-1)}
              className="absolute left-3 rounded-full border border-slate-200 bg-white/95 p-2 shadow-sm hover:bg-white focus-visible:outline-brand"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => step(1)}
              className="absolute right-3 rounded-full border border-slate-200 bg-white/95 p-2 shadow-sm hover:bg-white focus-visible:outline-brand"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
        {selected && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs text-slate-700">
            <Camera size={14} aria-hidden="true" />
            {index + 1} / {available.length}
          </span>
        )}
      </div>
      {selected && (
        <VehiclePhotoCredit
          credit={
            photos.find((photo) => photo.url === selected)?.credit ||
            (selected === vehicle.mainImageUrl ? vehicle.imageCredit : null)
          }
        />
      )}
      {available.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {available.map((url) => (
            <button
              key={url}
              type="button"
              aria-label={`Ver foto ${urls.indexOf(url) + 1} de ${name}`}
              aria-pressed={url === selected}
              onClick={() => setActiveUrl(url)}
              className={`w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-stone-100 p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${url === selected ? 'border-brand' : 'border-slate-200'}`}
            >
              <img
                src={resolveVehicleImageUrl(url)}
                alt=""
                width="150"
                height="100"
                loading="lazy"
                onError={() => fail(url)}
                className="aspect-[3/2] w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
