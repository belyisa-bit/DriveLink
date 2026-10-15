// Faixas brasileiras com câmbio comum às versões, sem escolher uma versão arbitrária.
const ranges = [
  {
    brand: 'Citroën',
    model: 'C4 Cactus',
    minYear: 2019,
    maxYear: 2024,
    transmission: 'AUTOMATICO',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/novo-suv-citroen-c4-cactus-a-proxima-geracao-suv',
  },
  {
    brand: 'Citroën',
    model: 'Aircross',
    minYear: 2024,
    maxYear: 2025,
    transmission: 'CVT',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/novo-suv-citroen-aircross-e-o-modelo-para-ate-sete-pessoas-mais-acessivel-do-brasil',
  },
  {
    brand: 'Fiat',
    model: 'Strada',
    minYear: 2018,
    maxYear: 2021,
    transmission: 'MANUAL',
    source:
      'https://www.media.stellantis.com/br-pt/fiat/press/fiat-inova-mais-uma-vez-com-a-nova-strada-com-cambio-automatico-01',
  },
  {
    brand: 'Fiat',
    model: 'Toro',
    minYear: 2022,
    maxYear: 2025,
    transmission: 'AUTOMATICO',
    source:
      'https://www.media.stellantis.com/br-pt/fiat/press/nova-fiat-toro-versoes-e-precos',
  },
  {
    brand: 'Honda',
    model: 'Civic',
    minYear: 2020,
    maxYear: 2021,
    transmission: 'CVT',
    source:
      'https://www.honda.com.br/automoveis/sites/hab/files/2019-10/%5BHONDA%5DCAMPANHA%20CIVIC%202020_FOLHETO%20COMPLETO_440x310mm_R21-WhatsApp.pdf',
  },
  {
    brand: 'Honda',
    model: 'City',
    minYear: 2022,
    maxYear: 2025,
    transmission: 'CVT',
    source:
      'https://saladeimprensa.honda.com.br/releases/honda-apresenta-novas-versoes-da-familia-new-city',
  },
  {
    brand: 'Honda',
    model: 'HR-V',
    minYear: 2019,
    maxYear: 2022,
    transmission: 'CVT',
    source:
      'https://www.honda.com.br/automoveis/sites/hab/files/2019-04/%5BHONDA%5DCAMPANHA%20HRV2019_Folheto%20Simples_863x306mm_R17.pdf',
  },
  {
    brand: 'Honda',
    model: 'HR-V',
    minYear: 2023,
    maxYear: 2025,
    transmission: 'CVT',
    source:
      'https://saladeimprensa.honda.com.br/releases/honda-apresenta-o-new-hr-v-ao-mercado-brasileiro',
  },
  {
    brand: 'Hyundai',
    model: 'Creta',
    minYear: 2022,
    maxYear: 2024,
    transmission: 'AUTOMATICO',
    source:
      'https://www.hyundai.com.br/content/dam/hmb/cars/creta/2022/catalogos/catalogo_digital_creta_2022.pdf',
  },
  {
    brand: 'Jeep',
    model: 'Compass',
    minYear: 2017,
    maxYear: 2021,
    transmission: 'AUTOMATICO',
    source:
      'https://www.media.stellantis.com/br-pt/jeep/press/jeep-compass-um-novo-norte-para-o-segmento-de-suvs',
  },
  {
    brand: 'Jeep',
    model: 'Compass',
    minYear: 2022,
    maxYear: 2025,
    transmission: 'AUTOMATICO',
    source:
      'https://www.media.stellantis.com/br-pt/jeep/press/conheca-o-novo-jeep-compass-mais-performance-design-sofisticacao-e-tecnologia',
  },
  {
    brand: 'Jeep',
    model: 'Commander',
    minYear: 2022,
    maxYear: 2025,
    transmission: 'AUTOMATICO',
    source:
      'https://www.media.stellantis.com/br-pt/jeep/press/jeep-apresenta-commander-o-mais-sofisticado-modelo-da-marca-ja-fabricado-no-brasil',
  },
  {
    brand: 'Jeep',
    model: 'Renegade',
    minYear: 2022,
    maxYear: 2025,
    transmission: 'AUTOMATICO',
    source:
      'https://www.media.stellantis.com/br-es/jeep/press/el-nuevo-jeep-renegade-llega-con-mas-capacidad-mas-tecnologia-y-mas-rendimiento-con-el-nuevo-motor-t270',
  },
  {
    brand: 'Nissan',
    model: 'Sentra',
    minYear: 2017,
    maxYear: 2020,
    transmission: 'CVT',
    source:
      'https://brazil.nissannews.com/pt-BR/releases/nissan-sentra-2017-chega-com-design-renovado-mais-equipamentos-de-s-rie-e-tecnologias-de-seguran-a-inovadoras-para-o-segmento?origin=channel-1444',
  },
  {
    brand: 'Nissan',
    model: 'Sentra',
    minYear: 2023,
    maxYear: 2025,
    transmission: 'CVT',
    source:
      'https://brazil.nissannews.com/pt-BR/releases/novo-nissan-sentra-do-seu-jeito-em-cada-detalhe',
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    minYear: 2020,
    maxYear: 2025,
    transmission: 'CVT',
    source:
      'https://www.toyotacomunica.com.br/toyota-apresenta-o-novo-corolla-2020/',
  },
  {
    brand: 'Toyota',
    model: 'Corolla Cross',
    minYear: 2021,
    maxYear: 2025,
    transmission: 'CVT',
    source:
      'https://www.toyotacomunica.com.br/toyota-do-brasil-lanca-novo-corolla-cross/',
  },
  {
    brand: 'Toyota',
    model: 'Yaris',
    minYear: 2023,
    maxYear: 2024,
    transmission: 'CVT',
    source:
      'https://www.toyotacomunica.com.br/toyota-apresenta-linha-yaris-2023/',
  },
  {
    brand: 'Volkswagen',
    model: 'T-Cross',
    minYear: 2025,
    maxYear: 2025,
    transmission: 'AUTOMATICO',
    source: 'https://www.vwnews.com.br/news/2244',
  },
];

export function getCatalogTransmission(brand, model, year) {
  if (!Number.isInteger(year)) return null;
  return (
    ranges.find(
      (item) =>
        item.brand === brand &&
        item.model === model &&
        year >= item.minYear &&
        year <= item.maxYear,
    )?.transmission ?? null
  );
}
