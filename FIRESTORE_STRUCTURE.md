# Estrutura de Dados no Firestore

## Importante
O **dashboard** deve salvar os dados nesta estrutura para o **PWA** conseguir ler e renderizar corretamente.

## Coleção: `clients/{clientUid}`

Cada documento representa um cliente (usuário do PWA).

### Estrutura Completa

```javascript
{
  clientEmail: "cliente@exemplo.com",
  clientName: "João Silva",
  totalSpreadsheets: 3,
  lastUpdated: Timestamp,

  professionals: [
    {
      professionalId: "prof-123",
      professionalEmail: "personal@exemplo.com",
      professionalName: "Carlos Personal Trainer",
      professionalPhoto: "https://storage.googleapis.com/...", // opcional

      services: [
        {
          serviceId: "service-456",
          serviceName: "Treino ABC",

          // 🔥 CAMPO CRÍTICO: Define qual componente será usado no PWA
          serviceType: "personal", // 'personal' | 'nutricao' | 'coach' | 'other'

          spreadsheets: [
            {
              sheetId: "sheet-789",
              sheetUrl: "https://docs.google.com/spreadsheets/d/...",
              sheetTitle: "Treino Segunda",
              rowCount: 15,
              createdAt: Timestamp,

              // Array 2D com os dados da planilha
              data: [
                ["Exercício", "Séries", "Repetições", "Descanso", "Peso"],
                ["Supino", "4", "12", "60s", "40kg"],
                ["Agachamento", "3", "15", "90s", "60kg"]
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

## Campo Crítico: `serviceType`

O `serviceType` determina como o PWA renderiza os dados:

| serviceType | Renderizador        | Usado para                          |
|-------------|---------------------|-------------------------------------|
| `personal`  | WorkoutRenderer     | Personal Trainer - Treinos          |
| `nutricao`  | MealPlanRenderer    | Nutricionista - Refeições           |
| `coach`     | GoalTrackingRenderer| Coach - Metas e Acompanhamento      |
| `other`     | GenericTableRenderer| Qualquer outro serviço (tabela)     |

## Exemplos por Tipo de Serviço

### 1. Personal Trainer (`serviceType: "personal"`)

```javascript
{
  serviceId: "service-1",
  serviceName: "Treino ABC",
  serviceType: "personal",
  spreadsheets: [
    {
      sheetId: "sheet-1",
      sheetUrl: "https://docs.google.com/spreadsheets/d/...",
      sheetTitle: "Treino Semana 1",
      rowCount: 20,
      createdAt: Timestamp,
      data: [
        // Cabeçalho
        ["Exercício", "Séries", "Repetições", "Descanso", "Peso", "Observações"],

        // Separador de dia (opcional)
        ["Segunda-feira", "", "", "", "", ""],

        // Exercícios
        ["Supino Reto", "4", "12", "60s", "40kg", ""],
        ["Supino Inclinado", "3", "12", "60s", "35kg", ""],
        ["Crucifixo", "3", "15", "45s", "15kg", "Até a falha"],

        // Próximo dia
        ["Quarta-feira", "", "", "", "", ""],
        ["Agachamento", "4", "15", "90s", "60kg", ""],
        ["Leg Press", "3", "20", "60s", "100kg", ""]
      ]
    }
  ]
}
```

### 2. Nutricionista (`serviceType: "nutricao"`)

```javascript
{
  serviceId: "service-2",
  serviceName: "Plano Alimentar",
  serviceType: "nutricao",
  spreadsheets: [
    {
      sheetId: "sheet-2",
      sheetUrl: "https://docs.google.com/spreadsheets/d/...",
      sheetTitle: "Dieta - Semana 1",
      rowCount: 15,
      createdAt: Timestamp,
      data: [
        // Cabeçalho
        ["Refeição", "Alimento", "Quantidade", "Calorias", "Proteína", "Carboidrato", "Gordura"],

        // Refeição 1
        ["Café da Manhã", "Ovos Mexidos", "3 unidades", "210", "18g", "2g", "15g"],
        ["Café da Manhã", "Pão Integral", "2 fatias", "140", "6g", "24g", "2g"],
        ["Café da Manhã", "Abacate", "1/2 unidade", "120", "1.5g", "6g", "11g"],

        // Refeição 2
        ["Lanche da Manhã", "Iogurte Grego", "200ml", "130", "10g", "9g", "5g"],
        ["Lanche da Manhã", "Banana", "1 unidade", "105", "1.3g", "27g", "0.4g"],

        // Refeição 3
        ["Almoço", "Frango Grelhado", "150g", "165", "31g", "0g", "3.6g"],
        ["Almoço", "Arroz Integral", "150g", "170", "4g", "36g", "1.5g"]
      ]
    }
  ]
}
```

### 3. Coach (`serviceType: "coach"`)

```javascript
{
  serviceId: "service-3",
  serviceName: "Metas 2024",
  serviceType: "coach",
  spreadsheets: [
    {
      sheetId: "sheet-3",
      sheetUrl: "https://docs.google.com/spreadsheets/d/...",
      sheetTitle: "Acompanhamento Mensal",
      rowCount: 5,
      createdAt: Timestamp,
      data: [
        // Cabeçalho
        ["Meta", "Descrição", "Valor Alvo", "Valor Atual", "Progresso (%)", "Prazo"],

        // Metas
        ["Perder Peso", "Reduzir peso corporal", "70kg", "75kg", "50", "31/12/2024"],
        ["Ganhar Massa", "Aumentar massa muscular", "5kg", "2kg", "40", "31/12/2024"],
        ["Corrida 5km", "Correr 5km em menos de 30min", "30min", "35min", "70", "30/06/2024"]
      ]
    }
  ]
}
```

### 4. Outro (`serviceType: "other"`)

```javascript
{
  serviceId: "service-4",
  serviceName: "Controle de Sessões",
  serviceType: "other",
  spreadsheets: [
    {
      sheetId: "sheet-4",
      sheetUrl: "https://docs.google.com/spreadsheets/d/...",
      sheetTitle: "Histórico",
      rowCount: 10,
      createdAt: Timestamp,
      data: [
        // Qualquer estrutura - será mostrada como tabela
        ["Data", "Tipo", "Duração", "Observações"],
        ["01/01/2024", "Treino", "60 min", "Bom desempenho"],
        ["02/01/2024", "Consulta", "30 min", "Ajuste no plano"]
      ]
    }
  ]
}
```

## Como o Dashboard Deve Processar

### 1. Quando criar um novo cliente:

```typescript
// Firebase Admin SDK no dashboard
const auth = admin.auth();
const firestore = admin.firestore();

// Criar usuário
const user = await auth.createUser({
  email: 'cliente@exemplo.com',
  password: 'senhaTemporaria123',
  displayName: 'João Silva'
});

// Criar documento no Firestore
await firestore.collection('clients').doc(user.uid).set({
  clientEmail: 'cliente@exemplo.com',
  clientName: 'João Silva',
  totalSpreadsheets: 0,
  professionals: [],
  lastUpdated: admin.firestore.FieldValue.serverTimestamp()
});
```

### 2. Quando adicionar uma planilha:

```typescript
// Processar planilha do Google Sheets
const sheetData = await fetchGoogleSheet(spreadsheetUrl);

// Determinar o tipo de serviço
// Isso pode ser automático (detectar pelo conteúdo) ou manual (dropdown no dashboard)
const serviceType = detectServiceType(sheetData); // 'personal', 'nutricao', 'coach', 'other'

// Adicionar ao documento do cliente
const clientRef = firestore.collection('clients').doc(clientUid);

await clientRef.update({
  professionals: admin.firestore.FieldValue.arrayUnion({
    professionalId: professionalUid,
    professionalEmail: professionalEmail,
    professionalName: professionalName,
    services: [
      {
        serviceId: generateId(),
        serviceName: sheetTitle,
        serviceType: serviceType, // 🔥 IMPORTANTE!
        spreadsheets: [
          {
            sheetId: generateId(),
            sheetUrl: spreadsheetUrl,
            sheetTitle: sheetTitle,
            rowCount: sheetData.length,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            data: sheetData // Array 2D
          }
        ]
      }
    ]
  }),
  totalSpreadsheets: admin.firestore.FieldValue.increment(1),
  lastUpdated: admin.firestore.FieldValue.serverTimestamp()
});
```

## Detecção Automática de Tipo

Você pode implementar lógica para detectar automaticamente o tipo baseado no conteúdo:

```typescript
function detectServiceType(data: any[][]): 'personal' | 'nutricao' | 'coach' | 'other' {
  const headers = data[0].map(h => String(h).toLowerCase());

  // Personal Trainer
  if (headers.includes('exercício') || headers.includes('exercicio') ||
      headers.includes('séries') || headers.includes('series')) {
    return 'personal';
  }

  // Nutricionista
  if (headers.includes('refeição') || headers.includes('refeicao') ||
      headers.includes('alimento') || headers.includes('calorias')) {
    return 'nutricao';
  }

  // Coach
  if (headers.includes('meta') || headers.includes('objetivo') ||
      headers.includes('progresso')) {
    return 'coach';
  }

  // Fallback
  return 'other';
}
```

## Regras de Segurança do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clientes podem ler apenas seus próprios dados
    match /clients/{clientUid} {
      allow read: if request.auth != null && request.auth.uid == clientUid;
      allow write: if false; // Apenas via Admin SDK (dashboard) ou Cloud Functions
    }
  }
}
```

## Checklist para o Dashboard

- [ ] Criar usuário no Firebase Auth
- [ ] Criar documento `clients/{uid}` no Firestore
- [ ] Ao adicionar planilha:
  - [ ] Processar dados do Google Sheets
  - [ ] Definir `serviceType` (manual ou automático)
  - [ ] Salvar no formato correto
  - [ ] Incrementar `totalSpreadsheets`
  - [ ] Atualizar `lastUpdated`
- [ ] Enviar email com senha temporária ao cliente

## Testando

Use o Firebase Console para verificar se os dados estão no formato correto:
1. Acesse https://console.firebase.google.com/
2. Vá em Firestore Database
3. Navegue até `clients/{clientUid}`
4. Verifique se a estrutura está igual aos exemplos acima
