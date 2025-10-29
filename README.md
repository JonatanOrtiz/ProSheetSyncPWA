# ProSheetSync PWA

App mobile inteligente que funciona como BFF (Backend for Frontend). Recebe dados JSON do Firestore (vindos de planilhas do Google Sheets) e transforma em telas contextualizadas baseadas no tipo de serviço do profissional.

## Características

- **Renderização Contextual**: Diferentes UIs baseadas no tipo de serviço
  - Personal Trainer → Telas de treino com exercícios
  - Nutricionista → Telas de refeições com macros
  - Coach → Telas de metas e progresso
  - Fallback → Tabela genérica

- **Autenticação Segura**:
  - Login com Firebase Authentication
  - Troca de senha obrigatória no primeiro acesso
  - Senha temporária enviada por email

- **Temas**: Modo claro e escuro persistido

- **PWA**: Funciona offline e pode ser instalado no dispositivo

## Stack Técnico

- React 18 + TypeScript
- Firebase (Auth, Firestore, Functions)
- Material-UI (MUI)
- React Router
- Vite
- PWA com service worker

## Estrutura do Projeto

```
prosheetsync-pwa/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── renderers/       # Componentes de renderização contextual
│   │       ├── WorkoutRenderer.tsx
│   │       ├── MealPlanRenderer.tsx
│   │       ├── GoalTrackingRenderer.tsx
│   │       └── GenericTableRenderer.tsx
│   ├── contexts/            # Context API
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/               # Páginas/Telas
│   │   ├── LoginScreen.tsx
│   │   ├── ChangePasswordScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ServiceDetailScreen.tsx
│   ├── hooks/               # Custom hooks
│   │   └── useClientData.ts
│   ├── utils/               # Utilitários
│   │   └── parsers.ts       # Parsers de dados
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── config/              # Configurações
│   │   └── firebase.ts
│   ├── App.tsx
│   └── main.tsx
├── public/                  # Assets públicos
├── .env.example            # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Firebase

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 3. Configurar Firebase Functions

Suas Cloud Functions devem estar configuradas na região `southamerica-east1` e implementar:

#### `getClientData`
Retorna os dados do cliente autenticado:
```typescript
{
  clientEmail: string;
  clientName: string;
  totalSpreadsheets: number;
  professionals: Professional[];
  lastUpdated: string;
}
```

#### `refreshService` (opcional)
Atualiza os dados de um serviço específico:
```typescript
// Input: { serviceId: string }
// Output: Service
```

## Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Preview da build de produção

```bash
npm run preview
```

## Estrutura de Dados (Firestore)

### Service Type

Define qual componente renderizador será usado:

```typescript
type ServiceType = 'personal' | 'nutricao' | 'coach' | 'other';
```

### Mapeamento de Renderizadores

```typescript
const renderers = {
  'personal': WorkoutRenderer,    // Treinos
  'nutricao': MealPlanRenderer,   // Refeições
  'coach': GoalTrackingRenderer,  // Metas
  'other': GenericTableRenderer   // Tabela genérica
};
```

## Formatação das Planilhas

### Personal Trainer (Treino)

```
| Exercício      | Séries | Repetições | Descanso | Peso  | Observações |
|----------------|--------|------------|----------|-------|-------------|
| Supino         | 4      | 12         | 60s      | 40kg  | -           |
| Agachamento    | 3      | 15         | 90s      | 60kg  | -           |
```

### Nutricionista (Refeições)

```
| Refeição          | Alimento      | Quantidade  | Calorias | Proteína | Carboidrato | Gordura |
|-------------------|---------------|-------------|----------|----------|-------------|---------|
| Café da Manhã     | Ovos          | 3 unidades  | 210      | 18g      | 2g          | 15g     |
| Café da Manhã     | Pão Integral  | 2 fatias    | 140      | 6g       | 24g         | 2g      |
```

### Coach (Metas)

```
| Meta           | Descrição        | Valor Alvo | Valor Atual | Progresso (%) | Prazo      |
|----------------|------------------|------------|-------------|---------------|------------|
| Perder Peso    | Reduzir 10kg     | 70kg       | 75kg        | 50            | 30/12/2024 |
```

## Temas

O app suporta tema claro e escuro, persistido no localStorage.

### Cores

**Light Theme:**
- Primary: #5e72e4
- Secondary: #2dce89
- Background: #f5f7fa
- Surface: #ffffff

**Dark Theme:**
- Primary: #5e72e4
- Background: #0a0e27
- Surface: #151933

## Fluxo de Autenticação

1. **Login**: Usuário insere email e senha temporária
2. **Primeiro Login**: Sistema detecta e redireciona para troca de senha
3. **Troca de Senha**: Obrigatória antes de acessar o app
4. **Home**: Após trocar senha, acessa o app normalmente

## PWA

O app é configurado como PWA e pode ser instalado no dispositivo do usuário.

Para testar localmente:
1. Build o projeto: `npm run build`
2. Preview: `npm run preview`
3. Acesse via HTTPS ou localhost
4. Use DevTools > Application > Manifest para verificar

## Licença

Propriedade privada - Todos os direitos reservados

## Suporte

Para problemas ou dúvidas, entre em contato com o time de desenvolvimento.
