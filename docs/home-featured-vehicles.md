# Veículos em destaque

A Home consulta `GET /vehicles/featured` por Axios e TanStack Query. O contrato utilizado é o `VehicleSummaryDTO` atual do backend. São exibidos até três veículos com `featured: true` e `status: DISPONIVEL`.

Os cards reutilizam os formatadores BRL/km e apontam para `/estoque/:slug`. A página de detalhe ainda tem conteúdo provisório. A seção possui estados de carregamento, erro com nova tentativa, lista vazia e imagem indisponível.

Para conferir sem API, configure `VITE_USE_MOCK_FEATURED=true` em `frontend/.env.development.local` e reinicie o Vite. Os exemplos são Corolla, Compass e Onix; preços, quilometragens e imagens não representam um estoque real. Essa opção é restrita ao desenvolvimento. Em produção, a seção sempre consulta a API.

A integração real continua pendente da disponibilização da API e do alinhamento das rotas públicas com a equipe do backend. Nenhum arquivo do backend foi alterado.

## Imagens ilustrativas

As imagens de Corolla e Onix foram criadas com a ferramenta integrada ImageGen e otimizadas para `frontend/src/assets/toyota-corolla-demo.webp` e `frontend/src/assets/chevrolet-onix-demo.webp`. O Compass reutiliza o recorte da imagem fornecida pelo autor em `frontend/src/assets/jeep-compass-hero.webp`.

Os cards usam imagens de 900 × 600 pixels e o Hero usa 1400 × 788 pixels. A conversão com Sharp usa qualidade 85 e preserva o canal de transparência do Compass. As três imagens somam aproximadamente 207 KB, contra 5,5 MB dos PNGs originais.

Prompt do Corolla:

> Photorealistic vehicle inventory illustration for a fictional Brazilian used-car dealership website, a white 2022 Toyota Corolla sedan, full vehicle front three-quarter view pointing left, parked on warm light gray studio floor, soft neutral studio backdrop, realistic clean condition, soft contact shadow, car occupies 85% width, wide 3:2 composition, entire car visible, no people, no promotional text, no watermark. This is an illustrative demo vehicle image.

Prompt do Onix:

> Photorealistic vehicle inventory illustration for a fictional Brazilian used-car dealership website: silver 2023 Chevrolet Onix hatchback, full car front three-quarter view pointing left, clean original bodywork, neutral light warm gray studio backdrop and floor, soft studio lighting and contact shadow, wide 3:2 composition, entire car visible occupying 85% width, recognizable Brazilian second-generation Onix design, no people, no advertising text, no watermark. Illustrative demo vehicle photo.
