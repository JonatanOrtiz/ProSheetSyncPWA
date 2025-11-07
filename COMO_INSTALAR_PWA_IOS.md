# 📱 Como Instalar o PWA no iOS (iPhone/iPad)

## ⚠️ IMPORTANTE: Remover a Barra do Safari

Se você está vendo a **barra de navegação cinza do Safari** na parte inferior, significa que o app **não está rodando em modo PWA**. Siga as instruções abaixo para instalar corretamente.

---

## 🔧 Passo a Passo para Instalação

### 1️⃣ Abra no Safari
- Acesse o app pelo navegador **Safari** (não funciona no Chrome!)
- URL: `http://192.168.0.12:5173` (ou a URL do servidor)

### 2️⃣ Toque no botão Compartilhar
- Toque no ícone de **compartilhar** na barra inferior do Safari
- É o ícone de um quadrado com uma seta para cima ↗️

### 3️⃣ Adicione à Tela de Início
- Role para baixo no menu de compartilhamento
- Toque em **"Adicionar à Tela de Início"** (Add to Home Screen)

### 4️⃣ Confirme a instalação
- Edite o nome se quiser (sugestão: "ProSheetSync")
- Toque em **"Adicionar"** no canto superior direito

### 5️⃣ Abra pelo ícone na Tela de Início
- **IMPORTANTE:** Feche o Safari
- Vá para a tela de início do iPhone
- Toque no **ícone do app** que acabou de instalar
- O app deve abrir **SEM a barra do Safari**

---

## ✅ Como Saber se Está Funcionando?

### Rodando Corretamente (PWA):
- ✅ **Sem barra de navegação** do Safari na parte inferior
- ✅ **Sem barra de URL** no topo
- ✅ App ocupa a **tela inteira**
- ✅ Parece um **app nativo**

### Rodando Incorretamente (Browser):
- ❌ **Barra cinza** do Safari na parte inferior
- ❌ **Botões de navegação** (voltar, avançar, compartilhar)
- ❌ **Barra de URL** no topo
- ❌ Parece um **site no navegador**

---

## 🔄 Precisa Reinstalar?

Se você já tinha instalado antes e fez mudanças no código:

1. **Remova o app antigo:**
   - Segure o ícone na tela de início
   - Toque em "Remover App"
   - Confirme "Excluir App"

2. **Instale novamente:**
   - Siga os passos 1-5 acima

---

## 🐛 Problemas Comuns

### A barra do Safari ainda aparece:
- Você está abrindo pelo **Safari** ao invés do **ícone na tela de início**
- Solução: Feche o Safari e abra pelo ícone do app

### O app não instala:
- Certifique-se de estar usando o **Safari** (não Chrome/Firefox)
- Verifique se o servidor está rodando (`npm run dev -- --host`)

### As mudanças não aparecem:
- Remova e reinstale o app
- O PWA pode ter cache antigo

---

## 📊 Diferença Visual

```
┌─────────────────────────────┐
│     ProSheetSync            │ ← Tela cheia
│                             │
│     [CONTEÚDO DO APP]       │
│                             │
│  🏠 Início    👤 Perfil    │ ← Sua barra
└─────────────────────────────┘ ← Sem barra do Safari!
```

vs

```
┌─────────────────────────────┐
│ ⬅️ URL www.site.com    🔍  │ ← Barra do Safari (RUIM!)
├─────────────────────────────┤
│     [CONTEÚDO DO APP]       │
│                             │
│  🏠 Início    👤 Perfil    │ ← Sua barra
├─────────────────────────────┤
│ ⬅️  ➡️  ↗️  📖  📑        │ ← Barra Safari (RUIM!)
└─────────────────────────────┘
```

---

## 📞 Ainda com Dúvidas?

Se mesmo depois de instalar corretamente ainda aparecer a barra do Safari:
1. Verifique se abriu pelo ícone na tela de início (não pelo Safari)
2. Remova e reinstale o app
3. Verifique se as configurações no código estão corretas (manifest.json, meta tags)
