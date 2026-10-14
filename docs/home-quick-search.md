# Busca rápida da Home

A busca redireciona para `/estoque` usando `brand`, `model`, `minPrice` e `maxPrice` na query string. A página de catálogo será responsável por consumir esses parâmetros.

## Demonstração local

Crie `frontend/.env.development.local` com:

```dotenv
VITE_USE_MOCK_FILTERS=true
```

Reinicie o Vite. Marca e Modelo usam dados locais de exemplo, sem chamar a API. O arquivo local é ignorado pelo Git. O build de produção sempre usa a API, mesmo se essa variável estiver ativa.

## Integração pendente

Para usar dados reais, remova a variável ou defina `false` e reinicie o Vite. Configure `VITE_API_URL` com o endereço confirmado pela equipe do backend.

O frontend espera `GET /vehicles/filters` com `brands` e obtém os modelos únicos de todas as páginas de `GET /vehicles?brand=...`. O endpoint atual de filtros não retorna modelos. A API real precisa estar disponível e permitir as requisições públicas e a origem do frontend. Essa integração ainda deve ser validada com a equipe; nenhum arquivo do backend foi alterado.
