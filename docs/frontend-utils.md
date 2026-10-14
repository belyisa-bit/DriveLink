# Formatação e máscaras

```js
import { formatBRL, formatKm } from '../lib/formatters';
import { maskPhone, unmaskPhone } from '../lib/masks';

formatBRL(142900); // R$ 142.900,00
formatKm(38000); // 38.000 km
maskPhone('11987654321'); // (11) 98765-4321
unmaskPhone('(11) 98765-4321'); // 11987654321
```

`formatBRL` e `formatKm` usam `Intl.NumberFormat` em português do Brasil. Aceitam números ou strings numéricas da API, com ponto decimal e sem separadores de milhares. Valores ausentes, inválidos ou negativos retornam `—`; zero é preservado. Quilometragem é arredondada para inteiro.

`maskPhone` aceita digitação parcial e telefones colados com máscara. Suporta telefone fixo de 10 dígitos e celular de 11, sempre com DDD. Não inclui código do país. `unmaskPhone` remove a pontuação; ambos limitam a entrada a 11 dígitos. A máscara não valida se o número existe.

Em um campo controlado, use `type="tel"`, `inputMode="numeric"`, `autoComplete="tel-national"` e aplique `maskPhone(event.target.value)` no `onChange`. A feature do formulário decide o formato enviado à API.
