# Estratégia de Branches e Commits (Git Flow)

## Branches Principais

- `main`: Código em produção, estável e versionado com tags (ex: v1.0.0).
- `develop`: Branch de integração contínua para novas funcionalidades.

## Branches Apoio

- `feature/*`: Desenvolvidas a partir da `develop` e mescladas de volta na `develop` via PR.
- `release/*`: Preparação para nova versão em produção.
- `hotfix/*`: Correções urgentes aplicadas diretamente da `main`.

## Convenção de Commits (Conventional Commits)

Estrutura: `<tipo>(<escopo opcional>): <descrição>`

- `feat`: Nova funcionalidade.
- `fix`: Correção de bug.
- `chore`: Tarefas de manutenção ou configuração.
- `docs`: Alterações na documentação.
- `test`: Adição ou ajuste de testes.
- `refactor`: Refatoração de código sem alterar regra de negócio.
- `ci`/`build`: Ajustes em scripts de integração/build.

### Escopos Sugeridos:
`backend`, `frontend`, `infra`, `docs`.
