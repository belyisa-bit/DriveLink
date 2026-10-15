# Catálogo — busca, filtros e ordenação (DRIV-69 a DRIV-71)

`/estoque` possui Hero, busca por texto, sidebar de filtros e cards agrupados por marca e modelo. A busca só é enviada ao confirmar o formulário; espaços nas extremidades são removidos. A apresentação compacta dos destaques da Home é preservada.

O parâmetro `search` é enviado para `GET /vehicles`, conforme o controller existente. Os filtros `brand`, `model`, `minPrice` e `maxPrice` recebidos da Home são preservados. O Ano é enviado como `minYear` e `maxYear` iguais. Uma nova busca ou aplicação de filtros remove `page` da URL.

A sidebar usa `GET /vehicles/filters` para marcas e limites de preço. Modelos e anos vêm de todas as páginas da listagem da marca/modelo; em estoque dinâmico, somente os anos com veículos `DISPONIVEL` aparecem, em ordem decrescente. Não são gerados intervalos de anos. As faixas de preço são compartilhadas com a Home e limitadas ao intervalo informado pela API.

No modo local, `catalogSuggestions.js` contém os anos fornecidos para o estoque fictício, restritos aos modelos que também constam na Home. São 12 marcas e 44 modelos na interseção das listas. Onix Plus e S10 continuam na Home, mas não aparecem no catálogo de sugestões porque não foram fornecidos anos para eles. Modelos como Tera, Basalt e Kardian não foram adicionados, pois não constam na Home.

`mockCatalogVehicles.js` gera um anúncio para cada combinação cadastrada de marca/modelo/ano: 362 anúncios, de 2012 a 2025. Preços, quilometragens e datas são determinísticos e fictícios. Cada modelo possui uma base de preço para seu ano mais recente; anos anteriores recebem valores menores. Todas as faixas de preço possuem resultados. Isso não é uma tabela de avaliação ou cotação de mercado.

Os três destaques da Home permanecem inalterados, incluindo seus preços e quilometragens. Todos os 44 modelos possuem imagens locais em WebP. As 41 novas ilustrações foram geradas com ImageGen e otimizadas, somando aproximadamente 1,6 MB. Os prompts e arquivos estão em `docs/catalog-images.md`. A imagem representa o modelo e é reutilizada entre anos e cores; não é uma foto de cada unidade exata.

Os 362 veículos aparecem em 44 cards, sem repetir o modelo para cada ano. Cada card informa os anos, o número de opções e o menor preço das unidades que correspondem aos filtros. “Ver detalhes” navega para `/estoque/:slug`, seguindo o padrão da Home. O slug pertence à unidade de menor preço entre os resultados do modelo, correspondente ao valor “A partir de”. A rota de detalhes permanece com a mensagem de página em desenvolvimento; sua implementação pertence ao DRIV-74. As cores locais são dados fictícios determinísticos.

Os grupos são construídos após os filtros. As ordens de preço usam o menor preço de cada grupo, a ordem de quilometragem usa a menor quilometragem e “Mais recentes” usa a data de cadastro mais recente do modelo. Para reunir todas as opções de um modelo na API atual, a consulta agrega as páginas retornadas por `/vehicles`. Para estoques maiores, será necessário um contrato de paginação por modelo com a equipe do backend.

Alterações nos campos só são aplicadas com “Aplicar filtros”. Marca, Modelo e Ano mantêm a opção “Todos”. Trocar a marca limpa modelo e ano; trocar o modelo limpa o ano. Ano fica desabilitado até a seleção de um modelo. “Limpar filtros” preserva o termo de busca. Faixas de preço recebidas da URL que não correspondem às opções predefinidas são preservadas. Um ano fora das opções disponíveis ou sem modelo selecionado não é reaplicado.

Para conferir sem API, defina `VITE_USE_MOCK_CATALOG=true` em `frontend/.env.development.local` e reinicie o Vite. A demonstração filtra a coleção completa por marca, modelo, texto, ano e preço.

Em produção sempre é usada a API. A integração real permanece pendente do alinhamento de rotas e acesso público com a equipe do backend. Nenhum arquivo do backend foi alterado.

O contador usa `totalElements` retornado pela consulta e reflete os filtros aplicados, com singular e plural. A ordenação usa o parâmetro `sortBy` do controller: `recent`, `price_asc`, `price_desc` e `mileage_asc`. Mudar a ordem preserva a busca e os filtros e remove a página da URL. A lista local também respeita essas ordens, usando datas de cadastro fictícias apenas no catálogo. O grid apresenta uma coluna no celular, duas em telas intermediárias e três no desktop.

## Sincronização com a URL (DRIV-72)

`catalogLocation.js` centraliza a leitura e a atualização da query string, e `useCatalogLocation.js` conecta esse estado ao React Router. Busca, marca, modelo, anos, preço e ordenação são restaurados ao abrir um link diretamente ou navegar com Voltar/Avançar. Os campos permanecem editáveis antes de aplicar os filtros. Alterar somente a ordem não descarta filtros ainda não aplicados; “Limpar filtros” também apaga esse rascunho.

Preços aceitam valores não negativos com até duas casas decimais; anos aceitam inteiros de quatro dígitos. Valores inválidos e intervalos invertidos são ignorados na consulta. Ordenação desconhecida usa “Mais recentes”. Atualizações preservam parâmetros externos, como `utm_source`, e não criam uma nova entrada de histórico quando a URL já representa o mesmo estado.

O hook também lê e atualiza `page` como índice iniciado em zero, preservando filtros e ordem. A página inicial é representada pela ausência do parâmetro; páginas inválidas voltam ao índice zero. Busca, aplicação/limpeza de filtros e ordenação reiniciam a página. O parâmetro de página da interface não é enviado à consulta que agrega todas as unidades por modelo.

Próxima etapa: paginação e refinamento dos estados de carregamento e vazio (DRIV-73).
