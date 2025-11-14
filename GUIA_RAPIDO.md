# 🎮 Guia Rápido - Corrida das Blogueiras O Jogo

## 📊 Comparação dos 3 Modos

| Aspecto | Regular | Pontuação | Grupos |
|---------|---------|-----------|--------|
| **Participantes** | 8-12 | 8 | 12 |
| **Eliminações** | Sim (1/ep) | Não | Não (até Final) |
| **Episódios** | Variável | 9 | 12 (3 por grupo) |
| **Fase Final** | Top 2 | Top 3 | 2 (após 6 classificados) |
| **Win Points** | 1.0 | 2.0 | 2.0 |
| **Demais** | 0.1-0.8 | 0 | 1.0 |

---

## 🎲 Modo Aleatório vs VF

### 🎲 Aleatório
```
Sistema gera automaticamente → Exibe resultado → Próximo episódio
```
**Vantagem**: Rápido e sem decisões

### 🎮 VF (Você Faz)
```
Sistema pergunta resultado → Você escolhe → Sistema exibe → Próximo episódio
```
**Vantagem**: Controle total sobre os resultados

---

## 📋 Fluxo do Modo Regular

```
Intro → Episódio 1 → ... → Episódio N → Top 2 → Escolha Vencedor → Ranking Final
```

**Por Episódio (Aleatório):**
1. Sorteia 1 campeã
2. Sorteia 1 top
3. Sorteia 1 safe
4. Sorteia 1 flop
5. Sorteia 1 eliminada
6. Mostra resultado → Próximo

**Por Episódio (VF):**
1. Pede para escolher campeã
2. Pede para escolher top
3. Pede para escolher safe
4. Pede para escolher flop
5. Pede para escolher eliminada
6. Valida seleções
7. Mostra resultado → Próximo

---

## 📊 Fluxo do Modo Pontuação

```
Intro → 9 Desafios → Top 3 Ranking → Escolha Vencedor → Ranking Final
```

**Por Desafio (Aleatório):**
1. Sorteia campeã
2. Campeã ganha +2 pontos
3. Mostra ranking atualizado
4. Próximo desafio

**Por Desafio (VF):**
1. Mostra botões de participantes
2. Você clica na campeã
3. Campeã ganha +2 pontos
4. Mostra ranking atualizado
5. Próximo desafio

---

## 👥 Fluxo do Modo Grupos

```
Intro → Fase de Grupos (3 grupos × 3 desafios) → 6 Classificados → Fase Final (Regular) → Ranking
```

**Fase de Grupos:**
- Grupo A: 3 desafios
- Grupo B: 3 desafios
- Grupo C: 3 desafios
- **Top 2 de cada grupo avançam**

**Fase Final:**
- Funciona como Modo Regular
- 6 participantes → Eliminação até 2
- Escolha do vencedor

---

## 🏆 Sistema de Pontuação Detalhado

### Modo Regular (por episódio)
```
Champion (1º lugar)     → 1.0 ponto
Top (2º lugar)          → 0.8 pontos
Safe (3º lugar)         → 0.5 pontos
Flop (4º lugar)         → 0.3 pontos
Eliminated              → 0.1 ponto
```

### Modo Pontuação (por desafio)
```
Champion                → 2 pontos
Demais                  → 0 pontos
```

### Modo Grupos (por desafio)
```
Champion                → 2 pontos
Demais                  → 1 ponto
```

---

## 📝 Funções Principais

### index.js
- `setGameMode(mode)` - Define Aleatório ou VF
- `startSimulation()` - Inicia jogo baseado nas seleções
- `selectParticipant(name)` - Seleciona participante
- `removeParticipant()` - Remove último selecionado

### modes.js

#### Modo Regular
- `startRegularMode(participants, gameMode, finalFormat)`
- `showRegularEpisode(episodeNum, ...)`
- `showRegularEpisodeResult(...)`
- `showRegularEpisodeVF(...)`
- `submitRegularEpisodeVF(episodeNum)`
- `showRegularFinal(...)`

#### Modo Pontuação
- `startScoreMode(participants, gameMode, finalFormat)`
- `showScoreEpisode(episodeNum, ...)`
- `showScoreEpisodeResult(...)`
- `selectScoreWinner(champion)`
- `showScoreFinal(...)`

#### Modo Grupos
- `startGroupsMode(participants, gameMode, finalFormat)`
- `executeGroupsPhase(groups, gameMode)`
- `showGroupChallenge(...)`
- `showGroupChallengeResult(...)`
- `selectGroupWinner(champion)`
- `finalizaGroupsPhase(...)`

#### Comum
- `selectWinner(winner, finalists, eliminated, mode, stats)` - Exibe resultado final
- `initializeStats(participants)` - Inicializa tracking de stats

---

## 🎨 Estrutura de Cores

- **Preto**: Fundo principal (#000)
- **Roxo**: Gradiente principal (#667eea → #764ba2)
- **Rosa**: Destaque (#ff4081, #f5576c)
- **Ouro**: Vencedor (#FFD700, #FFA500)
- **Prata**: Segundo lugar (#C0C0C0)
- **Bronze**: Terceiro lugar (#CD7F32)
- **Verde**: Success (#4CAF50, #00b894)
- **Vermelho**: Eliminado (#f44336, #ff6b6b)

---

## 🔍 Variáveis Globais

```javascript
let currentGameMode = 'aleatorio' ou 'vf'  // Modo selecionado
window.currentRegularCallback                // Callback para episódio Regular VF
window.currentScoreCallback                  // Callback para episódio Pontuação VF
window.currentGroupCallback                  // Callback para episódio Grupos VF
```

---

## 🚀 Exemplo de Uso (Código)

```javascript
// Usuário seleciona 12 participantes e clica em começar
startSimulation();

// Internamente:
const modo = document.getElementById('premiere-format').value; // 'regular'
const gameMode = currentGameMode; // 'aleatorio' ou 'vf'

// Chama:
startRegularMode(participants, gameMode, 'top2');

// Que então:
// 1. Mostra intro
// 2. Executa episódios até restar 2
// 3. Mostra final para escolher vencedor
// 4. Exibe ranking completo
```

---

## 💡 Dicas

1. **Para adicionar novo modo**: Crie `startNewMode()` em modes.js
2. **Para alterar pontuação**: Edite `SCORING_SYSTEM` no topo de modes.js
3. **Para alterar cores**: Edite strings de estilo inline ou CSS
4. **Para adicionar participantes**: Edite os `<button class="contestant-btn">` no HTML

---

Criado em: 12/11/2025
Versão: 1.0 Completa
