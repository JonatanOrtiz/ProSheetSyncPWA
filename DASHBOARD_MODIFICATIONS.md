# Modificações Necessárias no Dashboard

## ⚠️ IMPORTANTE
Estas modificações devem ser feitas no arquivo:
`/Users/jonatanortiz/Web/prosheetsync-dashboard/functions/src/index.ts`

## 1. Adicionar `serviceType` à interface `LinkSheetRequest`

**Localização:** Linha 38-44

**SUBSTITUIR:**
```typescript
interface LinkSheetRequest {
  spreadsheetId: string;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
}
```

**POR:**
```typescript
interface LinkSheetRequest {
  spreadsheetId: string;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  serviceType: 'personal' | 'nutricao' | 'coach' | 'other'; // NOVO!
  professionalName: string;
}
```

## 2. Modificar validação na função `linkSheet`

**Localização:** Linha 421-426

**SUBSTITUIR:**
```typescript
let { spreadsheetId: inputSpreadsheetId, clientEmail, clientName, serviceName, professionalName } = request.data as LinkSheetRequest;

// Validar campos obrigatórios
if (!inputSpreadsheetId || !clientEmail || !clientName || !serviceName || !professionalName) {
  throw new functions.https.HttpsError(
    'invalid-argument',
    'spreadsheetId, clientEmail, clientName, serviceName e professionalName são obrigatórios'
  );
}
```

**POR:**
```typescript
let { spreadsheetId: inputSpreadsheetId, clientEmail, clientName, serviceName, serviceType, professionalName } = request.data as LinkSheetRequest;

// Validar campos obrigatórios
if (!inputSpreadsheetId || !clientEmail || !clientName || !serviceName || !serviceType || !professionalName) {
  throw new functions.https.HttpsError(
    'invalid-argument',
    'spreadsheetId, clientEmail, clientName, serviceName, serviceType e professionalName são obrigatórios'
  );
}

// Validar serviceType
const validServiceTypes = ['personal', 'nutricao', 'coach', 'other'];
if (!validServiceTypes.includes(serviceType)) {
  throw new functions.https.HttpsError(
    'invalid-argument',
    'serviceType deve ser: personal, nutricao, coach ou other'
  );
}
```

## 3. Gerar `serviceId` único

**Localização:** Adicionar depois da linha 593 (depois de definir `newSpreadsheet`)

**ADICIONAR:**
```typescript
const newSpreadsheet = {
  sheetId: spreadsheetId,
  sheetUrl: spreadsheetUrl,
  sheetTitle,
  createdAt: admin.firestore.Timestamp.now(),
};

// ADICIONAR ESTA FUNÇÃO (antes de usar)
const generateServiceId = () => {
  return `service_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
```

## 4. Incluir `serviceId` e `serviceType` ao criar/atualizar serviço

**Localização:** Linha 629-633 (quando cria novo serviço)

**SUBSTITUIR:**
```typescript
} else {
  // Serviço novo - criar com a planilha
  services.push({
    serviceName,
    spreadsheets: [newSpreadsheet],
  });
}
```

**POR:**
```typescript
} else {
  // Serviço novo - criar com a planilha
  services.push({
    serviceId: generateServiceId(), // NOVO!
    serviceName,
    serviceType, // NOVO!
    spreadsheets: [newSpreadsheet],
  });
}
```

**E também na linha 645-649 (quando cria profissional novo):**

**SUBSTITUIR:**
```typescript
} else {
  // Profissional novo - criar com serviço e planilha
  professionals.push({
    professionalId,
    professionalEmail,
    professionalName,
    services: [
      {
        serviceName,
        spreadsheets: [newSpreadsheet],
      },
    ],
  });
}
```

**POR:**
```typescript
} else {
  // Profissional novo - criar com serviço e planilha
  professionals.push({
    professionalId,
    professionalEmail,
    professionalName,
    services: [
      {
        serviceId: generateServiceId(), // NOVO!
        serviceName,
        serviceType, // NOVO!
        spreadsheets: [newSpreadsheet],
      },
    ],
  });
}
```

**E também na linha 674-678 (quando cria cliente novo):**

**SUBSTITUIR:**
```typescript
professionals: [
  {
    professionalId,
    professionalEmail,
    professionalName,
    services: [
      {
        serviceName,
        spreadsheets: [newSpreadsheet],
      },
    ],
  },
],
```

**POR:**
```typescript
professionals: [
  {
    professionalId,
    professionalEmail,
    professionalName,
    services: [
      {
        serviceId: generateServiceId(), // NOVO!
        serviceName,
        serviceType, // NOVO!
        spreadsheets: [newSpreadsheet],
      },
    ],
  },
],
```

## 5. Modificar `getClientDataByEmail` para incluir `serviceId` e `serviceType`

**Localização:** Linha 994-997 (dentro do loop de services)

**SUBSTITUIR:**
```typescript
servicesWithData.push({
  serviceName: service.serviceName,
  spreadsheets: spreadsheetsWithData,
});
```

**POR:**
```typescript
servicesWithData.push({
  serviceId: service.serviceId || `legacy_${service.serviceName}`, // NOVO! (fallback para serviços antigos)
  serviceName: service.serviceName,
  serviceType: service.serviceType || 'other', // NOVO! (fallback para serviços antigos)
  spreadsheets: spreadsheetsWithData,
});
```

## 6. Deploy das mudanças

Após fazer todas as modificações:

```bash
cd /Users/jonatanortiz/Web/prosheetsync-dashboard/functions
npm run build
firebase deploy --only functions:linkSheet,functions:getClientDataByEmail
```

## 7. Atualizar o Frontend do Dashboard

O frontend do dashboard precisa enviar o campo `serviceType` ao chamar `linkSheet`.

**Exemplo de chamada atualizada:**

```typescript
const linkSheet = httpsCallable(functions, 'linkSheet');

const result = await linkSheet({
  spreadsheetId: sheetUrl, // ou ID
  clientEmail: 'cliente@email.com',
  clientName: 'Nome do Cliente',
  serviceName: 'Treino ABC',
  serviceType: 'personal', // NOVO CAMPO!
  professionalName: 'Carlos Trainer'
});
```

### Opções de `serviceType`:

- `'personal'` - Personal Trainer (renderiza treinos no PWA)
- `'nutricao'` - Nutricionista (renderiza refeições no PWA)
- `'coach'` - Coach (renderiza metas no PWA)
- `'other'` - Outro (renderiza tabela genérica no PWA)

### Sugestão de UI no Dashboard:

Adicione um dropdown/select no formulário de vincular planilha:

```tsx
<select name="serviceType" required>
  <option value="">Selecione o tipo de serviço</option>
  <option value="personal">Personal Trainer</option>
  <option value="nutricao">Nutricionista</option>
  <option value="coach">Coach</option>
  <option value="other">Outro</option>
</select>
```

## 8. Testar

### Teste 1: Criar novo cliente com planilha
1. No dashboard, vincule uma nova planilha
2. Selecione o tipo de serviço (ex: Personal Trainer)
3. Verifique no Firestore se `serviceType` foi salvo

### Teste 2: Login no PWA
1. Faça login no PWA com o cliente criado
2. Verifique se os serviços aparecem
3. Entre em um serviço e veja se a UI correta foi renderizada

### Verificar no Firestore Console:

```javascript
clients/{clientEmail}/professionals[0]/services[0]
// Deve ter:
{
  serviceId: "service_1234567890_abc123",
  serviceName: "Treino ABC",
  serviceType: "personal", // ✅ ESTE CAMPO DEVE EXISTIR!
  spreadsheets: [...]
}
```

## Resumo das Mudanças

✅ Adicionar `serviceType` à interface `LinkSheetRequest`
✅ Validar `serviceType` no início da função
✅ Gerar `serviceId` único para cada serviço
✅ Salvar `serviceId` e `serviceType` no Firestore
✅ Retornar `serviceId` e `serviceType` em `getClientDataByEmail`
✅ Atualizar frontend do dashboard para enviar `serviceType`
✅ Deploy das functions
✅ Testar integração com PWA

## Dúvidas?

Se tiver algum erro ao fazer as modificações, me avise! 🚀
