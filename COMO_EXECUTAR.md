# 🚀 Como Executar - Corrida das Blogueiras O Jogo

## 📋 Pré-requisitos

- ✅ Navegador web moderno (Chrome, Firefox, Safari, Edge)
- ✅ Nenhuma instalação necessária
- ✅ Nenhuma dependência externa

## 🎮 Opção 1: Execução Local (Recomendado)

### Windows
1. Abra o explorador de arquivos
2. Navegue até a pasta do projeto
3. Clique com botão direito em `index.html`
4. Selecione "Abrir com" → Seu navegador
5. **Pronto!** O jogo abrirá

### Mac
1. Abra o Finder
2. Navegue até a pasta do projeto
3. Clique duplo em `index.html`
4. **Pronto!** Abrirá no navegador padrão

### Linux
```bash
# Terminal
cd /caminho/para/CDBNC
firefox index.html  # ou outro navegador
# ou
xdg-open index.html
```

---

## 🎮 Opção 2: Servidor Local (Melhor para Desenvolvimento)

### Com Python 3
```bash
# Navegue até a pasta do projeto
cd d:\conc\CDBNC

# Inicie servidor
python -m http.server 8000

# Abra no navegador
# http://localhost:8000
```

### Com Node.js
```bash
# Instale http-server globalmente (uma vez)
npm install -g http-server

# Navegue até a pasta
cd d:\conc\CDBNC

# Inicie servidor
http-server

# Abra no navegador
# http://localhost:8080
```

### Com Live Server (VSCode)
1. Instale extensão "Live Server" no VSCode
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"
4. Abre automaticamente no navegador

---

## 📁 Estrutura do Projeto

```
CDBNC/
├── index.html                 # Arquivo principal
├── css/
│   └── styles.css            # Estilos CSS
├── javascript/
│   ├── index.js              # Lógica de inicialização
│   ├── modes.js              # 3 modos de jogo
│   ├── chaves.js             # Modo Chaves (legado)
│   └── normal.js             # Compatibilidade
├── ATUALIZACOES.md           # Detalhes das atualizações
├── GUIA_RAPIDO.md            # Referência rápida
├── CSS_UPDATES.md            # Mudanças CSS
├── RESUMO_FINAL.md           # Resumo completo
└── COMO_EXECUTAR.md          # Este arquivo
```

---

## 🎮 Como Jogar

### 1️⃣ Selecione Modo de Jogo
```
┌─────────────────────────────┐
│ ⚙️ Escolha o Modo de Jogo   │
│                             │
│ [🎲 Aleatório] [🎮 VF]     │
└─────────────────────────────┘
```
- **Aleatório**: Sistema decide automaticamente (rápido)
- **VF**: Você escolhe os resultados (interativo)

### 2️⃣ Selecione Participantes
```
┌──────────────────────────────┐
│ 🔍 Escolha seu elenco...      │
│                              │
│ [Renata Santti] [Kenya B.] ..│
│                              │
│ 👑 Selecionados (0/12)       │
└──────────────────────────────┘
```

### 3️⃣ Escolha Formato
```
┌─────────────────────────────┐
│ 📊 Formato de Jogo          │
│ [Regular (8-12) ▼]          │
│ [Pontuação (8) ▼]           │
│ [Grupos (12) ▼]             │
└─────────────────────────────┘
```

### 4️⃣ Comece!
```
[🚀 Começar Simulação!]
```

### 5️⃣ Acompanhe os Episódios
- Ver resultados de cada episódio
- Se VF: escolha quem vence, quem é flop, etc.
- Se Aleatório: veja o sistema decidir

### 6️⃣ Escolha o Vencedor Final
```
[👑 Nome 1] [👑 Nome 2] [👑 Nome 3]
```

### 7️⃣ Veja o Ranking Final
```
🏆 RESULTADO FINAL 🏆

1º Lugar: Nome (XXX.X pontos)
2º Lugar: Nome (XXX.X pontos)
...
```

---

## 🎮 Exemplo de Uso Prático

### Cenário: Jogar Modo Regular - Aleatório

```
1. Clica [🎲 Aleatório]
   └─ Modo muda para automático

2. Seleciona [Modo Regular (8-12 participantes)]
   └─ Precisa de 12 participantes

3. Pesquisa e clica em:
   - Renata Santti
   - Vitória Régia
   - Ju Barbosa
   - ... (até 12)

4. Clica [🚀 Começar Simulação!]
   └─ Mostra intro do modo

5. Vê Episódio 1:
   - Champion: Renata
   - Top: Vitória
   - Safe: Ju
   - Flop: Mariana
   - Eliminada: Mhanuela

6. Vê Episódio 2... Episódio N
   └─ Até restar 2 participantes

7. Escolhe Vencedor Final
   └─ Clica em um dos 2 finalistas

8. Vê Ranking Completo
   └─ Todos os participantes + pontuações
```

---

## 🎮 Exemplo de Uso Prático

### Cenário: Jogar Modo Pontuação - VF

```
1. Clica [🎮 VF]
   └─ Modo muda para manual

2. Seleciona [Modo Pontuação (8 participantes)]
   └─ Precisa de exatamente 8

3. Seleciona 8 participantes

4. Clica [🚀 Começar Simulação!]

5. Desafio 1 - Escolha Manual:
   - Dropdown: Seleciona Campeã
   - Dropdown: Seleciona Top
   - Dropdown: Seleciona Safe
   - Dropdown: Seleciona Flop
   - Dropdown: Seleciona Eliminada
   - Clica [✅ Confirmar]

6. Resultado do Desafio 1:
   └─ Mostra quem venceu + ranking

7. Desafios 2-9: Repete processo
   └─ Escolhe resultado em cada um

8. Top 3 escolhem vencedor

9. Ranking final com pontos acumulados
```

---

## 🎮 Exemplo de Uso Prático

### Cenário: Jogar Modo Grupos - Aleatório

```
1. Clica [🎲 Aleatório]

2. Seleciona [Modo Grupos (12 participantes)]
   └─ Precisa de exatamente 12

3. Seleciona 12 participantes

4. Clica [🚀 Começar Simulação!]

5. Intro explica o modo

6. Fase de Grupos (9 desafios no total):
   - 3 desafios Grupo A
   - 3 desafios Grupo B
   - 3 desafios Grupo C
   └─ Sistema escolhe resultado de cada

7. Resultado Fase de Grupos:
   └─ Top 2 de cada = 6 classificados

8. Fase Final (Modo Regular):
   - 6 participantes
   - Elimina até restar 2

9. Escolhe grande vencedor

10. Ranking final com pontos totais
```

---

## 🔧 Troubleshooting

### ❌ Página em branco
- **Solução**: Atualizar página (F5 ou Ctrl+R)
- **Alternativa**: Usar servidor local

### ❌ Botões não respondem
- **Solução**: Abrir console (F12) e procurar erros
- **Alternativa**: Tente outro navegador

### ❌ Estilos estranhos
- **Solução**: Limpar cache (Ctrl+Shift+Delete)
- **Alternativa**: Abrir em navegação privada

### ❌ Seleção de participantes não funciona
- **Solução**: Certifique-se do número correto para o modo
- **Alternativa**: Use o botão "Remover Participante"

---

## 📊 Requisitos Técnicos Mínimos

### Navegador
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Sistema Operacional
- Windows 7+
- macOS 10.12+
- Linux (qualquer distribuição)
- iOS 12+ (iPhone/iPad)
- Android 6+ (celular)

### Hardware Mínimo
- RAM: 512MB
- CPU: Qualquer
- Armazenamento: 500KB
- Conexão: Não necessária (funciona offline)

---

## 🔐 Segurança

✅ **Totalmente Seguro**
- Não coleta dados pessoais
- Funciona 100% offline
- Sem conexões externas
- Sem rastreamento
- Código aberto

---

## 💡 Dicas de Uso

1. **Pesquisa Rápida**: Digite parte do nome para filtrar
2. **Remover Participante**: Use botão ou clique no nome selecionado
3. **Modo VF com 5 seleções**: Valida automaticamente se todos diferentes
4. **Modo Aleatório é Rápido**: Use para testar rapidamente
5. **Modo VF é Detalhado**: Use para experiência customizada

---

## 📞 Suporte

Dúvidas técnicas?
- Consulte `GUIA_RAPIDO.md`
- Consulte `ATUALIZACOES.md`
- Consulte `CSS_UPDATES.md`

---

## 🎉 Bom jogo!

Aproveite o simulador e divirta-se!

---

**Versão**: 1.0
**Data**: 12/11/2025
**Status**: Pronto para jogar ✅
