# Configuração do Firebase

Este documento detalha como configurar o Firebase para o ProSheetSync PWA.

## 1. Criar Projeto Firebase

1. Acesse https://console.firebase.google.com/
2. Crie um novo projeto ou use um existente
3. Ative o Firebase Authentication
4. Ative o Cloud Firestore
5. Ative o Cloud Functions

## 2. Configurar Authentication

1. No console do Firebase, vá em **Authentication**
2. Ative o método de autenticação **Email/Password**
3. Não é necessário permitir cadastro público (o dashboard web cria os usuários)

## 3. Estrutura do Firestore

### Coleções Necessárias

#### `clients/{clientUid}`
Dados do cliente autenticado:

```javascript
{
  clientEmail: "cliente@exemplo.com",
  clientName: "João Silva",
  totalSpreadsheets: 4,
  lastUpdated: Timestamp,
  professionals: [
    {
      professionalId: "prof-1",
      professionalEmail: "personal@exemplo.com",
      professionalName: "Carlos Trainer",
      professionalPhoto: "https://...",
      services: [
        {
          serviceId: "service-1",
          serviceName: "Treino ABC",
          serviceType: "personal", // 'personal' | 'nutricao' | 'coach' | 'other'
          spreadsheets: [
            {
              sheetId: "sheet-1",
              sheetUrl: "https://docs.google.com/spreadsheets/...",
              sheetTitle: "Treino Segunda",
              rowCount: 20,
              createdAt: Timestamp,
              data: [
                ["Exercício", "Séries", "Repetições", "Descanso"],
                ["Supino", "4", "12", "60s"],
                // ... mais linhas
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Regras de Segurança (Firestore Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuários autenticados leiam apenas seus próprios dados
    match /clients/{clientUid} {
      allow read: if request.auth != null && request.auth.uid == clientUid;
      allow write: if false; // Apenas via Cloud Functions ou Admin SDK
    }
  }
}
```

## 4. Cloud Functions

As Cloud Functions devem ser implementadas na região **southamerica-east1**.

### Configuração Inicial

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

Selecione:
- Language: TypeScript
- ESLint: Yes
- Install dependencies: Yes

### Function: getClientData

**Descrição**: Retorna todos os dados do cliente autenticado.

**Código de exemplo** (functions/src/index.ts):

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const getClientData = functions
  .region('southamerica-east1')
  .https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado'
      );
    }

    const clientUid = context.auth.uid;

    try {
      // Buscar dados do cliente
      const clientDoc = await admin
        .firestore()
        .collection('clients')
        .doc(clientUid)
        .get();

      if (!clientDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Dados do cliente não encontrados'
        );
      }

      return clientDoc.data();
    } catch (error) {
      console.error('Error getting client data:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao buscar dados do cliente'
      );
    }
  });
```

### Function: refreshService (Opcional)

**Descrição**: Atualiza os dados de um serviço específico buscando novamente do Google Sheets.

```typescript
export const refreshService = functions
  .region('southamerica-east1')
  .https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado'
      );
    }

    const { serviceId } = data;

    if (!serviceId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'serviceId é obrigatório'
      );
    }

    const clientUid = context.auth.uid;

    try {
      // Buscar dados atuais do cliente
      const clientDoc = await admin
        .firestore()
        .collection('clients')
        .doc(clientUid)
        .get();

      if (!clientDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Cliente não encontrado'
        );
      }

      const clientData = clientDoc.data();

      // Encontrar o serviço
      let targetService = null;
      for (const professional of clientData.professionals) {
        const service = professional.services.find(s => s.serviceId === serviceId);
        if (service) {
          targetService = service;
          break;
        }
      }

      if (!targetService) {
        throw new functions.https.HttpsError(
          'not-found',
          'Serviço não encontrado'
        );
      }

      // Aqui você implementaria a lógica para buscar dados atualizados
      // do Google Sheets e atualizar o Firestore
      // Por enquanto, apenas retorna o serviço atual

      return targetService;
    } catch (error) {
      console.error('Error refreshing service:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao atualizar serviço'
      );
    }
  });
```

### Deploy das Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

## 5. Criar Usuários

Os usuários devem ser criados via Dashboard Web ou Admin SDK:

```typescript
// Exemplo de criação de usuário
const auth = admin.auth();

// Criar usuário
const userRecord = await auth.createUser({
  email: 'cliente@exemplo.com',
  password: 'senhaTemporaria123', // Senha temporária
  displayName: 'João Silva'
});

// Criar documento no Firestore
await admin.firestore().collection('clients').doc(userRecord.uid).set({
  clientEmail: 'cliente@exemplo.com',
  clientName: 'João Silva',
  totalSpreadsheets: 0,
  professionals: [],
  lastUpdated: admin.firestore.FieldValue.serverTimestamp()
});

// Enviar email com senha temporária
// (implementar usando SendGrid, Mailgun, etc.)
```

## 6. Variáveis de Ambiente

Configure as variáveis de ambiente no arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Para obter estas informações:
1. Console Firebase > Project Settings
2. Scroll até "Your apps"
3. Selecione seu app web ou crie um novo
4. Copie as configurações

## 7. Teste

Para testar localmente com emulators:

1. Instale os emuladores:
```bash
firebase init emulators
```

2. Configure `.env`:
```env
VITE_USE_FIREBASE_EMULATORS=true
```

3. Execute:
```bash
firebase emulators:start
```

4. No app, os services conectarão automaticamente aos emulators.

## 8. Deploy do PWA

### Build

```bash
npm run build
```

### Deploy no Firebase Hosting

```bash
firebase init hosting
# Selecione 'dist' como public directory
# Configure como single-page app: Yes
# Automatic builds: No

firebase deploy --only hosting
```

## Suporte

Para problemas ou dúvidas sobre a configuração do Firebase, consulte:
- [Documentação Firebase](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Cloud Functions](https://firebase.google.com/docs/functions)
