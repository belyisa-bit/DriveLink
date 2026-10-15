# Catálogo — busca e filtros (DRIV-69 e DRIV-70)

`/estoque` possui Hero, busca por texto, sidebar de filtros e listagem básica reutilizando `VehicleCard`. A busca só é enviada ao confirmar o formulário; espaços nas extremidades são removidos. No catálogo, os botões dos cards ocupam toda a largura; a apresentação compacta dos destaques da Home é preservada.

O parâmetro `search` é enviado para `GET /vehicles`, conforme o controller existente. Os filtros `brand`, `model`, `minPrice` e `maxPrice` recebidos da Home são preservados. O Ano é enviado como `minYear` e `maxYear` iguais. Uma nova busca ou aplicação de filtros remove `page` da URL.

A sidebar usa `GET /vehicles/filters` para marcas e limites de preço. Modelos e anos vêm de todas as páginas da listagem da marca/modelo; em estoque dinâmico, somente os anos com veículos `DISPONIVEL` aparecem, em ordem decrescente. Não são gerados intervalos de anos. As faixas de preço são compartilhadas com a Home e limitadas ao intervalo informado pela API.

No modo local, `catalogSuggestions.js` contém os anos fornecidos para o estoque fictício, restritos aos modelos que também constam na Home. São 12 marcas e 44 modelos na interseção das listas. Onix Plus e S10 continuam na Home, mas não aparecem no catálogo de sugestões porque não foram fornecidos anos para eles. Modelos como Tera, Basalt e Kardian não foram adicionados, pois não constam na Home. Essa configuração de filtros não cria anúncios: a listagem local continua com os três veículos de exemplo.

Alterações nos campos só são aplicadas com “Aplicar filtros”. Marca, Modelo e Ano mantêm a opção “Todos”. Trocar a marca limpa modelo e ano; trocar o modelo limpa o ano. Ano fica desabilitado até a seleção de um modelo. “Limpar filtros” preserva o termo de busca. Faixas de preço recebidas da URL que não correspondem às opções predefinidas são preservadas. Um ano fora das opções disponíveis ou sem modelo selecionado não é reaplicado.

Para conferir sem API, defina `VITE_USE_MOCK_CATALOG=true` em `frontend/.env.development.local` e reinicie o Vite. A demonstração reutiliza os três veículos da Home e filtra marca, modelo, texto e preço. A lista de marcas da busca rápida representa possibilidades de demonstração; não significa que todas tenham veículos cadastrados nesse estoque de exemplo.

Em produção sempre é usada a API. A integração real permanece pendente do alinhamento de rotas e acesso público com a equipe do backend. Nenhum arquivo do backend foi alterado.

Próximas etapas: ordenação e contador (DRIV-71), sincronização completa com a URL (DRIV-72), paginação e refinamento dos estados de carregamento e vazio (DRIV-73).
