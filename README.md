<div align="center">

![STATUS](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-E53E1A?style=flat-square)
![BACKEND](https://img.shields.io/badge/BACKEND-SPRING%20BOOT-6DB33F?style=flat-square)
![DATABASE](https://img.shields.io/badge/DATABASE-POSTGRESQL-4169E1?style=flat-square)
![FRONTEND](https://img.shields.io/badge/FRONTEND-REACT%20%2B%20VITE-61DAFB?style=flat-square)

# 🚗 DriveLink

### Mais que carros, novos caminhos.

Plataforma de vitrine de veículos seminovos com busca, filtros e captação de pré-cadastros (*leads*) de pessoas interessadas.
<br>
Projeto acadêmico desenvolvido em equipe, com frontend em React, API REST em Spring Boot e banco PostgreSQL.

</div>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Arquitetura e fluxo](#arquitetura-e-fluxo)
- [Stack tecnológica](#stack-tecnológica)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Rotas do frontend](#rotas-do-frontend)
- [Endpoints do backend](#endpoints-do-backend)
- [Dados e persistência](#dados-e-persistência)
- [Segurança e LGPD](#segurança-e-lgpd)
- [Como executar localmente](#como-executar-localmente)
- [Como testar a API](#como-testar-a-api)
- [Testes automatizados](#testes-automatizados)
- [Fluxo de trabalho com Git](#fluxo-de-trabalho-com-git)
- [Deploy](#deploy)
- [Limitações e próximos passos](#limitações-e-próximos-passos)
- [Equipe](#equipe)
- [Uso de inteligência artificial](#uso-de-inteligência-artificial)
- [Licença](#licença)

---

## Sobre o projeto

O **DriveLink** é uma plataforma web para a vitrine de veículos seminovos. Quem visita o site consegue pesquisar o estoque, aplicar filtros, ver os detalhes de cada veículo e enviar um pré-cadastro para que a loja entre em contato. Do lado da loja, existe uma área administrativa protegida por login para gerenciar veículos e acompanhar os contatos recebidos.

O repositório é um **monorepo** com duas aplicações independentes:

- **`backend/`**: API REST em Java 21 + Spring Boot 3.2, com autenticação JWT, migrations Flyway e envio de e-mail.
- **`frontend/`**: aplicação React 18 + Vite, estilizada com Tailwind CSS, que consome a API.

> **Estado atual:** o desenvolvimento está concentrado na branch `develop`. A branch `main` ainda contém apenas o commit inicial e receberá o merge quando a entrega for consolidada.

---

## Objetivos

- Apresentar o estoque de veículos de forma clara, rápida e responsiva.
- Permitir busca por texto, filtros combinados, ordenação e paginação.
- Mostrar a página completa de cada veículo, com galeria, especificações e veículos similares.
- Captar leads por meio de formulários com **consentimento LGPD** explícito.
- Notificar a loja por e-mail a cada novo interessado.
- Oferecer uma API administrativa protegida por JWT para gestão de veículos e leads.
- Manter qualidade com testes automatizados no backend e no frontend.

---

## Funcionalidades

| Funcionalidade | Situação no projeto |
| --- | --- |
| Home com Hero, busca rápida e veículos em destaque | Implementada no frontend |
| Estoque com busca por texto, filtros, ordenação e contador | Implementado no frontend |
| Paginação, *skeleton* de carregamento e estado vazio | Implementados no frontend |
| Filtros e ordenação sincronizados com a query string da URL | Implementados no frontend |
| Agrupamento do estoque por marca/modelo, com variantes por ano e cor | Implementado no frontend |
| Detalhes do veículo: breadcrumb, galeria, resumo, especificações e itens | Implementados no frontend |
| Veículos similares | Implementados no frontend e no backend |
| Formulário "Tenho interesse neste veículo" (validação + LGPD) | Implementado no frontend e no backend |
| Formulário geral de atendimento (`/atendimento`) | Implementado no frontend e no backend |
| Páginas institucionais (Sobre e Contato) | Implementadas no frontend |
| Login administrativo e proteção de rotas (`/admin`) | Implementados no frontend e no backend |
| Painel administrativo com atalhos para Veículos e Leads | Parcial: telas de gestão ainda "em preparação" |
| API pública de veículos (lista, filtros, destaques, detalhe, similares) | Implementada no backend |
| API de leads com limite de requisições por IP | Implementada no backend |
| Notificação de novo lead por e-mail (assíncrona, HTML) | Implementada no backend |
| Autenticação JWT para administradores | Implementada no backend |
| API administrativa de veículos (CRUD, imagens, destaque e status) | Implementada no backend |
| API administrativa de leads (consulta, edição, status e exclusão) | Implementada no backend |
| Migrations Flyway e carga inicial (*seed*) de veículos | Implementadas no backend |
| Documentação interativa da API (Swagger UI) | Configurada no backend (springdoc) |
| Modo de dados locais (*mock*) no frontend para desenvolvimento | Implementado (via variáveis `VITE_USE_MOCK_*`) |
| Testes automatizados | Backend (JUnit/Mockito) e frontend (Vitest) |
| Gestão de veículos e leads pela interface administrativa | Ainda não concluída |
| Pipeline de CI/CD | Ainda não implementado |
| Publicação (deploy) | Ainda não realizada |

---

## Arquitetura e fluxo

O frontend e o backend são executados separadamente e se comunicam por HTTP/JSON.

```
Navegador (React + Vite)
        ↓  HTTP / JSON (axios + TanStack Query)
API REST (Spring Boot)
        ↓
PostgreSQL (migrations Flyway)
```

### Frontend

As páginas usam o **TanStack Query** para buscar e armazenar em cache os dados da API. Os formulários usam **React Hook Form + Zod** para validação. O token de administrador fica no `sessionStorage` e é anexado automaticamente às requisições por um interceptor do axios.

```
Páginas (pages/) → Features (features/*) → Serviços de API (*Api.js) → axios (lib/axios.js)
                          ↓
              Componentes reutilizáveis (components/)
```

### Backend

O backend é organizado **por domínio** (`vehicle`, `lead`, `auth`), e cada domínio segue a mesma divisão em camadas:

```
Requisição HTTP
       ↓
Controller
       ↓
Service
       ↓
Repository (Spring Data JPA)
       ↓
PostgreSQL
```

- **Domain:** entidades JPA e enums.
- **DTO:** objetos de entrada e saída, com Bean Validation.
- **Controller:** endpoints REST.
- **Service:** regras de negócio.
- **Repository:** acesso a dados (inclui `Specification` para filtros dinâmicos de veículos).

---

## Stack tecnológica

### Frontend

- React 18
- JavaScript (JSX)
- Vite 5
- React Router DOM 6
- Tailwind CSS 3
- TanStack Query 5
- React Hook Form + Zod
- Axios
- Lucide React (ícones)

### Backend

- Java 21
- Spring Boot 3.2.4
- Spring Web
- Spring Data JPA
- Spring Security + JWT (jjwt)
- Bean Validation
- Spring Mail
- Spring Boot Actuator
- Flyway (migrations)
- PostgreSQL
- Lombok e MapStruct
- springdoc-openapi (Swagger UI)
- Maven (com Maven Wrapper)

### Ferramentas de desenvolvimento e teste

- Git e GitHub (Git Flow, *Pull Requests*)
- JUnit 5, Mockito e Spring Security Test (backend)
- Vitest, Testing Library e jsdom (frontend)
- ESLint e Prettier (frontend)
- Gestão de tarefas por código (prefixos `DRIV-xx` e `KAN-xx` nos commits)

---

## Estrutura do repositório

```
DriveLink/
├── .github/workflows/
├── docs/
│   └── prototipo/
├── backend/
│   ├── .mvn/wrapper/
│   ├── mvnw / mvnw.cmd
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/br/com/drivelink/
│       │   │   ├── auth/            # login, JWT, usuário administrador
│       │   │   │   ├── domain/
│       │   │   │   ├── dto/
│       │   │   │   └── repository/
│       │   │   ├── common/exception/ # tratamento global de erros
│       │   │   ├── config/          # segurança, CORS, Swagger, async
│       │   │   ├── lead/            # leads, e-mail e rate limit
│       │   │   │   ├── controller/
│       │   │   │   ├── domain/ (+ enums)
│       │   │   │   ├── dto/
│       │   │   │   ├── ratelimit/
│       │   │   │   ├── repository/
│       │   │   │   └── service/
│       │   │   ├── vehicle/         # veículos
│       │   │   │   ├── controller/
│       │   │   │   ├── domain/ (+ enums)
│       │   │   │   ├── dto/
│       │   │   │   ├── repository/ (+ specification/)
│       │   │   │   └── service/
│       │   │   └── DrivelinkApplication.java
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       ├── db/migration/    # V1 a V4
│       │       └── templates/email/novo-lead.html
│       └── test/java/br/com/drivelink/
└── frontend/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── assets/vehicles/         # fotos dos veículos
        ├── components/              # Header, Footer, Button, Card, Toast...
        ├── features/
        │   ├── admin/               # login e rota protegida
        │   ├── catalog/             # filtros, grupos, paginação, ordenação
        │   ├── home/                # Hero, busca rápida, destaques
        │   └── vehicle/             # galeria, especificações, formulário, similares
        ├── lib/                     # axios, formatadores, máscaras, schemas
        ├── pages/
        ├── routes/AppRoutes.jsx
        ├── styles/index.css
        ├── tests/
        ├── App.jsx
        └── main.jsx
```

### Principais entidades do backend

- `Vehicle`: veículo à venda (marca, modelo, versão, ano, quilometragem, preço, combustível, câmbio, carroceria, status, destaque, etc.).
- `VehicleImage`: imagens do veículo, com ordem de exibição e imagem principal.
- `VehicleFeature`: itens e opcionais do veículo.
- `Lead`: pré-cadastro de interessado, com vínculo opcional a um veículo e registro do consentimento LGPD.
- `AdminUser`: usuário administrador, com senha armazenada como hash.

Enums: `FuelType`, `TransmissionType`, `BodyType`, `VehicleStatus` (`DISPONIVEL`, `RESERVADO`, `VENDIDO`), `LeadStatus` (`NOVO`, `EM_CONTATO`, `CONVERTIDO`, `DESCARTADO`), `LeadSource` (`FORMULARIO`, `DETALHE_VEICULO`) e `ContactPreference` (`WHATSAPP`, `TELEFONE`, `EMAIL`).

---

## Rotas do frontend

| Rota | Página | Descrição |
| --- | --- | --- |
| `/` | Home | Hero, busca rápida e veículos em destaque |
| `/estoque` | Estoque | Catálogo com filtros, ordenação e paginação |
| `/estoque/:slug` | Detalhes do veículo | Galeria, especificações, formulário de interesse e similares |
| `/destaques` | Redirecionamento | Leva para `/#destaques` |
| `/atendimento` | Atendimento | Formulário geral de pré-cadastro |
| `/sobre` | Sobre | Página institucional |
| `/contato` | Contato | Informações e canais de contato |
| `/admin/login` | Login administrativo | Autenticação do administrador |
| `/admin` | Painel administrativo | Protegida: exige token JWT |

A navegação usa `react-router-dom`. A rota `/admin` é protegida por `AdminRoute`, que redireciona para `/admin/login` quando não há token.

---

## Endpoints do backend

A API local utiliza a porta `8080`. A documentação interativa (Swagger UI) fica disponível em `http://localhost:8080/swagger-ui/index.html` enquanto o backend estiver em execução.

### Públicos

| Recurso | Método | Endpoint | Descrição |
| --- | --- | --- | --- |
| Veículos | GET | `/vehicles` | Lista veículos disponíveis (filtros, ordenação e paginação) |
| Veículos | GET | `/vehicles/featured` | Lista veículos em destaque |
| Veículos | GET | `/vehicles/filters` | Opções de filtro (marcas, combustíveis, faixas de preço e ano) |
| Veículos | GET | `/vehicles/{slug}` | Detalhes de um veículo |
| Veículos | GET | `/vehicles/{slug}/similar` | Até 4 veículos similares (mesma marca) |
| Leads | POST | `/leads` | Cadastra um interessado (limitado por IP) |
| Autenticação | POST | `/auth/login` | Login do administrador; retorna o token JWT |

**Parâmetros de `GET /vehicles`:** `search`, `brand`, `model`, `minPrice`, `maxPrice`, `minYear`, `maxYear`, `maxMileage`, `fuel`, `transmission`, `bodyType`, `sortBy`, `page` (padrão `0`) e `size` (padrão `12`).

**Valores de `sortBy`:** `recent` (padrão), `price_asc`, `price_desc`, `mileage_asc` e `year_desc`.

### Administrativos (exigem `Authorization: Bearer <token>` e perfil `ADMIN`)

| Recurso | Método | Endpoint | Descrição |
| --- | --- | --- | --- |
| Veículos | GET | `/admin/vehicles` | Lista todos os veículos |
| Veículos | GET | `/admin/vehicles/{id}` | Busca um veículo por ID |
| Veículos | POST | `/admin/vehicles` | Cadastra um veículo |
| Veículos | PUT | `/admin/vehicles/{id}` | Atualiza um veículo |
| Veículos | DELETE | `/admin/vehicles/{id}` | Remove um veículo |
| Veículos | POST | `/admin/vehicles/{id}/images` | Adiciona uma imagem |
| Veículos | PUT | `/admin/vehicles/{id}/images/order` | Reordena as imagens |
| Veículos | PATCH | `/admin/vehicles/{id}/images/{imageId}/main` | Define a imagem principal |
| Veículos | PATCH | `/admin/vehicles/{id}/featured` | Altera o destaque |
| Veículos | PATCH | `/admin/vehicles/{id}/status` | Altera o status |
| Leads | GET | `/admin/leads` | Lista os leads |
| Leads | GET | `/admin/leads/{id}` | Busca um lead por ID |
| Leads | PUT | `/admin/leads/{id}` | Atualiza um lead |
| Leads | PATCH | `/admin/leads/{id}/status` | Altera o status do lead |
| Leads | DELETE | `/admin/leads/{id}` | Remove um lead |

Os endpoints de cadastro e atualização recebem JSON no corpo da requisição. Erros de validação retornam `400` no formato `ProblemDetail`, com os campos inválidos em `invalidParams`.

### Exemplo: criar um lead

```http
POST /leads
Content-Type: application/json

{
  "name": "Maria Silva",
  "phone": "(87) 99999-0000",
  "email": "maria@email.com",
  "vehicleId": 1,
  "contactPreference": "WHATSAPP",
  "message": "Gostaria de agendar um test drive.",
  "lgpdConsent": true,
  "source": "DETALHE_VEICULO"
}
```

---

## Dados e persistência

- **Banco:** PostgreSQL (`drivelink`), acessado por Spring Data JPA com `ddl-auto: validate`; o esquema é criado exclusivamente pelas migrations.
- **Migrations (Flyway)**, em `backend/src/main/resources/db/migration/`:
  - `V1`: tabelas `vehicles`, `vehicle_images` e `vehicle_features`, com índices.
  - `V2`: tabela `leads`, com chave estrangeira opcional para o veículo.
  - `V3`: tabela `admin_users`.
  - `V4`: carga inicial com 6 veículos do protótipo (Jeep Compass, Toyota Corolla, BMW X1, Honda Civic, VW T-Cross e Hyundai Creta).
- **Slug:** gerado automaticamente a partir de marca, modelo, versão e ano; é usado na URL de detalhe (`/estoque/:slug`).
- **Administrador inicial:** criado na inicialização, a partir de variáveis de ambiente, caso ainda não exista (senha com no mínimo 12 caracteres).
- **Frontend:** o token de administrador fica no `sessionStorage` (`drivelink_admin_token`). As fotos do catálogo ficam em `frontend/src/assets/vehicles/`.
- **Modo local (mock):** durante o `npm run dev`, é possível usar dados locais para filtros, destaques e catálogo, ativando as variáveis `VITE_USE_MOCK_FILTERS`, `VITE_USE_MOCK_FEATURED` e `VITE_USE_MOCK_CATALOG`. Esse modo é ignorado no build de produção.

---

## Segurança e LGPD

- Autenticação **stateless** com JWT (HS256), expiração padrão de 60 minutos.
- Rotas `/admin/**` restritas ao perfil `ADMIN`; senhas armazenadas com hash.
- **CORS** liberado apenas para `http://localhost:5173` e `http://localhost:3000`.
- **Rate limit** em `POST /leads`: 5 requisições por minuto por IP (resposta `429`).
- O formulário só é enviado com o **consentimento LGPD** marcado; o backend também valida e registra a data e hora do consentimento (`lgpd_consent_at`).
- A notificação por e-mail escapa o conteúdo recebido (proteção contra HTML injection) e não registra dados pessoais nos logs em caso de falha.

---

## Como executar localmente

### Pré-requisitos

- Java 21
- Node.js 18+ e npm
- PostgreSQL 14+ em execução
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/belyisa-bit/DriveLink.git
cd DriveLink
git checkout develop
```

### 2. Criar o banco de dados

```sql
CREATE DATABASE drivelink;
```

### 3. Configurar e executar o backend

Defina as variáveis de ambiente antes de iniciar (o exemplo abaixo usa Linux/macOS; no Windows PowerShell use `$env:NOME="valor"`):

```bash
cd backend

export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/drivelink
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=sua_senha

# O segredo JWT deve estar em Base64 (mínimo de 256 bits)
export JWT_SECRET=$(openssl rand -base64 32)

# Administrador inicial (senha com no mínimo 12 caracteres)
export APP_ADMIN_EMAIL=admin@drivelink.com
export APP_ADMIN_PASSWORD=uma-senha-forte-123

# Opcional: notificação de leads por e-mail
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=seu_email@gmail.com
export MAIL_PASSWORD=sua_senha_de_app
export MAIL_TO=destinatario@email.com

./mvnw spring-boot:run
```

As migrations são aplicadas automaticamente na primeira execução. O backend sobe em `http://localhost:8080`.

### 4. Executar o frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O frontend fica disponível em `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Onde | Descrição |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | Backend | Conexão com o PostgreSQL |
| `JWT_SECRET` | Backend | Segredo de assinatura do JWT, em Base64 (obrigatório) |
| `APP_ADMIN_EMAIL` / `APP_ADMIN_PASSWORD` | Backend | Cria o administrador inicial |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` | Backend | Servidor SMTP |
| `MAIL_FROM` / `MAIL_TO` | Backend | Remetente e destinatário das notificações de lead |
| `VITE_API_URL` | Frontend | URL base da API |
| `VITE_USE_MOCK_FILTERS` / `_FEATURED` / `_CATALOG` | Frontend | Ativam dados locais em desenvolvimento |

> **Atenção:** o frontend usa por padrão `http://localhost:8080/api/v1` como URL base, mas os controllers do backend respondem na raiz (`/vehicles`, `/leads`, `/auth`, `/admin`). Veja [Limitações e próximos passos](#limitações-e-próximos-passos) antes de integrar as duas pontas.

### Comandos úteis

```bash
# Backend
./mvnw test                 # executa os testes
./mvnw clean package        # gera o .jar

# Frontend
npm run dev                 # servidor de desenvolvimento
npm run build               # build de produção
npm run preview             # pré-visualiza o build
npm run lint                # ESLint
npm test                    # Vitest
```

---

## Como testar a API

Com o backend em execução, use o **Swagger UI**, o **Postman** ou o `curl`.

**Listar veículos com filtros:**

```bash
curl "http://localhost:8080/vehicles?brand=Toyota&sortBy=price_asc&page=0&size=12"
```

**Buscar um veículo pelo slug:**

```bash
curl http://localhost:8080/vehicles/jeep-compass-2023
```

**Enviar um lead:**

```bash
curl -X POST http://localhost:8080/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria Silva","phone":"(87) 99999-0000","email":"maria@email.com","contactPreference":"EMAIL","lgpdConsent":true}'
```

**Fazer login e acessar uma rota administrativa:**

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@drivelink.com","password":"uma-senha-forte-123"}' | jq -r .token)

curl http://localhost:8080/admin/leads -H "Authorization: Bearer $TOKEN"
```

Também há o endpoint de saúde: `http://localhost:8080/actuator/health`.

---

## Testes automatizados

**Backend** (JUnit 5 + Mockito + Spring Security Test): testes de serviço e de controller para veículos, leads (público e administrativo) e autenticação.

```bash
cd backend && ./mvnw test
```

**Frontend** (Vitest + Testing Library): 31 arquivos de teste cobrindo componentes (Header, galeria, resumo, especificações, formulário de interesse, filtros do catálogo, similares, Toast), páginas (Estoque e Detalhes do veículo), rota administrativa, camadas de API, formatadores e máscaras.

```bash
cd frontend && npm test
```

---

## Fluxo de trabalho com Git

O projeto segue **Git Flow** com *Pull Requests*:

- `main`: versão estável (ainda sem o merge das entregas).
- `develop`: branch de integração, onde o desenvolvimento está concentrado.
- `feature/*`, `fix/*`: branches de trabalho, integradas à `develop` por Pull Request.

Os commits seguem a convenção **Conventional Commits** (`feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `perf`, `style`), com a referência da tarefa quando existe (por exemplo, `DRIV-80`).

---

## Deploy

| Camada | Endereço | Situação |
| --- | --- | --- |
| Frontend | — | Ainda não publicado |
| Backend | — | Ainda não publicado |
| Banco de dados | — | PostgreSQL local (desenvolvimento) |

---

## Limitações e próximos passos

- A **área administrativa do frontend** tem apenas login e painel com atalhos; as telas de gestão de veículos e de leads (`/admin/veiculos` e `/admin/leads`) ainda não foram construídas, embora a API correspondente já esteja pronta.
- O **prefixo da API** precisa ser alinhado: o frontend chama `/api/v1/...` por padrão, enquanto os controllers do backend respondem sem esse prefixo. É necessário padronizar um dos lados (por exemplo, `server.servlet.context-path` ou `@RequestMapping("/api/v1")`) ou ajustar `VITE_API_URL`.
- O **administrador inicial** é lido de `app.admin.*`, mas o `application.yml` declara as chaves como `admin.*`; por isso a configuração recomendada usa `APP_ADMIN_EMAIL` e `APP_ADMIN_PASSWORD`.
- O `JWT_SECRET` precisa estar em **Base64**; o valor de exemplo do `.env.example` não está nesse formato e deve ser substituído.
- As **credenciais do banco** não devem ficar fixas nos arquivos `application*.yml`; migrar para variáveis de ambiente e trocar as senhas já expostas no histórico.
- A lista de origens do **CORS** está fixa em `localhost`; será preciso configurá-la para o domínio publicado.
- As imagens do seed (`V4`) apontam para URLs externas e só 2 dos 6 veículos têm fotos; o frontend usa as imagens locais de `assets/vehicles/`. O ideal é unificar essa origem (por exemplo, armazenamento de imagens).
- O **rate limit** é em memória e por IP, então não é compartilhado entre instâncias.
- Falta configurar **CI/CD** (o diretório `.github/workflows` está vazio) e o **deploy**.
- A pasta `docs/prototipo` ainda não contém o protótipo; a documentação de API pode ser complementada pelo Swagger.
- O arquivo `backend/erro-backend.txt` (log de execução) e os `.env.example` devem ser revisados antes do merge para a `main`.

---

## Equipe

| Integrante | Matrícula | Principais contribuições |
| --- | --- | --- |
| Isabelle Victória | 01808806 | Estrutura do monorepo e configuração inicial, modelo de domínio, migrations e API pública de veículos, revisão e integração dos Pull Requests |
| Gabriela Sabino | 01660021 | Autenticação JWT, API de leads, notificação por e-mail, gestão administrativa de veículos e leads, testes do backend |
| Geovanna Almeida | 01815451 | Layout e componentes base, Home, catálogo (busca, filtros, paginação), página de detalhes do veículo e testes do frontend |
| Gabrielly Carneiro | 01797929 | Formulário de pré-cadastro, páginas institucionais, autenticação administrativa, painel e proteção de rotas |
| Josinaldo Xavier | 01823400  | Testes do formulário de leads |

---

## Uso de inteligência artificial

Ferramentas de inteligência artificial podem ter sido utilizadas como apoio ao planejamento, à revisão de código e à documentação. Informe aqui, conforme o uso real da equipe:

- **Ferramenta:** finalidade do uso.
ChatGPT — apoio no planejamento, divisão de tarefas e revisão de lógica.
Google Gemini Pro — apoio na modelagem de dados e revisão de trechos de código.
Claude (Anthropic) — apoio na organização do backlog, criação de dados fictícios, exemplos de endpoints e documentação.


---

## Licença

Este projeto está sob a licença [MIT](LICENSE).

<div align="center">

Projeto acadêmico • DriveLink

</div>
