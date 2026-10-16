// Ofertas brasileiras com combustível comum às versões da faixa cadastrada.
// Modelos com opções diferentes dependem da identificação da unidade.
const ranges = [
  {
    brand: 'Citroën',
    model: 'C3',
    minYear: 2016,
    maxYear: 2020,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/novo-c3-puretech-flex-o-compacto-economicamente-correto',
  },
  {
    brand: 'Citroën',
    model: 'C3',
    minYear: 2023,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/versatil-e-unico-novo-citroen-c3-chega-ao-brasil-partindo-de-r-68-990',
  },
  {
    brand: 'Citroën',
    model: 'C4 Cactus',
    minYear: 2019,
    maxYear: 2024,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/novo-suv-citroen-c4-cactus-a-proxima-geracao-suv',
  },
  {
    brand: 'Citroën',
    model: 'Aircross',
    minYear: 2017,
    maxYear: 2020,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/citroen-c3-e-aircross-com-cambio-automatico-de-6-marchas-muito-mais-conforto-no-seu-dia-a-dia',
  },
  {
    brand: 'Citroën',
    model: 'Aircross',
    minYear: 2024,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/citroen/press/novo-suv-citroen-aircross-e-o-modelo-para-ate-sete-pessoas-mais-acessivel-do-brasil',
  },
  {
    brand: 'Fiat',
    model: 'Argo',
    minYear: 2018,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/fiat/press/fiat-argo-um-hatch-premium-em-todos-os-sentidos',
  },
  {
    brand: 'Fiat',
    model: 'Mobi',
    minYear: 2017,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/fiat/press/fiat-mobi-solucao-inteligente-para-o-dia-a-dia',
  },
  {
    brand: 'Fiat',
    model: 'Strada',
    minYear: 2022,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/fiat/press/fiat-strada-ganha-mais-performance-com-motor-turbo-flex-novo-design-versao-ultra-e-edicao-limitada-em-sua-linha-2024',
  },
  {
    brand: 'Ford',
    model: 'Ka',
    minYear: 2015,
    maxYear: 2021,
    fuel: 'FLEX',
    source:
      'https://media.ford.com/content/dam/fordmedia/South%20America/Brazil/2014/KA2015/NovoKa%201.5_Ficha%20Tecnica.pdf',
  },
  {
    brand: 'Ford',
    model: 'EcoSport',
    minYear: 2018,
    maxYear: 2021,
    fuel: 'FLEX',
    source:
      'https://media.ford.com/content/fordmedia/fsa/br/pt/news/2017/07/24/ford-ecosport-2018-tem-design-aprimorado-e-interior-confortavel-.html',
  },
  {
    brand: 'Honda',
    model: 'City',
    minYear: 2022,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://saladeimprensa.honda.com.br/releases/honda-apresenta-novas-versoes-da-familia-new-city',
  },
  {
    brand: 'Honda',
    model: 'HR-V',
    minYear: 2019,
    maxYear: 2019,
    fuel: 'FLEX',
    source:
      'https://www.honda.com.br/automoveis/sites/hab/files/2019-04/%5BHONDA%5DCAMPANHA%20HRV2019_Folheto%20Simples_863x306mm_R17.pdf',
  },
  {
    brand: 'Honda',
    model: 'HR-V',
    minYear: 2023,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://saladeimprensa.honda.com.br/releases/honda-new-hr-v-e-eleito-o-carro-do-ano-2023',
  },
  {
    brand: 'Jeep',
    model: 'Renegade',
    minYear: 2022,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.media.stellantis.com/br-pt/jeep/press/novo-jeep-renegade-reune-mais-capacidade-off-road-mais-tecnologia-e-performance-com-novo-motor-t270',
  },
  {
    brand: 'Nissan',
    model: 'Sentra',
    minYear: 2023,
    maxYear: 2025,
    fuel: 'GASOLINA',
    source:
      'https://brazil.nissannews.com/pt-BR/releases/novo-nissan-sentra-do-seu-jeito-em-cada-detalhe',
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    minYear: 2020,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.toyotacomunica.com.br/toyota-apresenta-o-novo-corolla-2020/',
  },
  {
    brand: 'Toyota',
    model: 'Corolla Cross',
    minYear: 2021,
    maxYear: 2025,
    fuel: 'FLEX',
    source:
      'https://www.toyotacomunica.com.br/toyota-do-brasil-lanca-novo-corolla-cross/',
  },
  {
    brand: 'Toyota',
    model: 'Yaris',
    minYear: 2018,
    maxYear: 2024,
    fuel: 'FLEX',
    source:
      'https://www.toyotacomunica.com.br/toyota-apresenta-o-novo-yaris-ao-mercado-brasileiro/',
  },
];

export function getCatalogFuel(brand, model, year) {
  if (!Number.isInteger(year)) return null;
  return (
    ranges.find(
      (item) =>
        item.brand === brand &&
        item.model === model &&
        year >= item.minYear &&
        year <= item.maxYear,
    )?.fuel ?? null
  );
}
