# Componentes compartilhados

Os componentes ficam em `frontend/src/components/` e usam os tokens do Tailwind do projeto.

- `Button`: variantes `primary`, `outline` e `inverse`; `to` transforma o botão em link interno. Aceita `disabled`, `type` e `ref`.
- `Input`: aceita atributos nativos, `ref`, `label`, `hint`, `error` e `wrapperClassName`. `className` estiliza o campo. Os IDs são gerados automaticamente ou definidos por `id`.
- `Select`: mesma interface do Input; recebe elementos `option` como filhos. As opções são fornecidas pela feature que consome a API.
- `Card`: contêiner branco; `as` define o elemento HTML (por exemplo, `article`).
- `Badge`: variantes `neutral`, `brand`, `success` e `warning`.
- `Skeleton`: elemento decorativo; `className` define dimensões. A seção que carrega deve informar o estado com `aria-busy` e texto acessível. A animação respeita a preferência por movimento reduzido.
- `Toast`: o `ToastProvider` está integrado no App. Use `useToast` de `src/lib/toast` para exibir ou fechar notificações.

```jsx
<Input label="Nome completo" autoComplete="name" required {...register('name')} error={errors.name?.message} />

<Select label="Marca" value={brand} onChange={(event) => setBrand(event.target.value)}>
  <option value="">Todas</option>
  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
</Select>

<Card as="article"><Badge variant="success">Revisado</Badge></Card>

const { notify, dismiss } = useToast();
const notificationId = notify('Pré-cadastro enviado.', { variant: 'success' });
// Variantes: success, error e info. O prazo padrão é 5000 ms.
// duration: 0 mantém a notificação até fechar manualmente.
dismiss(notificationId);
```
