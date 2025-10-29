# ✅ Checklist de Integração Dashboard + PWA

## Status Atual

### ✅ PWA - Já está Pronto!

- ✅ Credenciais Firebase configuradas (`.env`)
- ✅ Hook `useClientData` configurado para usar `getClientDataByEmail`
- ✅ Componentes de renderização prontos (WorkoutRenderer, MealPlanRenderer, etc.)
- ✅ Autenticação com troca de senha obrigatória
- ✅ Temas claro/escuro

### ⚠️ Dashboard - Precisa de Modificações

Você precisa fazer modificações no arquivo:
`/Users/jonatanortiz/Web/prosheetsync-dashboard/functions/src/index.ts`

## 📋 Passos para Integração

### Passo 1: Modificar Cloud Functions do Dashboard

Siga **EXATAMENTE** as instruções no arquivo:
📄 **`DASHBOARD_MODIFICATIONS.md`**

Resumo do que você vai adicionar:
1. Campo `serviceType` na interface `LinkSheetRequest`
2. Validação do `serviceType`
3. Função para gerar `serviceId` único
4. Salvar `serviceId` e `serviceType` no Firestore (3 lugares diferentes)
5. Retornar `serviceId` e `serviceType` em `getClientDataByEmail`

### Passo 2: Atualizar Frontend do Dashboard

No componente que chama a função `linkSheet`, adicione o campo `serviceType`:

**Antes:**
```typescript
const result = await linkSheet({
  spreadsheetId: sheetUrl,
  clientEmail: email,
  clientName: name,
  serviceName: service,
  professionalName: professionalName
});
```

**Depois:**
```typescript
const result = await linkSheet({
  spreadsheetId: sheetUrl,
  clientEmail: email,
  clientName: name,
  serviceName: service,
  serviceType: selectedServiceType, // NOVO!
  professionalName: professionalName
});
```

**Adicione um dropdown no formulário:**
```tsx
<select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
  <option value="">Selecione o tipo de serviço</option>
  <option value="personal">🏋️ Personal Trainer</option>
  <option value="nutricao">🍎 Nutricionista</option>
  <option value="coach">🎯 Coach</option>
  <option value="other">📊 Outro</option>
</select>
```

### Passo 3: Deploy das Functions

```bash
cd /Users/jonatanortiz/Web/prosheetsync-dashboard/functions
npm run build
firebase deploy --only functions:linkSheet,functions:getClientDataByEmail
```

### Passo 4: Testar no PWA

```bash
cd /Users/jonatanortiz/Web/prosheetsync-pwa
npm run dev
```

Acesse: http://localhost:5173

## 🧪 Teste Completo Passo a Passo

### 1. Criar Cliente de Teste no Dashboard

- [ ] Abra o dashboard
- [ ] Crie/vincule uma nova planilha
- [ ] Preencha os dados do cliente
- [ ] **IMPORTANTE:** Selecione o tipo de serviço (ex: Personal Trainer)
- [ ] Clique em vincular
- [ ] Anote o email e senha temporária do cliente

### 2. Verificar no Firebase Console

- [ ] Acesse https://console.firebase.google.com/
- [ ] Vá em **Firestore Database**
- [ ] Navegue até `clients/{clientEmail}`
- [ ] Verifique se existe:
  ```javascript
  professionals[0].services[0] = {
    serviceId: "service_...", // ✅ Deve existir
    serviceName: "Treino ABC",
    serviceType: "personal", // ✅ Deve existir
    spreadsheets: [...]
  }
  ```

### 3. Testar Login no PWA

- [ ] Abra o PWA (http://localhost:5173)
- [ ] Faça login com o email do cliente
- [ ] Use a senha temporária
- [ ] **Deve aparecer:** Tela de troca de senha obrigatória
- [ ] Troque a senha
- [ ] **Deve aparecer:** Home com lista de serviços

### 4. Verificar Renderização Contextual

- [ ] Na home, você deve ver o card do serviço
- [ ] Clique no serviço
- [ ] **Verifique se a UI correta foi renderizada:**
  - Personal (`serviceType: "personal"`) → WorkoutRenderer (exercícios, séries, etc.)
  - Nutrição (`serviceType: "nutricao"`) → MealPlanRenderer (refeições, calorias, etc.)
  - Coach (`serviceType: "coach"`) → GoalTrackingRenderer (metas, progresso, etc.)
  - Outro (`serviceType: "other"`) → GenericTableRenderer (tabela simples)

### 5. Testar Funcionalidades do PWA

- [ ] Botão de refresh atualiza os dados
- [ ] Toggle de tema (claro/escuro) funciona
- [ ] Trocar senha no perfil funciona
- [ ] Logout funciona
- [ ] Login novamente funciona

## 🐛 Troubleshooting

### Erro: "serviceType is required"
**Causa:** Frontend do dashboard não está enviando `serviceType`
**Solução:** Adicione o campo `serviceType` na chamada de `linkSheet`

### PWA mostra tabela genérica ao invés da UI específica
**Causa:** `serviceType` não está salvo no Firestore ou está como "other"
**Solução:**
1. Verifique no Firestore Console se `serviceType` existe
2. Se não existir, refaça a vinculação da planilha no dashboard
3. Se existir mas está como "other", atualize manualmente ou refaça

### Erro: "Cliente não encontrado" no PWA
**Causa:** Usuário não existe ou não fez login
**Solução:**
1. Verifique no Firebase Console > Authentication se o usuário existe
2. Verifique se fez login com o email correto

### Dados não aparecem no PWA
**Causa:**
1. Functions não foram deployadas com as modificações
2. `getClientDataByEmail` não está retornando `serviceId` e `serviceType`

**Solução:**
1. Refaça o deploy: `firebase deploy --only functions`
2. Verifique logs: `firebase functions:log`
3. Teste a function diretamente no Firebase Console

## 📊 Como Deve Ficar

### Firestore (clients/{email}):
```javascript
{
  clientEmail: "cliente@email.com",
  clientName: "João Silva",
  clientUid: "abc123...",
  professionals: [
    {
      professionalId: "prof123",
      professionalEmail: "personal@email.com",
      professionalName: "Carlos Trainer",
      services: [
        {
          serviceId: "service_1234567890_abc", // ✅ NOVO!
          serviceName: "Treino ABC",
          serviceType: "personal", // ✅ NOVO!
          spreadsheets: [
            {
              sheetId: "sheet123",
              sheetUrl: "https://...",
              sheetTitle: "Treino Semana 1",
              createdAt: Timestamp,
              data: [[...]] // Vem da Google Sheets
            }
          ]
        }
      ]
    }
  ]
}
```

### PWA Home Screen:
```
┌─────────────────────────────────────┐
│ Olá, João!                          │
│ 2 planilhas ativas              🔄  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👤 Carlos Trainer                   │
│    personal@email.com               │
├─────────────────────────────────────┤
│ 🏋️ Treino ABC                       │
│    🏷️ Personal Trainer              │
│    📄 2 planilhas                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👤 Maria Nutricionista              │
│    nutri@email.com                  │
├─────────────────────────────────────┤
│ 🍎 Plano Alimentar                  │
│    🏷️ Nutricionista                 │
│    📄 1 planilha                    │
└─────────────────────────────────────┘
```

### PWA Service Detail (Personal):
```
┌─────────────────────────────────────┐
│ ← Treino ABC                    🔄  │
│   Carlos Trainer                    │
└─────────────────────────────────────┘

🏋️ Treino Semana 1

▼ Segunda-feira                 3 exercícios
  ☐ Supino
     🔁 4 séries  💪 12 reps  ⏱️ 60s  🏋️ 40kg

  ☐ Supino Inclinado
     🔁 3 séries  💪 12 reps  ⏱️ 60s  🏋️ 35kg

  ☐ Crucifixo
     🔁 3 séries  💪 15 reps  ⏱️ 45s  🏋️ 15kg
```

## 🎉 Resultado Final

Quando tudo estiver funcionando:

✅ Dashboard cria clientes e vincula planilhas com `serviceType`
✅ Cliente recebe email com senha temporária
✅ Cliente faz login no PWA
✅ Cliente é forçado a trocar senha
✅ Cliente vê lista de serviços agrupados por profissional
✅ Cliente clica no serviço e vê UI específica para aquele tipo
✅ Dados são atualizados em tempo real do Google Sheets

## 🚀 Próximos Passos Após Integração

1. **Testar com dados reais**
2. **Deploy do PWA em produção**
3. **Configurar domínio customizado**
4. **Testar instalação PWA em celular**
5. **Coletar feedback dos primeiros usuários**

## 📞 Precisa de Ajuda?

Se encontrar algum erro durante a integração:
1. Verifique os logs do Firebase Functions: `firebase functions:log`
2. Verifique o console do navegador (DevTools)
3. Verifique se todos os passos foram seguidos corretamente
4. Compare sua implementação com os exemplos nos arquivos de documentação

Boa sorte! 🚀
