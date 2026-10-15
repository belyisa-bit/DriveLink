# Catálogo — busca por texto (DRIV-69)

A rota `/estoque` possui Hero, busca por texto e listagem básica com `VehicleCard`. A consulta é enviada somente ao confirmar o formulário; espaços nas extremidades são removidos.

O parâmetro `search` é enviado para `GET /vehicles`, conforme o controller atual. Os filtros recebidos pela URL da Home são preservados. Uma nova busca remove `page` da URL.

Para conferir sem API, configure `VITE_USE_MOCK_CATALOG=true` em `frontend/.env.development.local` e reinicie o Vite. São usados os três veículos de exemplo da Home. Em produção sempre é usada a API.

A integração real está pendente do alinhamento de rotas e acesso público com a equipe do backend. Nenhum arquivo do backend foi alterado.

Próximas etapas: sidebar de filtros (DRIV-70), ordenação e contador (DRIV-71), sincronização completa com a URL (DRIV-72), paginação e refinamento dos estados (DRIV-73).
