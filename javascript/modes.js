// ===== SISTEMA DE PONTUAÇÃO GLOBAL =====
// Win (Campeã) = 1.0, Top = 0.8, Safe = 0.5, Flop = 0.3, Eliminada = 0.1

const SCORING_SYSTEM = {
    win: 1.0,
    top: 0.8,
    safe: 0.5,
    flop: 0.3,
    eliminated: 0.1
};

// Nomes fixos para os grupos (A, B, C)
const GROUP_NAMES = ['GRUPO BLOGUEIRINHA', 'GRUPO LORELAY', 'GRUPO NATH'];

// Lista de desafios/episódios disponíveis
const CHALLENGE_NAMES = [
    'Atuação',
    'Comunicação',
    'Criação de Conteúdo',
    'DIY',
    'Fotografia',
    'Maquia e Fala',
    'Maquiagem',
    'Maratona das Blogueiras',
    'Night of Cola Quente',
    'Paredão das Blogueiras',
    'Publi Secrets',
    'Repescagem: Desafio dos Divertidamente'
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Track das escolhas do jogador (quantas vezes escolheu cada participante como campeã)
if (!window.playerChampionChoices) window.playerChampionChoices = {};
// Helper para renderizar avatar do participante (usa o mapeamento PARTICIPANT_PHOTOS definido em index.js)
function participantAvatar(name, size = 50) {
    const photos = window.PARTICIPANT_PHOTOS || {};
    const src = photos[name];
    if (src) {
        return `<img src="${src}" alt="${name}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.9);box-shadow:0 6px 16px rgba(0,0,0,0.35);">`;
    }
    // fallback com inicial
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#667eea;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${Math.floor(size/2)}px;">${initial}</div>`;
}
// ===== MODO REGULAR (8-12 PARTICIPANTES) =====
function startRegularMode(participants, gameMode, finalType, repescagem) {
    const mainBlock = document.getElementById('MainBlock');
    let currentParticipants = [...participants];
    let episodeNum = 1;
    let eliminatedOrder = [];
    let stats = initializeStats(participants);
    
    // Configurações baseadas nos filtros
    const hasRepescagem = repescagem === 'sim' && participants.length > 10;
    // Garantir que haja apenas UMA repescagem por temporada: flag de controle
    let repescagemUsed = false;
    const topsFinalCount = parseInt(finalType.replace('top', ''));  // 2, 3 ou 4
    
    // Mostrar introdução
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                🎮 MODO REGULAR - O JOGO 🎮
            </h1>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 20px;">📋 Como Funciona:</h2>
                <div style="text-align: left; font-size: 1.1em; line-height: 1.8; max-width: 600px; margin: 0 auto;">
                    <p>✨ Cada episódio tem 3 pessoas no topo (1 campeã, 2 top)</p>
                    <p>💔 As 2 restantes são "flop", e 1 sai por episódio</p>
                    <p>🏆 Continua até sobrar 2 finalistas</p>
                    <p>📊 Sistema de pontuação:</p>
                    <ul style="margin: 15px 0;">
                        <li>🥇 Win (Campeã) = 1.0 ponto</li>
                        <li>🥈 Top (sem vencer) = 0.8 pontos</li>
                        <li>➡️ Safe = 0.5 pontos</li>
                        <li>📉 Flop = 0.3 pontos</li>
                        <li>❌ Eliminada = 0.1 ponto</li>
                    </ul>
                </div>
            </div>
            <p style="margin-top: 30px; font-size: 1.2em;">⏳ Iniciando em alguns segundos...</p>
        </div>
    `;
    
    // Preparar pool de desafios: excluir desafio de repescagem se repescagem não estiver ativa
    const baseChallenges = CHALLENGE_NAMES.filter(c => {
        if (c && c.toLowerCase().startsWith('repescagem')) return hasRepescagem;
        return true;
    });
    let challengePool = shuffleArray(baseChallenges);
    function getNextChallenge() {
        if (challengePool.length === 0) {
            // Quando os desafios acabarem, podemos reutilizá-los (reembaralhar)
            challengePool = shuffleArray(baseChallenges);
        }
        return challengePool.pop();
    }

    setTimeout(() => executeRegularEpisode(), 3000);
    
    function executeRegularEpisode() {
        // Determinar quando parar baseado em finalType
        let shouldFinish = false;
        if (finalType === 'top2' && currentParticipants.length === 3) shouldFinish = true;
        if (finalType === 'top3' && currentParticipants.length === 4) shouldFinish = true;
        if (finalType === 'top4' && currentParticipants.length === 5) shouldFinish = true;
        
        if (shouldFinish) {
            // Mostrar track record antes da final
            showTrackRecordScreen(stats, currentParticipants, 'regular', () => {
                showRegularFinal(currentParticipants, gameMode, stats, eliminatedOrder, finalType, hasRepescagem);
            });
            return;
        }
        
        const challengeName = getNextChallenge();
        showRegularEpisode(episodeNum, currentParticipants, gameMode, stats, challengeName, (results) => {
            // Aplicar resultados do episódio
            const { champion, tops = [], flops = [], eliminated } = results;

            // Atualizar estatísticas
            stats[champion].wins++;
            stats[champion].score += SCORING_SYSTEM.win;
            stats[champion].episodes.push({ type: 'win', points: SCORING_SYSTEM.win });

            // Tops (excluindo campeã caso apareça por engano)
            tops.forEach(t => {
                if (t && t !== champion) {
                    stats[t].tops = (stats[t].tops || 0) + 1;
                    stats[t].score += SCORING_SYSTEM.top;
                    stats[t].episodes.push({ type: 'top', points: SCORING_SYSTEM.top });
                }
            });

            // Flops
            flops.forEach(f => {
                if (f) {
                    stats[f].flops = (stats[f].flops || 0) + 1;
                    stats[f].score += SCORING_SYSTEM.flop;
                    stats[f].episodes.push({ type: 'flop', points: SCORING_SYSTEM.flop });
                }
            });

            // Eliminada (apenas uma por episódio)
            if (eliminated) {
                stats[eliminated].eliminated = (stats[eliminated].eliminated || 0) + 1;
                stats[eliminated].score += SCORING_SYSTEM.eliminated;
                stats[eliminated].episodes.push({ type: 'eliminated', points: SCORING_SYSTEM.eliminated });
            }

            // Salvas: todos os que não são campeã, nem top, nem flop
            const saved = currentParticipants.filter(p => p !== champion && !tops.includes(p) && !flops.includes(p));
            saved.forEach(s => {
                stats[s].safe = (stats[s].safe || 0) + 1;
                stats[s].score += SCORING_SYSTEM.safe;
                stats[s].episodes.push({ type: 'safe', points: SCORING_SYSTEM.safe });
            });

            // Remover eliminado
            if (eliminated) {
                currentParticipants = currentParticipants.filter(p => p !== eliminated);
                eliminatedOrder.push(eliminated);
            }
            
            // LÓGICA DE REPESCAGEM: Se ativa e sobram 6 participantes, alguém volta
            if (hasRepescagem && !repescagemUsed && currentParticipants.length === 6 && eliminatedOrder.length > 0) {
                const rescuedIndex = Math.floor(Math.random() * eliminatedOrder.length);
                const rescued = eliminatedOrder[rescuedIndex];
                currentParticipants.push(rescued);
                eliminatedOrder.splice(rescuedIndex, 1);
                // Marcar repescagem como usada para não permitir novas repescagens nesta temporada
                repescagemUsed = true;
                
                // Mostrar mensagem de repescagem
                const mainBlock = document.getElementById('MainBlock');
                const repescagemDiv = document.createElement('div');
                repescagemDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #ffd54a 0%, #ffb300 100%); color: #333; padding: 40px; border-radius: 20px; text-align: center; z-index: 10000; box-shadow: 0 10px 40px rgba(0,0,0,0.4); animation: bounceIn 0.6s ease-out;';
                repescagemDiv.innerHTML = '<h2 style="font-size: 2.5em; margin-bottom: 20px;">🎁 REPESCAGEM! 🎁</h2><p style="font-size: 1.8em;">' + rescued + ' VOLTA AO JOGO!</p>';
                document.body.appendChild(repescagemDiv);
                
                setTimeout(() => {
                    repescagemDiv.style.animation = 'fadeOut 0.5s ease-out';
                    setTimeout(() => repescagemDiv.remove(), 500);
                }, 3000);
            }

            episodeNum++;
            // Aguarda o jogador avançar para o próximo episódio
            waitForAdvance('Próximo episódio', () => executeRegularEpisode());
        });
    }
}

// Helper que mostra um botão fixo de avanço. Remove-se automaticamente após clique.
function waitForAdvance(label = 'Avançar', onAdvance) {
    // Remover botão anterior se existir
    const existing = document.getElementById('advance-button-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'advance-button-container';
    container.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 9999;';

    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'background: linear-gradient(135deg,#667eea,#764ba2); color: white; border: none; padding: 14px 26px; border-radius: 12px; font-size: 1.1em; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.3);';
    btn.onclick = () => {
        container.remove();
        try { onAdvance && onAdvance(); } catch(e) { console.error(e); }
    };

    container.appendChild(btn);
    document.body.appendChild(container);
}
function showRegularEpisode(episodeNum, participants, gameMode, stats, challengeName, callback) {
    const mainBlock = document.getElementById('MainBlock');
    const numParticipants = participants.length;
    
    if (gameMode === 'aleatorio') {
        // Modo Aleatório: TUDO é automático, jogador não escolhe nada nos episódios
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const champion = shuffled[0];
        
        let tops = [];
        let flops = [];
        let eliminated = null;

        // Lógica de distribuição baseada no tamanho do elenco
        if (numParticipants >= 12) {
            // 3 tops (champ + 2), 3 flops (1 eliminada)
            tops = shuffled.slice(1, 3);
            flops = shuffled.slice(3, 6);
            eliminated = flops[Math.floor(Math.random() * flops.length)];
        } else if (numParticipants >= 5) {
            tops = [shuffled[1]];
            flops = [shuffled[2], shuffled[3]];
            eliminated = shuffled[3];
        } else if (numParticipants === 4) {
            tops = [shuffled[1]];
            flops = [shuffled[2]];
            eliminated = shuffled[2];
        } else if (numParticipants === 3) {
            tops = [];
            flops = [shuffled[1], shuffled[2]];
            eliminated = shuffled[2];
        }

        // Mostrar sequência de 3 telas (overview -> campeã/tops/flops -> eliminada) com avanço manual
        const overview = [...shuffled].slice(0, Math.min(6, shuffled.length));

        // Tela 1: Overview dos 6 participantes (foto + legenda abaixo)
            // Tela 0: Blush - mostra todos os participantes restantes (antes da visualização)
            const renderBlush = () => {
                const mainBlock = document.getElementById('MainBlock');
                mainBlock.innerHTML = `
                    <div style="text-align:center;padding:36px;">
                        <h2 style="color:#ff4081;font-size:2.6em;margin-bottom:20px;">✨ BLUSH — PARTICIPANTES RESTANTES</h2>
                        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                            ${participants.map(p => `<div style=\"display:flex;flex-direction:column;align-items:center;gap:8px;\">${participantAvatar(p,72)}<div style=\"color:#222;font-weight:600;\">${p}</div></div>`).join('')}
                        </div>
                        <div style="max-width:720px;margin:0 auto;text-align:center;padding:18px;background:#fff6fb;border-radius:12px;border:1px solid rgba(255,64,129,0.08);">
                            <div style="font-size:1.1em;color:#333;">Um momento para celebrar quem ainda está na disputa. Pressione <strong>Avançar</strong> para ver os destaques do episódio.</div>
                        </div>
                    </div>
                `;
            };

            // Tela 1: Overview dos 6 participantes (foto + legenda abaixo)
            const renderOverview = () => {
            const mainBlock = document.getElementById('MainBlock');
            mainBlock.innerHTML = `
                <div style="text-align:center;padding:36px;">
                    <h2 style="color:#ff4081;font-size:2.6em;margin-bottom:6px;">📺 EPISÓDIO ${episodeNum} — ${challengeName}</h2>
                    <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Visualização do desafio</div>
                    <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                        ${overview.map(p => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">${participantAvatar(p,72)}<div style=\"color:#222;font-weight:600;\">${p}</div></div>`).join('')}
                    </div>
                    <div style="max-width:720px;margin:0 auto;text-align:left;padding:18px;background:#f7f7f7;border-radius:12px;">
                        <strong>Legenda:</strong>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                            <div style="display:flex;align-items:center;gap:8px;"><span style="width:18px;height:18px;border-radius:4px;background:#2b6cff;display:inline-block;"></span> Vitórias (Azul)</div>
                            <div style="display:flex;align-items:center;gap:8px;"><span style="width:18px;height:18px;border-radius:4px;background:#9ad7ff;display:inline-block;"></span> Bons (Azul bebê)</div>
                            <div style="display:flex;align-items:center;gap:8px;"><span style="width:18px;height:18px;border-radius:4px;background:#23c552;display:inline-block;"></span> Salvos (Verde)</div>
                            <div style="display:flex;align-items:center;gap:8px;"><span style="width:18px;height:18px;border-radius:4px;background:#ff8800;display:inline-block;"></span> Flop (Laranja)</div>
                            <div style="display:flex;align-items:center;gap:8px;"><span style="width:18px;height:18px;border-radius:4px;background:#ff5a5a;display:inline-block;"></span> Eliminados (Vermelho)</div>
                        </div>
                    </div>
                </div>
            `;
        };

        // Tela 2: Campeã, Tops e Flops (sem foco de eliminação)
        const renderChampionTopsFlops = () => {
            showRegularEpisodeResult(episodeNum, champion, tops, flops, null, participants, stats, challengeName, () => {
                // não aplicar eliminação aqui — apenas avançar para a tela de eliminação
            });
        };

        // Tela 3: Eliminada (foco exclusivo)
        const renderEliminated = () => {
            const mainBlock = document.getElementById('MainBlock');
            mainBlock.innerHTML = `
                <div style="text-align:center;padding:48px;">
                    <h2 style="color:#ff4081;font-size:2.6em;margin-bottom:6px;">❌ ELIMINAÇÃO — EPISÓDIO ${episodeNum} — ${challengeName}</h2>
                    <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Foco na eliminada</div>
                    <div style="display:flex;justify-content:center;gap:18px;align-items:center;">
                        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding:24px; border-radius:14px; color:white; display:flex; gap:16px; align-items:center;">
                            ${participantAvatar(eliminated, 120)}
                            <div style="text-align:left;"><div style="font-size:2em;font-weight:800;">${eliminated}</div><div style="font-size:1.1em;opacity:0.95;margin-top:6px;">Foi eliminada(o) neste episódio</div></div>
                        </div>
                    </div>
                </div>
            `;
        };

        // Sequência com botão Avançar entre telas
        renderBlush();
        waitForAdvance('Avançar', () => {
            renderOverview();
            waitForAdvance('Avançar', () => {
                renderChampionTopsFlops();
                waitForAdvance('Avançar', () => {
                    renderEliminated();
                    waitForAdvance('Avançar', () => {
                        // Ao fim da sequência, retorna os resultados para aplicação
                        callback({ champion, tops, flops, eliminated });
                    });
                });
            });
        });
        
    } else {
        // Modo VF: jogador escolhe os resultados
        showRegularEpisodeVF(episodeNum, participants, stats, callback);
    }
}

function showRegularEpisodeResult(episodeNum, champion, tops, flops, eliminated, allParticipants, stats, challengeName, callback) {
    const mainBlock = document.getElementById('MainBlock');

    const topsList = [champion].concat(tops || []);
    const topsDisplay = topsList.join(', ');
    const flopsDisplay = (flops || []).map(f => f === eliminated ? `${f} (ELIMINADA)` : f).join(', ');

    // Salvas: quem não é campeã, nem top, nem flop
    const saved = allParticipants.filter(p => p !== champion && !(tops || []).includes(p) && !(flops || []).includes(p));

    let resultsHTML = `
        <div style="display:flex;gap:18px;align-items:center;justify-content:center;padding:18px;margin-bottom:18px;">
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding:14px; border-radius:12px; color:#333; display:flex; gap:12px; align-items:center;">
                ${participantAvatar(champion, 84)}
                <div style="text-align:left;">
                    <div style="font-size:1.6em; font-weight:700;">${champion}</div>
                    <div style="font-size:1em; color:#333;">🥇 CAMPEÃO DO EPISÓDIO</div>
                </div>
            </div>
        </div>

        <div style="display:flex; gap:12px; justify-content:center; margin-bottom:12px;">
            <div style="background: rgba(192, 192, 192, 0.18); padding:12px; border-radius:10px; display:flex; gap:8px; align-items:center;">
                <strong style="margin-right:8px;">🥈 TOPS:</strong>
                ${tops.map(t => `<div style="display:flex;flex-direction:column;align-items:center;font-size:0.9em;">${participantAvatar(t,44)}<div style="margin-top:6px;color:#fff;">${t}</div></div>`).join('')}
            </div>
        </div>`;

    resultsHTML += `
        <div style="display:flex; gap:12px; justify-content:center; margin-bottom:12px;">
            <div style="background: rgba(244, 67, 54, 0.18); padding:12px; border-radius:10px; display:flex; gap:8px; align-items:center;">
                <strong style="margin-right:8px;">📉 FLOPS:</strong>
                ${flops.map(f => `<div style="display:flex;flex-direction:column;align-items:center;font-size:0.9em;">${participantAvatar(f,44)}<div style="margin-top:6px;color:#fff;">${f}${f===eliminated? ' (ELIMINADA)':''}</div></div>`).join('')}
            </div>
        </div>
    `;

    if (eliminated) {
        resultsHTML += `<div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 14px; border-radius: 10px; text-align:center; font-weight:bold;">❌ ${eliminated} FOI ELIMINADO(A)!</div>`;
    }

    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 6px;">📺 EPISÓDIO ${episodeNum} — ${challengeName}</h2>
            <div style="font-size:0.95em;color:#fff;opacity:0.9;margin-bottom:18px;">Resumo do desafio</div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px; border-radius: 20px; margin: 25px 0; color: white;">
                ${resultsHTML}
            </div>

            <div style="background: #2c3e50; padding: 25px; border-radius: 15px; margin-top: 25px;">
                <h4 style="color: #ecf0f1; font-size: 1.4em; margin-bottom: 15px;">👥 Participantes Restantes (${allParticipants.length - 1}):</h4>
                <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                    ${saved.map(p => `
                        <div style="background: #34495e; color: #ecf0f1; padding: 8px 12px; border-radius: 10px; display:flex; align-items:center; gap:10px;">
                            ${participantAvatar(p,44)}
                            <span style="font-weight:600;">${p}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            
        </div>
    `;

    setTimeout(callback, 3000);
}

function showRegularEpisodeVF(episodeNum, participants, stats, callback) {
    const mainBlock = document.getElementById('MainBlock');
    // Renderiza uma tela com todos os participantes e controles para cada papel
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 28px;">
            <h2 style="color: #ff4081; font-size: 2.6em; margin-bottom: 10px;">📺 EPISÓDIO ${episodeNum} - VOCÊ DECIDE!</h2>
            <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Marque 1 vencedor (obrigatório), 1 eliminada (obrigatório). Tops e Flops: escolha quantos quiser. Tops/Flops não podem se sobrepor. Clique em confirmar quando terminar.</div>

            <div id="vf-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; max-width:1100px; margin: 0 auto;">
                ${participants.map(p => `
                    <div class="vf-card" data-name="${p}" style="background: linear-gradient(135deg, #fff, #f7f7ff); padding:12px; border-radius:12px; text-align:center; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
                        ${participantAvatar(p,64)}
                        <div style="font-weight:700; margin-top:8px;">${p}</div>
                        <div style="display:flex; gap:6px; justify-content:center; margin-top:10px;">
                            <button class="vf-role-victory" style="padding:6px 8px;border-radius:8px;border:1px solid #ffd54a;background:#fff;color:#333;cursor:pointer;">🏆 Vencedor</button>
                            <button class="vf-role-top" style="padding:6px 8px;border-radius:8px;border:1px solid #9ad7ff;background:#fff;color:#333;cursor:pointer;">⭐ Top</button>
                            <button class="vf-role-flop" style="padding:6px 8px;border-radius:8px;border:1px solid #ffb86b;background:#fff;color:#333;cursor:pointer;">📉 Flop</button>
                            <button class="vf-role-elim" style="padding:6px 8px;border-radius:8px;border:1px solid #ff6b6b;background:#fff;color:#333;cursor:pointer;">❌ Eliminada</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="text-align:center; margin-top:18px;"><button id="confirm-regular-vf" style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; border: none; padding: 12px 26px; font-size: 1.1em; border-radius: 12px; cursor: pointer; font-weight: bold;">✅ Confirmar Resultados</button></div>
        </div>
    `;

    // Armazenar callback para quando o jogador confirmar
    window.currentRegularCallback = callback;

    // Interatividade: gerenciar seleção de papéis
    const grid = document.getElementById('vf-grid');
    let selectedWinner = null;
    let selectedElim = null;

    grid.querySelectorAll('.vf-card').forEach(card => {
        const name = card.dataset.name;
        const btnWin = card.querySelector('.vf-role-victory');
        const btnTop = card.querySelector('.vf-role-top');
        const btnFlop = card.querySelector('.vf-role-flop');
        const btnElim = card.querySelector('.vf-role-elim');

        function updateVisual() {
            card.dataset.isWinner = (selectedWinner === name) ? '1' : '0';
            card.dataset.isElim = (selectedElim === name) ? '1' : '0';
            // visual styles
            btnWin.style.background = selectedWinner === name ? '#ffd54a' : '#fff';
            btnTop.style.background = card.dataset.isTop === '1' ? '#9ad7ff' : '#fff';
            btnFlop.style.background = card.dataset.isFlop === '1' ? '#ffb86b' : '#fff';
            btnElim.style.background = selectedElim === name ? '#ff6b6b' : '#fff';
        }

        // init state
        card.dataset.isTop = '0';
        card.dataset.isFlop = '0';

        btnWin.addEventListener('click', () => {
            // set this as winner, clear previous winner
            if (selectedWinner && selectedWinner !== name) {
                const prev = grid.querySelector(`.vf-card[data-name="${selectedWinner}"]`);
                if (prev) { prev.dataset.isWinner = '0'; prev.querySelector('.vf-role-victory').style.background = '#fff'; }
            }
            selectedWinner = name;
            // winner cannot be top/flop/elim
            card.dataset.isTop = '0';
            card.dataset.isFlop = '0';
            if (selectedElim === name) selectedElim = null;
            updateVisual();
        });

        btnElim.addEventListener('click', () => {
            // set this as eliminated, clear previous
            if (selectedElim && selectedElim !== name) {
                const prev = grid.querySelector(`.vf-card[data-name="${selectedElim}"]`);
                if (prev) { prev.dataset.isElim = '0'; prev.querySelector('.vf-role-elim').style.background = '#fff'; }
            }
            selectedElim = name;
            // eliminated must be flop: set flop
            card.dataset.isFlop = '1';
            // eliminated cannot be winner or top
            if (selectedWinner === name) selectedWinner = null;
            card.dataset.isTop = '0';
            updateVisual();
        });

        btnTop.addEventListener('click', () => {
            // toggle top; cannot be top if eliminated
            if (selectedElim === name) { showValidationError('A eliminada não pode ser marcada como Top.'); return; }
            card.dataset.isTop = card.dataset.isTop === '1' ? '0' : '1';
            if (card.dataset.isTop === '1') card.dataset.isFlop = '0';
            if (selectedWinner === name) selectedWinner = null;
            updateVisual();
        });

        btnFlop.addEventListener('click', () => {
            // toggle flop; cannot be flop if winner
            if (selectedWinner === name) { showValidationError('O vencedor não pode ser marcado como Flop.'); return; }
            card.dataset.isFlop = card.dataset.isFlop === '1' ? '0' : '1';
            if (card.dataset.isFlop === '1') card.dataset.isTop = '0';
            updateVisual();
        });

        // initial visual
        updateVisual();
    });

    // Confirmar resultados
    document.getElementById('confirm-regular-vf').addEventListener('click', () => submitRegularEpisodeVF(episodeNum));
    return;
}

function submitRegularEpisodeVF(episodeNum) {
    // Coletar seleção do grid VF
    const grid = document.getElementById('vf-grid');
    if (!grid) { showValidationError('Erro interno: grid não encontrado'); return; }

    let champion = null;
    let eliminated = null;
    const tops = [];
    const flops = [];

    grid.querySelectorAll('.vf-card').forEach(card => {
        const name = card.dataset.name;
        const isWinner = card.dataset.isWinner === '1' || card.dataset.isWinner === 'true';
        const isElim = card.dataset.isElim === '1' || card.dataset.isElim === 'true';
        const isTop = card.dataset.isTop === '1' || card.dataset.isTop === 'true';
        const isFlop = card.dataset.isFlop === '1' || card.dataset.isFlop === 'true';

        if (isWinner) champion = name;
        if (isElim) eliminated = name;
        if (isTop) tops.push(name);
        if (isFlop) flops.push(name);
    });

    // Validações mínimas: campeão e eliminada obrigatórios
    if (!champion) { showValidationError('⚠️ Escolha 1 vencedor!'); return; }
    if (!eliminated) { showValidationError('⚠️ Escolha 1 eliminada!'); return; }

    // A eliminada DEVE estar entre os flops (requisito do jogo)
    if (!flops.includes(eliminated)) {
        showValidationError('❌ A eliminada deve ser escolhida entre os participantes marcados como Flop!');
        return;
    }

    // Remover campeão das listas de tops/flps se presente
    const topsFiltered = tops.filter(n => n !== champion && n !== eliminated);
    const flopsFiltered = flops.filter(n => n !== champion);

    // Chamar callback com a estrutura esperada pelo fluxo regular
    window.currentRegularCallback({
        champion,
        tops: topsFiltered,
        flops: flopsFiltered,
        eliminated
    });
}

function showValidationError(message) {
    const mainBlock = document.getElementById('MainBlock');
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px 30px; border-radius: 12px; font-weight: bold; font-size: 1.1em; z-index: 9999; box-shadow: 0 8px 25px rgba(0,0,0,0.3); animation: slideInFromTop 0.5s ease-out;';
    alertDiv.innerHTML = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.4s ease-out';
        setTimeout(() => alertDiv.remove(), 400);
    }, 4000);
}

function showPlayerToast(message) {
    const mainBlock = document.getElementById('MainBlock');
    const toastDiv = document.createElement('div');
    toastDiv.style.cssText = 'position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 18px 30px; border-radius: 12px; font-weight: bold; font-size: 1em; z-index: 9999; box-shadow: 0 8px 25px rgba(0, 184, 148, 0.4); animation: slideInFromBottom 0.5s ease-out;';
    toastDiv.innerHTML = '✅ ' + message;
    document.body.appendChild(toastDiv);

    setTimeout(() => {
        toastDiv.style.animation = 'fadeOut 0.4s ease-out';
        setTimeout(() => toastDiv.remove(), 400);
    }, 3000);
}

function showRegularFinal(finalists, gameMode, stats, eliminatedOrder, finalType, hasRepescagem) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Determinar título baseado em finalType
    let finalTitle = 'TOP 2';
    let finalCount = 2;
    if (finalType === 'top3') {
        finalTitle = 'TOP 3';
        finalCount = 3;
    } else if (finalType === 'top4') {
        finalTitle = 'TOP 4';
        finalCount = 4;
    }
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                🏆 GRANDE FINAL - ${finalTitle} 🏆
            </h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 30px;">✨ FINALISTAS ✨</h2>
                <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-bottom: 30px;">
                    ${finalists.map(f => `
                        <div class="finalist-card" data-name="${f}" style="display:flex;flex-direction:column;align-items:center;gap:12px;background:linear-gradient(135deg,#fff,#f7f7ff);padding:16px;border-radius:14px;min-width:180px;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,0.12);transition:transform 0.2s;">
                            ${participantAvatar(f,90)}
                            <div style="font-weight:700;color:#333;font-size:1.05em;">${f}</div>
                        </div>
                    `).join('')}
                </div>
                
                <p style="font-size: 1.3em; margin-top: 30px;">🎉 Quem será o grande campeão?</p>
            </div>
        </div>
    `;

    // Tornar finalistas clicáveis e exibir botão Campeão após seleção
    (function bindFinalistClicks() {
        const container = document.getElementById('MainBlock');
        const cards = container.querySelectorAll('.finalist-card');
        let selected = null;

        function removeChampionBtn() {
            const ex = document.getElementById('champion-select-btn');
            if (ex) ex.remove();
            cards.forEach(c => c.style.transform = 'scale(1)');
        }

        cards.forEach(card => {
            card.addEventListener('click', () => {
                removeChampionBtn();
                selected = card.dataset.name;
                card.style.transform = 'scale(1.05)';

                // Criar botão Campeão (fixo na parte inferior)
                const btn = document.createElement('button');
                btn.id = 'champion-select-btn';
                btn.textContent = 'Campeão';
                btn.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#ffd54a,#ffb300);padding:14px 28px;border-radius:12px;border:none;font-size:1.2em;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:10001;font-weight:700;';
                btn.onclick = () => {
                    // Ao confirmar, chamar seleção de vencedor
                    selectWinner(selected, finalists, eliminatedOrder, 'regular', stats);
                };

                document.body.appendChild(btn);
            });
        });
    })();
}

// ===== MODO PONTUAÇÃO (8 PARTICIPANTES, 9 EPISÓDIOS) =====
function startScoreMode(participants, gameMode, finalFormat) {
    if (participants.length !== 8) {
        alert('Modo Pontuação requer exatamente 8 participantes!');
        return;
    }
    
    const mainBlock = document.getElementById('MainBlock');
    let currentParticipants = [...participants];
    let episodeNum = 1;
    let stats = initializeStats(participants);
    const MAX_EPISODES = 9;
    // Preparar pool de desafios (Score mode não usa repescagem)
    const baseChallengesScore = CHALLENGE_NAMES.filter(c => !c.toLowerCase().startsWith('repescagem'));
    let scoreChallengePool = shuffleArray(baseChallengesScore);
    function getNextScoreChallenge() {
        if (scoreChallengePool.length === 0) scoreChallengePool = shuffleArray(baseChallengesScore);
        return scoreChallengePool.pop();
    }
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                📊 MODO PONTUAÇÃO 📊
            </h1>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 20px;">📋 Como Funciona:</h2>
                <div style="text-align: left; font-size: 1.1em; line-height: 1.8; max-width: 600px; margin: 0 auto;">
                    <p>✨ Sem eliminações! Todos participam dos 9 desafios</p>
                    <p>🏆 2 Campeãs do episódio = +2 pontos cada</p>
                    <p>➡️ Outros 6 participantes = +1 ponto cada</p>
                    <p>🎯 Após 9 episódios, as 3 melhores disputam a final</p>
                    <p>⚖️ Em caso de empate, você escolhe quem avança!</p>
                </div>
            </div>
            <p style="margin-top: 30px; font-size: 1.2em;">⏳ Iniciando em alguns segundos...</p>
        </div>
    `;
    
    setTimeout(() => executeScoreEpisode(), 3000);
    
    function executeScoreEpisode() {
        if (episodeNum > MAX_EPISODES) {
            // Determinar top 3 com verificação de empate
            const sortedByScore = Object.entries(stats)
                .sort(([, a], [, b]) => b.score - a.score);
            
            const top3Names = sortedByScore.slice(0, 3).map(([name]) => name);
            const thirdScore = sortedByScore[2][1].score;
            
            // Verificar empate na 3ª posição
            const tiedForThird = sortedByScore
                .filter(([, data]) => data.score === thirdScore)
                .map(([name]) => name);
            
            if (tiedForThird.length > 1) {
                // Há empate - jogador escolhe
                showScoreTiebreaker(tiedForThird, top3Names, stats);
            } else {
                // Sem empate - vai direto para final
                showTrackRecordScreen(stats, top3Names, 'score', () => {
                    showScoreFinal(top3Names, gameMode, stats);
                });
            }
            return;
        }
        
        const challengeName = getNextScoreChallenge();
        if (gameMode === 'vf') {
            // VF for Score mode: let player choose TWO campeãs
            const mainBlock = document.getElementById('MainBlock');
            mainBlock.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h2 style="color: #ff4081; font-size: 2.4em; margin-bottom: 6px;">📺 DESAFIO ${episodeNum} — ${challengeName}</h2>
                    <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Escolha as campeãs do desafio</div>
                    <div style="max-width:900px;margin:0 auto;background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 14px; color: white;">
                        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:12px;">
                            ${currentParticipants.map(p => `
                                <button data-participant="${p}" class="score-vf-chooser" style="background:linear-gradient(135deg,#f093fb,#f5576c);border:none;padding:12px;border-radius:10px;color:#fff;display:flex;flex-direction:column;align-items:center;gap:8px;">${participantAvatar(p,56)}<span style=\"font-weight:700;\">${p}</span></button>
                            `).join('')}
                        </div>
                        <div style="text-align:center;"><button id="confirm-score-choice-vf" style="background:#00b894;color:#fff;padding:10px 18px;border-radius:10px;border:none;font-weight:700;">✅ Confirmar 2 Campeãs</button></div>
                    </div>
                </div>
            `;

            let chosen = [];
            document.querySelectorAll('.score-vf-chooser').forEach(btn => {
                btn.addEventListener('click', function() {
                    const name = this.getAttribute('data-participant');
                    if (chosen.includes(name)) {
                        chosen = chosen.filter(x => x !== name);
                        this.style.opacity = '1';
                        this.style.transform = 'scale(1)';
                    } else if (chosen.length < 2) {
                        chosen.push(name);
                        this.style.opacity = '1';
                        this.style.transform = 'scale(1.05)';
                    } else {
                        showPlayerToast('Já selecionou 2 participantes. Desmarque para escolher outro.');
                    }
                });
            });

            document.getElementById('confirm-score-choice-vf').addEventListener('click', () => {
                if (chosen.length !== 2) { showValidationError('Selecione exatamente 2 campeãs!'); return; }
                // Aplicar pontuações
                const [c1, c2] = chosen;
                stats[c1].wins++; stats[c1].score += 2; stats[c1].episodes.push({ type: 'win', points: 2 });
                stats[c2].wins++; stats[c2].score += 2; stats[c2].episodes.push({ type: 'win', points: 2 });
                currentParticipants.filter(p => !chosen.includes(p)).forEach(p => { stats[p].score += 1; stats[p].episodes.push({ type: 'safe', points: 1 }); });

                // Mostrar resultado e então aguardar avanço
                showScoreEpisodeResult(episodeNum, chosen[0], currentParticipants, stats, challengeName, () => {
                    episodeNum++;
                    waitForAdvance('Próximo episódio', () => executeScoreEpisode());
                });
            });

        } else {
            showScoreEpisodeAuto(episodeNum, currentParticipants, stats, challengeName, () => {
                episodeNum++;
                // Avança manualmente para o próximo episódio
                waitForAdvance('Próximo episódio', () => executeScoreEpisode());
            });
        }
    }
}



function showScoreEpisodeAuto(episodeNum, participants, stats, challengeName, callback) {
    const mainBlock = document.getElementById('MainBlock');
    // Preparar dados, mas não aplicar alterações até confirmação final
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const champion1 = shuffled[0];
    const champion2 = shuffled[1];
    const others = shuffled.slice(2);

    const renderOverview = () => {
        mainBlock.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 6px;">📺 EPISÓDIO ${episodeNum} — ${challengeName}</h2>
                <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Prévia do desafio</div>
                <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:18px;">
                    ${participants.map(p => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">${participantAvatar(p,64)}<div style=\"font-weight:700;\">${p}</div></div>`).join('')}
                </div>
                <div style="max-width:720px;margin:0 auto;text-align:left;padding:18px;background:#f7f7f7;border-radius:12px;">
                    <strong>Prévia:</strong>
                    <p style="margin:8px 0 0 0;">As campeãs sugeridas são <strong>${champion1}</strong> e <strong>${champion2}</strong>.</p>
                </div>
            </div>
        `;
    };

    const renderChampions = () => {
        mainBlock.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 20px;">📺 EPISÓDIO ${episodeNum} - CAMPEÃS</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333; padding: 14px; border-radius: 12px; display:flex; align-items:center; gap:12px;">
                        ${participantAvatar(champion1,64)}
                        <div>
                            <p style="font-size: 1.2em; font-weight: bold; margin: 0;">${champion1}</p>
                            <p style="font-size: 1em; margin: 6px 0 0 0;">+2 pontos</p>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333; padding: 14px; border-radius: 12px; display:flex; align-items:center; gap:12px;">
                        ${participantAvatar(champion2,64)}
                        <div>
                            <p style="font-size: 1.2em; font-weight: bold; margin: 0;">${champion2}</p>
                            <p style="font-size: 1em; margin: 6px 0 0 0;">+2 pontos</p>
                        </div>
                    </div>
                </div>
                <div style="border-top: 2px solid rgba(255,255,255,0.3); padding-top: 20px;">
                    <h4 style="color: #C0C0C0; margin-top: 0; margin-bottom: 15px;">➡️ OUTROS PARTICIPANTES</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
                        ${others.map(p => `
                            <div style="background: rgba(255,255,255,0.06); padding: 10px; border-radius: 8px; display:flex; align-items:center; gap:10px;">
                                ${participantAvatar(p,44)}
                                <div>
                                    <p style="margin: 0; font-weight: bold;">${p}</p>
                                    <p style="margin: 6px 0 0 0; color: #FFD700; font-weight: bold;">+1 ponto</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    };

    // Sequência: Overview (Blush not needed here) -> Champions -> aplicar e avançar
        renderOverview();
    waitForAdvance('Avançar', () => {
        renderChampions();
        waitForAdvance('Aplicar resultados', () => {
            // Aplicar pontuações somente aqui
            stats[champion1].wins++;
            stats[champion1].score += 2;
            stats[champion1].episodes.push({ type: 'win', points: 2 });
            stats[champion2].wins++;
            stats[champion2].score += 2;
            stats[champion2].episodes.push({ type: 'win', points: 2 });
            others.forEach(p => {
                stats[p].score += 1;
                stats[p].episodes.push({ type: 'safe', points: 1 });
            });

            // Mostrar resumo de episódio com ranking
            showScoreEpisodeResult(episodeNum, champion1, participants, stats, challengeName, () => {
                // finalizar: chamar callback para continuar o fluxo
                callback({ champion1, champion2 });
            });
        });
    });
}

function showScoreEpisode(episodeNum, participants, gameMode, stats, challengeName, callback) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Allow player to choose champion even when mode is 'aleatorio'.
    if (gameMode === 'aleatorio') {
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const autoChampion = shuffled[0];

        // Render a small chooser with autoChampion preselected but allow player to change
        mainBlock.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #ff4081; font-size: 2.2em; margin-bottom: 6px;">📺 DESAFIO ${episodeNum} — ${challengeName} (Auto: ${autoChampion})</h2>
                <div style="font-size:0.95em;color:#666;margin-bottom:18px;">O sistema sugere uma campeã</div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 16px; color: white; max-width: 700px; margin: 0 auto;">
                    <p style="margin-bottom: 12px;">O sistema sugeriu <strong>${autoChampion}</strong> como campeã. Você pode aceitar ou escolher outra.</p>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin-bottom:12px;">
                        ${participants.map(p => `
                            <button data-participant="${p}" class="score-chooser-btn" 
                                    style="background:${p===autoChampion? 'linear-gradient(135deg,#ffd54a, #ffb300)' : 'linear-gradient(135deg,#f093fb,#f5576c)'}; color:#111; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:10px; justify-content:center;">
                                ${participantAvatar(p,48)}
                                <span style="font-weight:700;">${p}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div style="text-align:center; margin-top:8px;">
                        <button id="confirm-score-choice" style="background: #00b894; color: white; padding: 10px 18px; border-radius: 10px; border:none; font-weight:bold; cursor:pointer;">✅ Confirmar</button>
                    </div>
                </div>
            </div>
        `;

        // Interaction
        let chosen = autoChampion;
        document.querySelectorAll('.score-chooser-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.score-chooser-btn').forEach(b => b.style.opacity = '0.7');
                this.style.opacity = '1';
                chosen = this.getAttribute('data-participant');
            });
        });

        document.getElementById('confirm-score-choice').addEventListener('click', () => {
            // record player pick
            window.playerChampionChoices[chosen] = (window.playerChampionChoices[chosen] || 0) + 1;
            showPlayerToast(`Você escolheu: ${chosen}`);
            // compute result and call callback
            callback(chosen);
        });
        
        return;
    } else {
        // Modo VF
        mainBlock.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 6px;">
                    📺 DESAFIO ${episodeNum} — ${challengeName}
                </h2>
                <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Resumo do desafio</div>
                <div style="font-size:0.95em;color:#666;margin-bottom:18px;">Escolha a campeã do desafio</div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            padding: 35px; border-radius: 20px; color: white;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                        ${participants.map(p => `
                            <button onclick="selectScoreWinner('${p}')" 
                                    style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                                           color: white; border: none; padding: 12px; display:flex; gap:10px; align-items:center; justify-content:center; 
                                           border-radius: 15px; font-size: 1.05em; font-weight: bold; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                                           transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='scale(1.05)'"
                                    onmouseout="this.style.transform='scale(1)'">
                                ${participantAvatar(p,48)}<span style="margin-left:6px;">${p}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        window.currentScoreCallback = callback;
        return;
    }
}

function selectScoreWinner(champion) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:18px;">
                ${participantAvatar(champion,120)}
                <h2 style="color: #ff4081; font-size: 2.2em; margin: 0;">🏆 ${champion} VENCEU! 🏆</h2>
            </div>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        padding: 24px; border-radius: 20px; margin: 30px 0; color: #333; display:inline-block;">
                <p style="font-size: 1.2em; margin: 0; font-weight: bold;">+2 PONTOS! 🎉</p>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 1.1em;">⏳ Próximo desafio em alguns segundos...</p>
        </div>
    `;
    
    // Chamar callback imediatamente; o fluxo de avanço é controlado por waitForAdvance
    window.currentScoreCallback(champion);
}

function showScoreEpisodeResult(episodeNum, champion, participants, stats, challengeName, callback) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 20px;">
                📺 DESAFIO ${episodeNum}
            </h2>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        padding: 18px; border-radius: 20px; margin: 25px 0; color: #333; display:flex; align-items:center; gap:16px; justify-content:center;">
                ${participantAvatar(champion,80)}
                <div>
                    <h3 style="font-size: 1.8em; margin: 0;">${champion}</h3>
                    <p style="font-size: 1.1em; margin: 6px 0 0 0; font-weight: bold;">🥇 VENCEU! +2 PONTOS</p>
                </div>
            </div>
            
            <div style="background: #2c3e50; padding: 25px; border-radius: 15px;">
                <h4 style="color: #ecf0f1; font-size: 1.3em; margin-bottom: 15px;">📊 Ranking Atual:</h4>
                <div style="display: flex; justify-content: center; flex-direction: column; gap: 10px; max-width: 400px; margin: 0 auto;">
                    ${Object.entries(stats)
                        .sort(([, a], [, b]) => b.score - a.score)
                        .map(([name, data], index) => `
                            <div style="background: #34495e; color: #ecf0f1; padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>${index + 1}. ${name}</span>
                                <strong>${data.score} pontos</strong>
                            </div>
                        `).join('')}
                </div>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 1.1em;">Pressione o botão para continuar.</p>
        </div>
    `;
    
    // Não avançar automaticamente; callback é chamado pelo fluxo principal
    callback();
}


function showScoreTiebreaker(tiedParticipants, top3Names, stats) {
    const mainBlock = document.getElementById('MainBlock');
    
    const firstTwo = top3Names.slice(0, 2);
    const tiedList = tiedParticipants;
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                ⚖️ DESEMPATE NA 3ª POSIÇÃO ⚖️
            </h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 15px;">📊 Participantes Empatados</h2>
                <p style="font-size: 1.3em; margin-bottom: 30px;">Os seguintes participantes têm a mesma pontuação:</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    ${tiedList.map(p => `
                        <div style="background: rgba(255, 215, 0, 0.3); padding: 20px; border-radius: 12px;">
                            <p style="margin: 0; font-weight: bold; font-size: 1.2em;">${p}</p>
                            <p style="margin: 8px 0 0 0; color: #FFD700;">⭐ ${stats[p].score} pts</p>
                        </div>
                    `).join('')}
                </div>
                
                <h3 style="color: #FFD700; margin-bottom: 20px;">Quem avança para a FINAL?</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    ${tiedList.map(p => {
                        const finalTop3 = [...firstTwo, p];
                        return `
                            <button onclick="selectFinalTop3('${p}', ${JSON.stringify(finalTop3)}, ${JSON.stringify(stats)})" 
                                    style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                                           color: white; border: none; padding: 20px 30px; 
                                           border-radius: 15px; font-size: 1.2em; font-weight: bold; 
                                           cursor: pointer;
                                           box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                                           transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='scale(1.05)'"
                                    onmouseout="this.style.transform='scale(1)'">
                                👑 ${p}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function selectFinalTop3(chosen, finalTop3, stats) {
    showPlayerToast(`${chosen} foi escolhido(a) para a FINAL!`);
    // stats pode ser passado como string (por JSON.stringify) ou como objeto
    let statsObj = stats;
    try {
        if (typeof stats === 'string') statsObj = JSON.parse(stats);
    } catch (e) {
        console.warn('Não foi possível parsear stats:', e);
    }
    setTimeout(() => {
        showTrackRecordScreen(statsObj, finalTop3, 'score', () => {
            showScoreFinal(finalTop3, 'score', statsObj);
        });
    }, 800);
}

function showScoreFinal(top3, gameMode, stats) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                🏆 GRANDE FINAL - TOP 3 🏆
            </h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 30px;">✨ FINALISTAS ✨</h2>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 30px;">
                    ${top3.map(f => `
                        <div class="finalist-card" data-name="${f}" style="display:flex;flex-direction:column;align-items:center;gap:12px;background:linear-gradient(135deg,#fff,#f7f7ff);padding:16px;border-radius:14px;min-width:180px;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,0.12);transition:transform 0.2s;">
                            ${participantAvatar(f,90)}
                            <div style="font-weight:700;color:#333;font-size:1.05em;">${f}</div>
                        </div>
                    `).join('')}
                </div>
                
                <p style="font-size: 1.3em; margin-top: 30px;">🎉 Quem será a grande campeã?</p>
            </div>
        </div>
    `;

    // Tornar finalistas clicáveis e exibir botão Campeão após seleção
    (function bindFinalistClicks() {
        const container = document.getElementById('MainBlock');
        const cards = container.querySelectorAll('.finalist-card');
        let selected = null;

        function removeChampionBtn() {
            const ex = document.getElementById('champion-select-btn');
            if (ex) ex.remove();
            cards.forEach(c => c.style.transform = 'scale(1)');
        }

        cards.forEach(card => {
            card.addEventListener('click', () => {
                removeChampionBtn();
                selected = card.dataset.name;
                card.style.transform = 'scale(1.05)';

                const btn = document.createElement('button');
                btn.id = 'champion-select-btn';
                btn.textContent = 'Campeão';
                btn.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#ffd54a,#ffb300);padding:14px 28px;border-radius:12px;border:none;font-size:1.2em;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:10001;font-weight:700;';
                btn.onclick = () => {
                    selectWinner(selected, top3, [], 'score', stats);
                };

                document.body.appendChild(btn);
            });
        });
    })();
}

// ===== MODO GRUPOS (12 PARTICIPANTES) =====
function startGroupsMode(participants, gameMode, finalFormat) {
    if (participants.length !== 12) {
        alert('Modo Grupos requer exatamente 12 participantes!');
        return;
    }
    
    const mainBlock = document.getElementById('MainBlock');
    
    // Dividir em 3 grupos
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const groups = [
        shuffled.slice(0, 4),
        shuffled.slice(4, 8),
        shuffled.slice(8, 12)
    ];
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                👥 MODO GRUPOS 👥
            </h1>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 20px;">📋 Como Funciona:</h2>
                <div style="text-align: left; font-size: 1.1em; line-height: 1.8; max-width: 600px; margin: 0 auto;">
                    <p>👥 3 grupos de 4 participantes cada</p>
                    <p>🎯 3 desafios por grupo</p>
                    <p>🏆 Campeã do desafio = +2 pontos</p>
                    <p>➡️ Demais participantes = +1 ponto cada</p>
                    <p>✨ 2 melhores de cada grupo avançam (6 no total)</p>
                    <p>🎊 Fase final com os 6 classificados!</p>
                </div>
            </div>
            <p style="margin-top: 30px; font-size: 1.2em;">⏳ Iniciando em alguns segundos...</p>
        </div>
    `;
    
    setTimeout(() => executeGroupsPhase(groups, gameMode, finalFormat), 3000);
}

function executeGroupsPhase(groups, gameMode, finalFormat) {
    const mainBlock = document.getElementById('MainBlock');
    let groupStats = [
        initializeStats(groups[0]),
        initializeStats(groups[1]),
        initializeStats(groups[2])
    ];
    
    const MAX_CHALLENGES = 3;
    let currentChallenge = 1;
    let currentGroupIndex = 0;
    
    function executeNextChallenge() {
        if (currentChallenge > MAX_CHALLENGES) {
            // Fase de grupos concluída
            finalizaGroupsPhase(groups, groupStats, gameMode, finalFormat);
            return;
        }
        
        if (currentGroupIndex >= 3) {
            currentChallenge++;
            currentGroupIndex = 0;
        }
        
        const currentGroup = groups[currentGroupIndex];
        const currentStats = groupStats[currentGroupIndex];
        const groupName = GROUP_NAMES[currentGroupIndex] || String.fromCharCode(65 + currentGroupIndex); // custom names or A,B,C
        
        showGroupChallenge(currentChallenge, groupName, currentGroup, gameMode, currentStats, (champion) => {
            currentStats[champion].wins++;
            currentStats[champion].score += 2;
            currentStats[champion].episodes.push({ type: 'win', points: 2 });
            
            currentGroup.forEach(p => {
                if (p !== champion) {
                    currentStats[p].score += 1;
                    currentStats[p].episodes.push({ type: 'safe', points: 1 });
                }
            });
            
            currentGroupIndex++;
            // Avançar manualmente entre desafios
            waitForAdvance('Próximo desafio', () => executeNextChallenge());
        });
    }
    
    executeNextChallenge();
}

function showGroupChallenge(challengeNum, groupName, participants, gameMode, stats, callback) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Allow player to override the auto-selection in 'aleatorio' mode by choosing the champion here.
    if (gameMode === 'aleatorio') {
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const autoChampion = shuffled[0];

        mainBlock.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 30px;">
                    🎯 DESAFIO ${challengeNum} - ${groupName}
                </h2>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            padding: 35px; border-radius: 20px; color: white;">
                    <h3 style="margin-bottom: 12px;">Quem foi a CAMPEÃ? (Auto: ${autoChampion})</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom:12px;">
                        ${participants.map(p => `
                            <button data-participant="${p}" class="group-chooser-btn" 
                                    style="background:${p===autoChampion? 'linear-gradient(135deg,#ffd54a,#ffb300)' : 'linear-gradient(135deg,#f093fb,#f5576c)'}; color:#111; border:none; padding:12px; border-radius:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:10px; justify-content:center;">
                                ${participantAvatar(p,48)}
                                <span style="font-weight:700;">${p}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div style="text-align:center;">
                        <button id="confirm-group-choice" style="background: #00b894; color: white; padding: 10px 18px; border-radius: 10px; border:none; font-weight:bold; cursor:pointer;">✅ Confirmar Campeã</button>
                    </div>
                </div>
            </div>
        `;

        let chosen = autoChampion;
        document.querySelectorAll('.group-chooser-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.group-chooser-btn').forEach(b => b.style.opacity = '0.75');
                this.style.opacity = '1';
                chosen = this.getAttribute('data-participant');
            });
        });

        document.getElementById('confirm-group-choice').addEventListener('click', () => {
            window.playerChampionChoices[chosen] = (window.playerChampionChoices[chosen] || 0) + 1;
            showPlayerToast(`Você escolheu: ${chosen}`);
            // proceed to show result
            showGroupChallengeResult(challengeNum, groupName, chosen, participants, stats, () => {
                callback(chosen);
            });
        });

        return;
    } else {
        mainBlock.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 30px;">
                    🎯 DESAFIO ${challengeNum} - ${groupName}
                </h2>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            padding: 35px; border-radius: 20px; color: white;">
                    <h3 style="margin-bottom: 25px;">Quem foi a CAMPEÃ?</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        ${participants.map(p => `
                            <button onclick="selectGroupWinner('${p}')" 
                                    style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                                           color: white; border: none; padding: 12px; display:flex; gap:10px; align-items:center; justify-content:center; 
                                           border-radius: 15px; font-size: 1.05em; font-weight: bold; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                                           transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='scale(1.05)'"
                                    onmouseout="this.style.transform='scale(1)'">
                                ${participantAvatar(p,48)}<span style="margin-left:6px;">${p}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        window.currentGroupCallback = callback;
        return;
    }
}

function selectGroupWinner(champion) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #ff4081; font-size: 3em; margin-bottom: 30px;">
                🏆 ${champion.toUpperCase()} VENCEU! 🏆
            </h2>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: #333;">
                <p style="font-size: 1.5em; margin: 0; font-weight: bold;">+2 PONTOS! 🎉</p>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 1.1em;">⏳ Próximo desafio em alguns segundos...</p>
        </div>
    `;
    
    // Chamar callback imediatamente; avanço é feito pelo waitForAdvance no fluxo principal
    window.currentGroupCallback(champion);
}

function showGroupChallengeResult(challengeNum, groupName, champion, participants, stats, callback) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 20px;">
                🎯 DESAFIO ${challengeNum} - ${groupName}
            </h2>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        padding: 35px; border-radius: 20px; margin: 25px 0; color: #333;">
                <h3 style="font-size: 2.2em; margin-bottom: 10px;">👑 ${champion.toUpperCase()}</h3>
                <p style="font-size: 1.3em; margin: 0; font-weight: bold;">🥇 VENCEU! +2 PONTOS</p>
            </div>
            
            <div style="background: #2c3e50; padding: 25px; border-radius: 15px;">
                <h4 style="color: #ecf0f1; font-size: 1.3em; margin-bottom: 15px;">📊 Ranking do Grupo:</h4>
                <div style="display: flex; justify-content: center; flex-direction: column; gap: 10px; max-width: 400px; margin: 0 auto;">
                    ${Object.entries(stats)
                        .sort(([, a], [, b]) => b.score - a.score)
                        .map(([name, data], index) => `
                            <div style="background: #34495e; color: #ecf0f1; padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>${index + 1}. ${name}</span>
                                <strong>${data.score} pontos</strong>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Não avançar automaticamente; callback é chamado imediatamente e o fluxo usa waitForAdvance
    callback();
}

function finalizaGroupsPhase(groups, groupStats, gameMode, finalFormat) {
    const mainBlock = document.getElementById('MainBlock');

    // Process groups sequentially to resolve any ties for the top-2
    const classified = [];

    function processGroup(i) {
        if (i >= groups.length) {
            // Todas processadas — mostrar classificados e avançar para a final
            mainBlock.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px;">
                        ✨ FASE DE GRUPOS CONCLUÍDA ✨
                    </h1>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                        <h2 style="font-size: 2.2em; margin-bottom: 30px; color: #FFD700;">🚀 CLASSIFICADOS PARA A FASE FINAL</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            ${classified.map(p => `
                                <div style="background: rgba(255, 215, 0, 0.3); padding: 20px; border-radius: 15px; font-weight: bold; font-size: 1.1em;">
                                    👑 ${p}
                                </div>
                            `).join('')}
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 1.3em;">🎊 Agora será disputada a FASE FINAL no formato Regular!</p>
                    </div>
                    
                    <button id="start-final-from-groups" 
                            style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); 
                                   color: white; border: none; padding: 20px 50px; font-size: 1.3em; 
                                   border-radius: 15px; cursor: pointer; font-weight: bold; margin-top: 30px;
                                   box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: all 0.3s ease;"
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                        🏁 Iniciar Fase Final
                    </button>
                </div>
            `;

            document.getElementById('start-final-from-groups').addEventListener('click', () => {
                startRegularMode(classified, gameMode, finalFormat, 'nao');
            });

            return;
        }

        const stats = groupStats[i];
        const sorted = Object.entries(stats).sort(([, a], [, b]) => b.score - a.score);

        // Determinar se há empate que afeta a 2ª posição
        const secondScore = sorted[1][1].score;
        const secured = sorted.filter(([, d]) => d.score > secondScore).map(([name]) => name);
        const tied = sorted.filter(([, d]) => d.score === secondScore).map(([name]) => name);
        const numToChoose = 2 - secured.length;

        if (tied.length > numToChoose) {
            // Precisamos de desempate entre os 'tied' para preencher 'numToChoose' vagas
            showGroupTiebreaker(i, tied, numToChoose, stats, (chosen) => {
                classified.push(...secured, ...chosen);
                processGroup(i + 1);
            });
        } else {
            // Sem empate crítico, pegar top2
            const top2 = sorted.slice(0, 2).map(([name]) => name);
            classified.push(...top2);
            processGroup(i + 1);
        }
    }

    // Iniciar processamento do primeiro grupo
    processGroup(0);
}

// Mostra UI para desempate de um grupo: escolher 'slots' participantes entre 'tiedList'
function showGroupTiebreaker(groupIndex, tiedList, slots, stats, callback) {
    const mainBlock = document.getElementById('MainBlock');
    const groupLabel = GROUP_NAMES[groupIndex] || `GRUPO ${String.fromCharCode(65 + groupIndex)}`;
    mainBlock.innerHTML = `
        <div style="text-align:center;padding:36px;">
            <h2 style="color:#ff4081;font-size:2.4em;margin-bottom:20px;">⚖️ DESEMPATE - ${groupLabel}</h2>
            <p style="margin-bottom:18px;">Escolha <strong>${slots}</strong> participante(s) para avançar.</p>
            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                ${tiedList.map(p => `<div class=\"tiebreak-card\" data-name=\"${p}\" style=\"display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;padding:12px;border-radius:10px;background:linear-gradient(135deg,#fff,#f7f7ff);\">${participantAvatar(p,72)}<div style=\"font-weight:700;\">${p}</div></div>`).join('')}
            </div>
            <div style="text-align:center;"><button id=\"confirm-tiebreak\" disabled style=\"background:#00b894;color:#fff;padding:10px 18px;border-radius:10px;border:none;font-weight:700;cursor:pointer;\">✅ Confirmar</button></div>
        </div>
    `;

    const chosen = new Set();
    document.querySelectorAll('.tiebreak-card').forEach(card => {
        card.addEventListener('click', function() {
            const name = this.dataset.name;
            if (chosen.has(name)) {
                chosen.delete(name);
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
            } else {
                if (chosen.size < slots) {
                    chosen.add(name);
                    this.style.transform = 'scale(1.05)';
                    this.style.opacity = '1';
                } else {
                    showPlayerToast('Já selecionou o número de participantes necessários.');
                }
            }
            document.getElementById('confirm-tiebreak').disabled = chosen.size !== slots;
        });
    });

    document.getElementById('confirm-tiebreak').addEventListener('click', () => {
        const chosenArr = Array.from(chosen);
        callback(chosenArr);
    }, { once: true });
}

// ===== FUNÇÃO AUXILIAR =====
function initializeStats(participants) {
    const stats = {};
    participants.forEach(p => {
        stats[p] = {
            wins: 0,
            tops: 0,
            safe: 0,
            flops: 0,
            eliminated: 0,
            score: 0,
            episodes: [] // Array para rastrear resultados por episódio
        };
    });
    return stats;
}

// ===== TELA DE TRACK RECORD PRÉ-FINAL =====
function showTrackRecordScreen(stats, finalists, modeType, callback) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Cores para cada tipo de resultado
    const colors = {
        win: '#1e40af',        // Azul
        top: '#87ceeb',        // Azul bebê
        safe: '#22c55e',       // Verde
        flop: '#ff8c00',       // Laranja
        eliminated: '#dc2626'  // Vermelho
    };
    
    // Encontrar caminho relativo das fotos baseado no participante
    function getPhotoPath(participantName) {
        // Usar o mapeamento global de participantes
        return PARTICIPANT_PHOTOS[participantName] || null;
    }
    
    // Ordenar participantes: finalistas no topo, depois os outros, eliminados por último
    const sorted = Object.entries(stats).sort(([nameA, dataA], [nameB, dataB]) => {
        const aIsFinalista = finalists.includes(nameA);
        const bIsFinalista = finalists.includes(nameB);
        
        // Finalistas primeiro
        if (aIsFinalista && !bIsFinalista) return -1;
        if (!aIsFinalista && bIsFinalista) return 1;
        
        // Entre finalistas ou entre não-finalistas, ordenar por score
        return dataB.score - dataA.score;
    });
    
    // Número máximo de episódios
    const maxEpisodes = Math.max(...sorted.map(([, data]) => data.episodes.length));
    
    // Criar cabeçalhos de episódios
    let episodeHeaders = '';
    for (let i = 1; i <= maxEpisodes; i++) {
        episodeHeaders += `<th style="padding: 12px 8px; text-align: center; background: rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.2);">EP ${i}</th>`;
    }
    
    // Criar linhas da tabela
    let tableRows = '';
    sorted.forEach(([name, data], index) => {
        const isFinalista = finalists.includes(name);
        const photoPath = getPhotoPath(name);
        
        let episodesHTML = '';
        for (let i = 0; i < maxEpisodes; i++) {
            if (data.episodes[i]) {
                const ep = data.episodes[i];
                const bgColor = colors[ep.type];
                const typeLabel = {
                    'win': 'W',
                    'top': 'T',
                    'safe': 'S',
                    'flop': 'F',
                    'eliminated': 'E'
                }[ep.type];
                
                episodesHTML += `<td style="padding: 10px 8px; text-align: center; background: ${bgColor}; color: white; font-weight: bold; border-right: 1px solid rgba(255,255,255,0.2); cursor: help;" title="${ep.type}: ${ep.points} pontos">${typeLabel}</td>`;
            } else {
                episodesHTML += `<td style="padding: 10px 8px; text-align: center; background: rgba(0,0,0,0.3); border-right: 1px solid rgba(255,255,255,0.2);"></td>`;
            }
        }
        
        const bgStyle = isFinalista ? 'background: rgba(255,215,0,0.15); border-left: 4px solid #FFD700;' : 'background: transparent;';
        const medallion = isFinalista ? '⭐' : '✨';
        
        tableRows += `
            <tr style="${bgStyle} border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px; text-align: center; min-width: 40px;">${medallion}</td>
                <td style="padding: 12px; display: flex; align-items: center; gap: 12px; min-width: 220px;">
                    ${photoPath ? `<img src="${photoPath}" alt="${name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #ecf0f1;">` : `<div style="width: 50px; height: 50px; border-radius: 50%; background: #667eea; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em;">${name.charAt(0)}</div>`}
                    <span style="font-weight: bold; color: ${isFinalista ? '#FFD700' : '#ecf0f1'};">${name}</span>
                </td>
                ${episodesHTML}
                <td style="padding: 12px; text-align: center; font-weight: bold; background: rgba(255,215,0,0.2); color: #FFD700; min-width: 80px; border-left: 2px solid #FFD700;">${data.score.toFixed(1)} pts</td>
            </tr>
        `;
    });
    
    mainBlock.innerHTML = `
        <div style="padding: 20px;">
            <h1 style="color: #ff4081; font-size: 3em; text-align: center; margin-bottom: 10px;">
                📊 TRACK RECORD DA TEMPORADA 📊
            </h1>
            <p style="color: #999; text-align: center; font-size: 1em; margin-bottom: 30px;">
                Desempenho de todos os participantes - Clique em um episódio para ver detalhes
            </p>
            
            <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); margin-bottom: 30px;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; color: white;">
                        <thead>
                            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                                <th style="padding: 15px; text-align: center; min-width: 40px;">🏅</th>
                                <th style="padding: 15px; text-align: left; min-width: 220px; border-right: 2px solid rgba(255,255,255,0.3);">Participante</th>
                                ${episodeHeaders}
                                <th style="padding: 15px; text-align: center; background: rgba(255,215,0,0.3); border-left: 2px solid rgba(255,255,255,0.3);">PPE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin-bottom: 30px; color: white;">
                <p style="font-size: 1.1em; margin-bottom: 15px; font-weight: bold;">📋 Legenda de Cores:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #1e40af; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em;">W</div>
                        <span>Vitória (Azul)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #87ceeb; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #333; font-weight: bold; font-size: 0.9em;">T</div>
                        <span>Bom (Azul Bebê)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #22c55e; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em;">S</div>
                        <span>Salvo (Verde)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #ff8c00; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em;">F</div>
                        <span>Flop (Laranja)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #dc2626; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em;">E</div>
                        <span>Eliminado (Vermelho)</span>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="goToFinal()" 
                        style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                               color: white; border: none; padding: 18px 50px; font-size: 1.2em; 
                               border-radius: 15px; cursor: pointer; font-weight: bold;
                               box-shadow: 0 8px 25px rgba(0,0,0,0.3); transition: all 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'">
                    🏆 IR PARA A FINAL 🏆
                </button>
            </div>
        </div>
    `;
    
    // Armazenar o callback para usar quando clicar em "IR PARA A FINAL"
    window.trackRecordCallback = callback;
}

// ===== FUNÇÃO DE TRACK RECORD DETALHADO =====
function generateDetailedTrackRecord(stats) {
    const sorted = Object.entries(stats)
        .sort(([, a], [, b]) => b.score - a.score);
    
    return `
        <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px; border-radius: 20px; margin-top: 30px; color: white;">
            <h4 style="font-size: 1.8em; margin-bottom: 25px; color: #FFD700; text-align: center;">
                📊 TRACK RECORD DETALHADO
            </h4>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="background: rgba(255, 215, 0, 0.2); border-bottom: 2px solid #FFD700;">
                            <th style="padding: 15px; text-align: center;">🏅</th>
                            <th style="padding: 15px;">Participante</th>
                            <th style="padding: 15px; text-align: center;">🥇 Wins</th>
                            <th style="padding: 15px; text-align: center;">🥈 Tops</th>
                            <th style="padding: 15px; text-align: center;">➡️ Safe</th>
                            <th style="padding: 15px; text-align: center;">📉 Flops</th>
                            <th style="padding: 15px; text-align: center;">❌ Elim</th>
                            <th style="padding: 15px; text-align: center;">⭐ Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map(([name, data], index) => {
                            let medal = '';
                            if (index === 0) medal = '🥇';
                            else if (index === 1) medal = '🥈';
                            else if (index === 2) medal = '🥉';
                            else medal = '✨';
                            
                            return `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); background: ${index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent'};">
                                    <td style="padding: 12px; text-align: center; font-size: 1.3em;">${medal}</td>
                                    <td style="padding: 12px; font-weight: bold;">${name}</td>
                                    <td style="padding: 12px; text-align: center;">${data.wins}</td>
                                    <td style="padding: 12px; text-align: center;">${data.tops}</td>
                                    <td style="padding: 12px; text-align: center;">${data.safe}</td>
                                    <td style="padding: 12px; text-align: center;">${data.flops}</td>
                                    <td style="padding: 12px; text-align: center;">${data.eliminated}</td>
                                    <td style="padding: 12px; text-align: center; font-weight: bold; color: #FFD700;">${data.score.toFixed(1)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 25px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                ${sorted.slice(0, 3).map(([name, data], index) => {
                    const titles = ['🥇 Campeão', '🥈 Vice-campeão', '🥉 Terceiro'];
                    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                    return `
                        <div style="background: rgba(${index === 0 ? '255,215,0' : index === 1 ? '192,192,192' : '205,127,50'}, 0.2); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid ${colors[index]};">
                            <div style="font-size: 2em; margin-bottom: 10px;">${titles[index]}</div>
                            <div style="font-weight: bold; font-size: 1.2em;">${name}</div>
                            <div style="color: #FFD700; font-weight: bold; margin-top: 10px;">${data.score.toFixed(1)} pontos</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ===== SELEÇÃO DE VENCEDOR FINAL =====
function selectWinner(winner, finalists, eliminated, mode, stats) {
    const mainBlock = document.getElementById('MainBlock');
    
    const allParticipants = [...finalists, ...eliminated];
    const ranking = Object.entries(stats)
        .sort(([, a], [, b]) => b.score - a.score)
        .map(([name]) => name);
    
    let placementText = '';
    if (finalists.length === 2) {
        placementText = `
            <div style="margin: 20px 0;">
                <div style="background: #FFD700; color: #333; padding: 20px; border-radius: 15px; margin: 15px 0; font-weight: bold; font-size: 1.3em;">
                    🥇 1º Lugar: ${winner}
                </div>
                <div style="background: #C0C0C0; color: #333; padding: 15px; border-radius: 15px; margin: 15px 0; font-weight: bold; font-size: 1.2em;">
                    🥈 2º Lugar: ${finalists.find(f => f !== winner)}
                </div>
            </div>
        `;
    } else if (finalists.length === 3) {
        placementText = `
            <div style="margin: 20px 0;">
                <div style="background: #FFD700; color: #333; padding: 20px; border-radius: 15px; margin: 15px 0; font-weight: bold; font-size: 1.3em;">
                    🥇 1º Lugar: ${winner}
                </div>
                <div style="background: #C0C0C0; color: #333; padding: 15px; border-radius: 15px; margin: 15px 0; font-weight: bold;">
                    🥈 2º Lugar: ${finalists.find((f, i) => f !== winner && i !== finalists.indexOf(winner))}
                </div>
                <div style="background: #CD7F32; color: white; padding: 15px; border-radius: 15px; margin: 15px 0; font-weight: bold;">
                    🥉 3º Lugar: ${finalists.find((f, i) => f !== winner && i !== finalists.indexOf(finalists.find((f2, i2) => f2 !== winner && i2 !== finalists.indexOf(winner))))}
                </div>
            </div>
        `;
    }
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 4em; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
                🏆 PARABÉNS! 🏆
            </h1>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        padding: 50px; border-radius: 25px; margin: 30px 0; color: #333; 
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h2 style="font-size: 3.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                    👑 ${winner.toUpperCase()} 👑
                </h2>
                <h3 style="font-size: 2em; margin-bottom: 15px;">
                    🎉 GRANDE CAMPEÃO! 🎉
                </h3>
                <p style="font-size: 1.4em; font-weight: bold;">
                    ✨ Parabéns pela vitória incrível! ✨
                </p>
            </div>
            
            ${placementText}
            
            <div style="background: #2c3e50; padding: 30px; border-radius: 15px; margin-top: 30px; color: #ecf0f1;">
                <h4 style="font-size: 1.6em; margin-bottom: 20px; color: #3498db;">
                    📊 Ranking Final Simplificado:
                </h4>
                <div style="display: flex; justify-content: center; flex-direction: column; gap: 12px; max-width: 500px; margin: 0 auto;">
                    ${ranking.slice(0, 5).map((name, index) => `
                        <div style="background: #34495e; padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold;">${index + 1}. ${name}</span>
                            <span style="color: #FFD700; font-weight: bold;">${stats[name].score.toFixed(1)} pts</span>
                        </div>
                    `).join('')}
                    ${ranking.length > 5 ? `<div style="color: #999; padding: 10px; text-align: center;">... mais ${ranking.length - 5} participantes</div>` : ''}
                </div>
            </div>
            
            ${generateDetailedTrackRecord(stats)}
            
            <button onclick="location.reload()" 
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; border: none; padding: 20px 50px; font-size: 1.3em; 
                           border-radius: 15px; cursor: pointer; font-weight: bold; margin-top: 30px;
                           box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: all 0.3s ease;"
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'">
                🔄 Nova Simulação
            </button>
        </div>
    `;
}

function goToFinal() {
    // Chamar o callback armazenado quando o usuário clicar em "IR PARA A FINAL"
    if (window.trackRecordCallback) {
        window.trackRecordCallback();
    }
}
