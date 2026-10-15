export function VehiclePhotoCredit({ credit }) {
  if (!credit?.sourceUrl) return null;

  return (
    <details className="mt-2 text-[10px] leading-relaxed text-slate-500">
      <summary className="w-fit cursor-pointer rounded focus-visible:outline-brand">
        Créditos da foto
      </summary>
      <p className="mt-1">
        <a
          href={credit.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-brand"
        >
          {credit.author}
        </a>
        {credit.license && ' · '}
        {credit.licenseUrl ? (
          <a
            href={credit.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-brand"
          >
            {credit.license}
          </a>
        ) : (
          credit.license
        )}
      </p>
    </details>
  );
}
