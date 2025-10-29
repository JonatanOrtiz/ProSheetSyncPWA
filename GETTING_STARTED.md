# Primeiros Passos - ProSheetSync PWA

## Início Rápido

### 1. Instalação (✅ Já concluída)

As dependências já foram instaladas. Se precisar reinstalar:

```bash
npm install
```

### 2. Configuração do Firebase (⚠️ OBRIGATÓRIO)

Antes de iniciar o app, você DEVE configurar o Firebase:

#### Passo a passo:

1. **Copie o arquivo de exemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env`** e adicione suas credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. **Obtenha as credenciais**:
   - Acesse https://console.firebase.google.com/
   - Selecione seu projeto
   - Clique em ⚙️ (configurações) > Configurações do projeto
   - Role até "Seus aplicativos"
   - Copie as configurações do Firebase

4. **Configure as Cloud Functions**:
   - Veja instruções detalhadas em `FIREBASE_SETUP.md`
   - As functions devem estar na região `southamerica-east1`
   - Implemente `getClientData` (obrigatória)
   - Implemente `refreshService` (opcional)

### 3. Executar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# O app estará disponível em: http://localhost:5173
```

### 4. Build para Produção

```bash
# Gerar build otimizada
npm run build

# Preview da build
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Layout.tsx        # Layout principal com navegação
│   ├── ProtectedRoute.tsx # Proteção de rotas
│   └── renderers/        # Componentes de renderização contextual
│       ├── WorkoutRenderer.tsx        # Treinos (Personal)
│       ├── MealPlanRenderer.tsx       # Refeições (Nutricionista)
│       ├── GoalTrackingRenderer.tsx   # Metas (Coach)
│       └── GenericTableRenderer.tsx   # Tabela genérica (fallback)
│
├── contexts/             # Context API
│   ├── AuthContext.tsx   # Autenticação
│   └── ThemeContext.tsx  # Tema claro/escuro
│
├── pages/                # Páginas/Telas
│   ├── LoginScreen.tsx              # Login
│   ├── ChangePasswordScreen.tsx     # Troca de senha obrigatória
│   ├── HomeScreen.tsx               # Lista de serviços
│   ├── ProfileScreen.tsx            # Perfil do usuário
│   └── ServiceDetailScreen.tsx      # Detalhes do serviço
│
├── hooks/                # Custom hooks
│   └── useClientData.ts  # Hook para buscar dados do cliente
│
├── utils/                # Utilitários
│   ├── parsers.ts        # Parsers de dados das planilhas
│   └── mockData.ts       # Dados de exemplo para desenvolvimento
│
├── types/                # TypeScript types
│   └── index.ts          # Todas as interfaces e types
│
├── config/               # Configurações
│   └── firebase.ts       # Configuração do Firebase
│
├── App.tsx               # Componente raiz com rotas
└── main.tsx              # Entry point
```

## Fluxo do Aplicativo

### 1. Autenticação

```
Login (email + senha temporária)
  ↓
Primeiro login detectado
  ↓
Troca de senha obrigatória
  ↓
Home (lista de serviços)
```

### 2. Navegação

```
HomeScreen (Tab 1)
  ├── Lista de profissionais
  ├── Cards de serviços agrupados
  └── Click → ServiceDetailScreen
        ├── WorkoutRenderer (personal)
        ├── MealPlanRenderer (nutricao)
        ├── GoalTrackingRenderer (coach)
        └── GenericTableRenderer (other)

ProfileScreen (Tab 2)
  ├── Dados do usuário
  ├── Toggle tema claro/escuro
  ├── Alterar senha
  └── Sair
```

## Sistema de Renderização Contextual

O app automaticamente escolhe o componente correto baseado no `serviceType`:

```typescript
// Mapeamento automático
'personal'  → WorkoutRenderer        # Treinos com exercícios
'nutricao'  → MealPlanRenderer       # Refeições com macros
'coach'     → GoalTrackingRenderer   # Metas e progresso
'other'     → GenericTableRenderer   # Tabela simples
```

## Formatação das Planilhas

### Personal Trainer

```
| Exercício   | Séries | Repetições | Descanso | Peso |
|-------------|--------|------------|----------|------|
| Supino      | 4      | 12         | 60s      | 40kg |
| Agachamento | 3      | 15         | 90s      | 60kg |
```

### Nutricionista

```
| Refeição       | Alimento     | Quantidade | Calorias | Proteína | Carboidrato | Gordura |
|----------------|--------------|------------|----------|----------|-------------|---------|
| Café da Manhã  | Ovos         | 3 unidades | 210      | 18g      | 2g          | 15g     |
| Café da Manhã  | Pão Integral | 2 fatias   | 140      | 6g       | 24g         | 2g      |
```

### Coach

```
| Meta        | Descrição    | Valor Alvo | Valor Atual | Progresso (%) | Prazo      |
|-------------|--------------|------------|-------------|---------------|------------|
| Perder Peso | Reduzir 10kg | 70kg       | 75kg        | 50            | 31/12/2024 |
```

## Desenvolvimento

### Dados de Exemplo

O arquivo `src/utils/mockData.ts` contém dados de exemplo que você pode usar durante o desenvolvimento:

```typescript
import { mockClientData } from '@/utils/mockData';

// Use os dados mock
console.log(mockClientData);
```

### Comandos Úteis

```bash
# Verificar erros de TypeScript
npm run build

# Linter
npm run lint

# Preview da build de produção
npm run preview
```

### Debug

Para debugar problemas de autenticação ou Firebase:

1. Abra o DevTools do navegador
2. Vá em Console para ver logs
3. Vá em Application > Local Storage para ver dados salvos
4. Vá em Network para ver chamadas às Cloud Functions

## Deploy

### Firebase Hosting

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Outros Hosts (Vercel, Netlify, etc.)

1. Build: `npm run build`
2. Diretório de output: `dist/`
3. Configure como Single Page Application (SPA)
4. Redirecione todas as rotas para `index.html`

## Troubleshooting

### Erro: "Cannot find module '@/...'"

Certifique-se de que o TypeScript está configurado corretamente:
- `tsconfig.json` deve ter o path mapping para `@/*`
- `vite.config.ts` deve ter o alias configurado

### Erro: "Firebase: Error (auth/configuration-not-found)"

Verifique se o arquivo `.env` está configurado corretamente com suas credenciais do Firebase.

### Erro: "Function not found"

As Cloud Functions precisam estar implementadas e deployadas:
```bash
cd functions
firebase deploy --only functions
```

### PWA não está funcionando

PWA só funciona em:
- HTTPS (produção)
- localhost (desenvolvimento)
- Build de produção (`npm run build` + `npm run preview`)

## Próximos Passos

1. ✅ Configurar Firebase (`.env`)
2. ✅ Implementar Cloud Functions
3. ✅ Criar usuários de teste
4. ✅ Testar o app localmente
5. ⬜ Deploy em produção
6. ⬜ Testar PWA em dispositivo móvel

## Suporte

- **README.md**: Visão geral do projeto
- **FIREBASE_SETUP.md**: Guia completo de configuração do Firebase
- **GETTING_STARTED.md**: Este arquivo - primeiros passos

Para dúvidas técnicas, consulte a documentação oficial:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/docs)
- [Material-UI](https://mui.com/)
