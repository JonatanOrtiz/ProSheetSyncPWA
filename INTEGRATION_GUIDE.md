# Guia de Integração - Dashboard + PWA

## 📋 Resumo

Este PWA funciona em conjunto com o dashboard web. Ambos devem usar o **MESMO projeto Firebase**.

## 🔗 Arquitetura

```
Dashboard Web (Admin)
    ↓ [cria usuários]
    ↓ [processa planilhas do Google Sheets]
    ↓ [salva dados]
    ↓
Firebase
    ├── Authentication (usuários compartilhados)
    ├── Firestore (dados compartilhados)
    └── Cloud Functions (functions compartilhadas)
    ↑
    ↑ [lê dados]
    ↑ [autentica usuários]
    ↑
PWA Mobile (Cliente)
```

## ✅ Passo a Passo de Integração

### 1. Configurar o PWA com as mesmas credenciais

No PWA, copie as **MESMAS** credenciais do dashboard:

```bash
# No diretório do PWA
cp .env.example .env
```

Edite `.env` com as credenciais do seu projeto Firebase:

```env
# Copie do Firebase Console ou do .env do dashboard
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 2. Adicionar Cloud Functions

No seu projeto Firebase (onde está o dashboard), adicione as functions necessárias:

**Arquivo: `functions/src/index.ts` (ou criar novo arquivo)**

Copie o conteúdo de `FIREBASE_FUNCTIONS_EXAMPLE.ts` e adicione ao seu projeto de functions.

As duas functions necessárias são:
- `getClientData` - **OBRIGATÓRIA** - Retorna dados do cliente para o PWA
- `refreshService` - **OPCIONAL** - Atualiza dados de um serviço

### 3. Deploy das Functions

```bash
# No diretório do projeto Firebase (onde está o dashboard)
cd functions
npm install
npm run build
firebase deploy --only functions:getClientData,functions:refreshService
```

### 4. Estrutura de Dados no Firestore

O dashboard precisa salvar os dados no formato correto. Veja detalhes em:
📄 `FIRESTORE_STRUCTURE.md`

**Pontos críticos:**

```javascript
// Estrutura no Firestore: clients/{clientUid}
{
  clientEmail: string,
  clientName: string,
  professionals: [
    {
      services: [
        {
          serviceId: string,
          serviceName: string,
          serviceType: "personal" | "nutricao" | "coach" | "other", // 🔥 CRÍTICO!
          spreadsheets: [
            {
              data: any[][] // Array 2D com dados da planilha
            }
          ]
        }
      ]
    }
  ]
}
```

### 5. Modificações no Dashboard (se necessário)

#### A. Adicionar campo `serviceType` ao processar planilhas

Quando o dashboard processar uma nova planilha, deve:

1. **Detectar ou solicitar o tipo de serviço:**

```typescript
// Opção 1: Dropdown no dashboard
<select>
  <option value="personal">Personal Trainer</option>
  <option value="nutricao">Nutricionista</option>
  <option value="coach">Coach</option>
  <option value="other">Outro</option>
</select>

// Opção 2: Detecção automática
function detectServiceType(data: any[][]): ServiceType {
  const headers = data[0].map(h => String(h).toLowerCase());

  if (headers.includes('exercício') || headers.includes('séries')) {
    return 'personal';
  }
  if (headers.includes('refeição') || headers.includes('alimento')) {
    return 'nutricao';
  }
  if (headers.includes('meta') || headers.includes('progresso')) {
    return 'coach';
  }
  return 'other';
}
```

2. **Salvar com `serviceType` no Firestore:**

```typescript
await firestore.collection('clients').doc(clientUid).update({
  professionals: [...],
  services: [
    {
      serviceId: generateId(),
      serviceName: sheetTitle,
      serviceType: detectServiceType(sheetData), // 🔥 Adicionar este campo!
      spreadsheets: [...]
    }
  ]
});
```

#### B. Criar usuários com senha temporária

O dashboard deve:

```typescript
// 1. Criar usuário
const user = await admin.auth().createUser({
  email: clientEmail,
  password: generateTemporaryPassword(), // ex: "Temp@123"
  displayName: clientName
});

// 2. Criar documento no Firestore
await admin.firestore().collection('clients').doc(user.uid).set({
  clientEmail: clientEmail,
  clientName: clientName,
  totalSpreadsheets: 0,
  professionals: [],
  lastUpdated: admin.firestore.FieldValue.serverTimestamp()
});

// 3. Enviar email com senha temporária
await sendEmailWithPassword(clientEmail, temporaryPassword);
```

## 🧪 Testar a Integração

### 1. Criar usuário de teste no dashboard

1. No dashboard, crie um novo cliente
2. Adicione pelo menos uma planilha
3. Certifique-se que `serviceType` foi definido
4. Anote o email e senha temporária

### 2. Testar no PWA

```bash
# No diretório do PWA
npm run dev
```

1. Acesse http://localhost:5173
2. Faça login com o email e senha temporária
3. Sistema deve forçar troca de senha
4. Após trocar senha, deve mostrar os serviços
5. Clique em um serviço para ver os dados renderizados

### 3. Verificar no Firebase Console

1. **Authentication**: Usuário criado
2. **Firestore**: Documento em `clients/{uid}` com dados corretos
3. **Functions**: Logs mostrando chamadas bem-sucedidas

## 📊 Fluxo Completo

```
1. DASHBOARD: Profissional cria conta do cliente
   └─> Firebase Auth: novo usuário criado
   └─> Firestore: documento clients/{uid} criado
   └─> Email: senha temporária enviada

2. DASHBOARD: Profissional adiciona planilha do Google Sheets
   └─> Dashboard processa dados da planilha
   └─> Dashboard detecta serviceType (personal, nutricao, coach, other)
   └─> Firestore: dados adicionados ao documento do cliente

3. PWA: Cliente recebe email e faz login
   └─> Firebase Auth: autentica com senha temporária
   └─> PWA: detecta primeiro login
   └─> PWA: força troca de senha

4. PWA: Cliente troca senha
   └─> Firebase Auth: senha atualizada
   └─> PWA: libera acesso ao app

5. PWA: Cliente visualiza serviços
   └─> Cloud Function getClientData: busca dados do Firestore
   └─> PWA: renderiza UI apropriada baseada no serviceType
       ├─> personal → WorkoutRenderer (treinos)
       ├─> nutricao → MealPlanRenderer (refeições)
       ├─> coach → GoalTrackingRenderer (metas)
       └─> other → GenericTableRenderer (tabela)
```

## 🔍 Troubleshooting

### Erro: "Function not found"

**Causa**: Functions não foram deployadas ou nome está errado.

**Solução**:
```bash
firebase deploy --only functions
# Verifique logs: firebase functions:log
```

### Erro: "User not found" no PWA

**Causa**: Usuário não foi criado no Firebase Auth ou credenciais erradas.

**Solução**:
- Verifique no Firebase Console > Authentication
- Certifique-se que o email existe
- Senha temporária está correta

### Dados não aparecem no PWA

**Causa**: Estrutura de dados incorreta no Firestore.

**Solução**:
- Verifique no Firebase Console > Firestore
- Compare com exemplos em `FIRESTORE_STRUCTURE.md`
- Verifique se `serviceType` está presente

### PWA mostra tabela genérica ao invés da UI específica

**Causa**: `serviceType` está como `"other"` ou não foi definido.

**Solução**:
- Verifique o campo `serviceType` no Firestore
- Deve ser exatamente: `"personal"`, `"nutricao"`, `"coach"` ou `"other"`
- Atualize o documento manualmente se necessário

## 📝 Checklist de Integração

### No projeto Firebase (Dashboard):

- [ ] Adicionar functions `getClientData` e `refreshService`
- [ ] Deploy das functions: `firebase deploy --only functions`
- [ ] Dashboard salva `serviceType` ao processar planilhas
- [ ] Dashboard cria usuários com senha temporária
- [ ] Dashboard envia email com senha temporária

### No projeto PWA:

- [ ] Arquivo `.env` configurado com credenciais Firebase
- [ ] Testar localmente: `npm run dev`
- [ ] Login funciona com usuário criado pelo dashboard
- [ ] Troca de senha obrigatória funciona
- [ ] Serviços aparecem na home
- [ ] UI específica renderiza corretamente baseada no `serviceType`

### Testes:

- [ ] Criar usuário teste no dashboard
- [ ] Adicionar planilha de Personal Trainer (`serviceType: "personal"`)
- [ ] Login no PWA e verificar WorkoutRenderer
- [ ] Adicionar planilha de Nutricionista (`serviceType: "nutricao"`)
- [ ] Verificar MealPlanRenderer
- [ ] Testar tema claro/escuro
- [ ] Testar alteração de senha no perfil
- [ ] Testar refresh de dados

## 🚀 Deploy em Produção

### 1. Build do PWA

```bash
npm run build
```

### 2. Deploy no Firebase Hosting (mesmo projeto)

```bash
# No diretório do PWA
firebase init hosting
# Public directory: dist
# Single-page app: Yes

firebase deploy --only hosting
```

Agora você terá:
- Dashboard em: `https://seu-projeto.web.app` (ou seu domínio customizado)
- PWA em: `https://seu-projeto.web.app/pwa` (ou subdomínio/domínio separado)

## 📱 Instalar PWA no Celular

Após o deploy, os usuários podem:

1. Acessar a URL do PWA no navegador mobile
2. Navegador mostrará opção "Instalar app" ou "Adicionar à tela inicial"
3. App instalado funciona como app nativo

## 🎯 Resultado Final

Você terá um ecossistema completo:

1. **Dashboard Web** - Para profissionais gerenciarem clientes e planilhas
2. **PWA Mobile** - Para clientes visualizarem seus treinos/refeições/metas
3. **Firebase** - Backend único compartilhado entre os dois

Tudo no **mesmo projeto Firebase**, facilitando gerenciamento e reduzindo custos!
