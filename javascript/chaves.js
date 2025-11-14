// Sistema do Modo Chaves
function startChavesMode(participants) {
    if (participants.length !== 12) {
        alert('O Modo Chaves precisa de exatamente 12 participantes!');
        return;
    }
    
    // Embaralhar participantes
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
    
    // Dividir em 3 chaves de 4 participantes cada
    const chaves = [
        shuffledParticipants.slice(0, 4),   // Chave A
        shuffledParticipants.slice(4, 8),   // Chave B
        shuffledParticipants.slice(8, 12)   // Chave C
    ];
    
    // Inicializar pontuações
    const scores = {};
    participants.forEach(p => scores[p] = 0);
    
    let currentChave = 0;
    let currentEpisode = 1;
    
    showChavesIntro(chaves);
    
    setTimeout(() => {
        executeChaveEpisode(chaves, scores, currentChave, currentEpisode);
    }, 3000);
}

function showChavesIntro(chaves) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🏆 MODO CHAVES INICIADO! 🏆
            </h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h2 style="font-size: 2em; margin-bottom: 30px;">
                    📋 DIVISÃO DAS CHAVES
                </h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 30px;">
                    ${chaves.map((chave, index) => `
                        <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; backdrop-filter: blur(10px);">
                            <h3 style="font-size: 1.8em; margin-bottom: 20px; color: #FFD700;">
                                ⭐ CHAVE ${String.fromCharCode(65 + index)}
                            </h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${chave.map(participant => `
                                    <div style="background: rgba(255,255,255,0.3); padding: 12px 20px; 
                                                border-radius: 10px; font-weight: bold; font-size: 1.1em;">
                                        ✨ ${participant}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; margin-top: 30px;">
                    <h3 style="font-size: 1.5em; margin-bottom: 15px; color: #FFD700;">
                        📖 COMO FUNCIONA:
                    </h3>
                    <div style="text-align: left; font-size: 1.1em; line-height: 1.8;">
                        <p>🎯 <strong>Cada chave disputa 3 episódios</strong></p>
                        <p>🏆 <strong>Campeão do episódio = +3 pontos</strong></p>
                        <p>💔 <strong>Perdedores = +1 ponto cada</strong></p>
                        <p>📊 <strong>Os 2 com MAIS pontos de cada chave se classificam</strong></p>
                        <p>🚀 <strong>6 classificados disputam a Fase Final</strong></p>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; color: #666; font-size: 1.2em;">
                ⏳ Iniciando primeira chave em alguns segundos...
            </div>
        </div>
    `;
}

function executeChaveEpisode(chaves, scores, chaveIndex, episode) {
    const chaveAtual = chaves[chaveIndex];
    const chaveNome = String.fromCharCode(65 + chaveIndex); // A, B, C
    
    // Selecionar campeão aleatoriamente
    const campeao = chaveAtual[Math.floor(Math.random() * chaveAtual.length)];
    
    // Adicionar pontos
    chaveAtual.forEach(participant => {
        if (participant === campeao) {
            scores[participant] += 3; // Campeão ganha 3 pontos
        } else {
            scores[participant] += 1; // Perdedores ganham 1 ponto cada
        }
    });
    
    showChaveEpisodeResult(chaveNome, episode, chaveAtual, campeao, scores);
    
    // Determinar próximo passo
    if (episode < 3) {
        // Próximo episódio da mesma chave
        setTimeout(() => {
            executeChaveEpisode(chaves, scores, chaveIndex, episode + 1);
        }, 3000);
    } else if (chaveIndex < 2) {
        // Próxima chave
        setTimeout(() => {
            executeChaveEpisode(chaves, scores, chaveIndex + 1, 1);
        }, 3000);
    } else {
        // Todas as chaves terminaram - mostrar resultados finais
        setTimeout(() => {
            showChavesResults(chaves, scores);
        }, 3000);
    }
}

function showChaveEpisodeResult(chaveNome, episode, participants, campeao, scores) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Calcular pontuações atuais da chave
    const chaveScores = participants.map(p => ({
        name: p,
        points: scores[p],
        isWinner: p === campeao
    })).sort((a, b) => b.points - a.points); // Ordenar por pontos (MAIS pontos = melhor)
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 20px;">
                🏆 CHAVE ${chaveNome} - EPISÓDIO ${episode}
            </h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 35px; border-radius: 20px; margin: 25px 0; color: white;">
                <h3 style="font-size: 2.2em; margin-bottom: 25px; color: #FFD700;">
                    👑 ${campeao.toUpperCase()} VENCEU!
                </h3>
                <p style="font-size: 1.3em; margin-bottom: 25px;">
                    🎉 Ganhou +3 pontos! Os outros ganharam +1 ponto cada.
                </p>
                
                <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; margin: 20px 0;">
                    <h4 style="font-size: 1.6em; margin-bottom: 20px;">
                        📊 PONTUAÇÃO ATUAL DA CHAVE ${chaveNome}:
                    </h4>
                    <div style="display: grid; gap: 12px;">
                        ${chaveScores.map((participant, index) => {
                            // Determinar cor baseada na posição (mais pontos = melhor)
                            let bgColor = 'rgba(255,255,255,0.2)';
                            let borderColor = '';
                            let positionIcon = `${index + 1}º`;
                            
                            if (index === 0) { // 1º lugar (mais pontos)
                                bgColor = 'rgba(76, 175, 80, 0.4)';
                                borderColor = 'border: 2px solid #4CAF50;';
                                positionIcon = '🥇';
                            } else if (index === 1) { // 2º lugar
                                bgColor = 'rgba(255, 193, 7, 0.4)';
                                borderColor = 'border: 2px solid #ffc107;';
                                positionIcon = '🥈';
                            } else if (index === 2) { // 3º lugar
                                bgColor = 'rgba(255, 152, 0, 0.4)';
                                borderColor = 'border: 2px solid #ff9800;';
                                positionIcon = '🥉';
                            } else { // 4º lugar (menos pontos)
                                bgColor = 'rgba(244, 67, 54, 0.4)';
                                borderColor = 'border: 2px solid #f44336;';
                                positionIcon = '4º';
                            }
                            
                            if (participant.isWinner) {
                                bgColor = 'rgba(76, 175, 80, 0.6)';
                                borderColor = 'border: 3px solid #4CAF50;';
                            }
                            
                            return `
                                <div style="background: ${bgColor}; 
                                            padding: 15px 25px; border-radius: 12px; 
                                            display: flex; justify-content: space-between; align-items: center;
                                            ${borderColor}">
                                    <div style="font-weight: bold; font-size: 1.2em;">
                                        ${participant.isWinner ? '🏆' : positionIcon} ${participant.name}
                                        ${participant.isWinner ? ' (CAMPEÃO)' : ''}
                                    </div>
                                    <div style="background: ${participant.points >= 6 ? '#4CAF50' : participant.points >= 3 ? '#ff9800' : '#666'}; 
                                                color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold;">
                                        ${participant.points} ${participant.points === 1 ? 'ponto' : 'pontos'}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                        <p style="font-size: 1.1em; margin-bottom: 10px;">
                            💡 <strong>Lembre-se:</strong> MAIS pontos = melhor posição!
                        </p>
                        <p style="font-size: 1em; opacity: 0.9;">
                            🥇🥈 Os 2 primeiros colocados (mais pontos) se classificam para a Fase Final
                        </p>
                    </div>
                </div>
                
                ${episode === 3 ? `
                    <div style="background: rgba(255, 193, 7, 0.3); padding: 20px; border-radius: 12px; margin-top: 20px; border: 2px solid #ffc107;">
                        <h4 style="color: #FFD700; font-size: 1.4em; margin-bottom: 10px;">
                            🏁 CHAVE ${chaveNome} FINALIZADA!
                        </h4>
                        <p style="font-size: 1.1em;">
                            Aguarde os resultados finais da chave...
                        </p>
                    </div>
                ` : `
                    <div style="margin-top: 25px; font-size: 1.1em; opacity: 0.9;">
                        ⏳ Próximo episódio da Chave ${chaveNome} em alguns segundos...
                    </div>
                `}
            </div>
        </div>
    `;
}

function showChavesResults(chaves, scores) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Calcular resultados de cada chave
    const chavesResults = chaves.map((chave, index) => {
        const chaveNome = String.fromCharCode(65 + index);
        const chaveScores = chave.map(p => ({
            name: p,
            points: scores[p]
        })).sort((a, b) => b.points - a.points); // Ordenar por pontos (MAIS = melhor)
        
        const classificados = chaveScores.slice(0, 2); // 2 primeiros (mais pontos)
        const eliminados = chaveScores.slice(2, 4);   // 2 últimos (menos pontos)
        
        return {
            nome: chaveNome,
            classificados,
            eliminados,
            todos: chaveScores
        };
    });
    
    // Coletar todos os classificados
    const todosClassificados = chavesResults.flatMap(chave => 
        chave.classificados.map(p => p.name)
    );
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.2em; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🏆 RESULTADOS FINAIS DAS CHAVES 🏆
            </h1>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; margin: 30px 0;">
                ${chavesResults.map(chave => `
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                padding: 30px; border-radius: 20px; color: white;">
                        <h2 style="font-size: 2em; margin-bottom: 25px; color: #FFD700;">
                            ⭐ CHAVE ${chave.nome}
                        </h2>
                        
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: #4CAF50; font-size: 1.4em; margin-bottom: 15px;">
                                ✅ CLASSIFICADOS (MAIS PONTOS):
                            </h3>
                            ${chave.classificados.map((p, index) => `
                                <div style="background: rgba(76, 175, 80, 0.3); padding: 12px 20px; 
                                            border-radius: 10px; margin: 8px 0; font-weight: bold; font-size: 1.1em;
                                            border: 2px solid #4CAF50;">
                                    ${index === 0 ? '🥇' : '🥈'} ${p.name} (${p.points} ${p.points === 1 ? 'ponto' : 'pontos'})
                                </div>
                            `).join('')}
                        </div>
                        
                        <div>
                            <h3 style="color: #f44336; font-size: 1.4em; margin-bottom: 15px;">
                                ❌ ELIMINADOS (MENOS PONTOS):
                            </h3>
                            ${chave.eliminados.map((p, index) => `
                                <div style="background: rgba(244, 67, 54, 0.3); padding: 12px 20px; 
                                            border-radius: 10px; margin: 8px 0; font-weight: bold; font-size: 1.1em;
                                            border: 2px solid #f44336;">
                                    ${index === 0 ? '🥉' : '4º'} ${p.name} (${p.points} ${p.points === 1 ? 'ponto' : 'pontos'})
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h2 style="font-size: 2.5em; margin-bottom: 25px; color: #FFD700;">
                    🚀 CLASSIFICADOS PARA A FASE FINAL
                </h2>
                <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-bottom: 25px;">
                    ${todosClassificados.map(nome => `
                        <div style="background: rgba(255,255,255,0.3); padding: 15px 25px; 
                                    border-radius: 15px; font-weight: bold; font-size: 1.2em;
                                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                            👑 ${nome}
                        </div>
                    `).join('')}
                </div>
                
                <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px;">
                    <h4 style="color: #FFD700; font-size: 1.5em; margin-bottom: 15px;">
                        🎯 PRÓXIMA FASE:
                    </h4>
                    <p style="font-size: 1.2em; margin-bottom: 20px;">
                        Os 6 classificados agora disputarão a Fase Final no formato tradicional!
                    </p>
                    <button onclick="startChavesFinalPhase(['${todosClassificados.join("','")}'])" 
                            style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); 
                                   color: white; border: none; padding: 18px 40px; font-size: 1.3em; 
                                   border-radius: 15px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: all 0.3s ease;"
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                        🏁 Iniciar Fase Final
                    </button>
                </div>
            </div>
            
            <div style="background: #2c3e50; padding: 25px; border-radius: 15px; margin-top: 25px;">
                <h4 style="color: #ecf0f1; font-size: 1.4em; margin-bottom: 15px;">
                    📊 Estatísticas das Chaves:
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <div style="background: #34495e; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #3498db; font-weight: bold;">Total de Episódios</div>
                        <div style="color: #ecf0f1; font-size: 1.5em;">9</div>
                    </div>
                    <div style="background: #34495e; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #e74c3c; font-weight: bold;">Eliminados</div>
                        <div style="color: #ecf0f1; font-size: 1.5em;">6</div>
                    </div>
                    <div style="background: #34495e; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #f39c12; font-weight: bold;">Classificados</div>
                        <div style="color: #ecf0f1; font-size: 1.5em;">6</div>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-top: 20px;">
                    <h5 style="color: #FFD700; font-size: 1.2em; margin-bottom: 10px;">
                        🏆 Sistema de Pontuação Final:
                    </h5>
                    <div style="text-align: left; font-size: 1em; line-height: 1.6;">
                        <p>👑 <strong>Campeões ganharam:</strong> +3 pontos por vitória</p>
                        <p>💔 <strong>Perdedores ganharam:</strong> +1 ponto por episódio</p>
                        <p>📊 <strong>Classificação:</strong> Os 2 com MAIS pontos de cada chave</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function startChavesFinalPhase(participants) {
    // Iniciar fase final com os 6 classificados
    let remainingParticipants = [...participants];
    let eliminatedParticipants = [];
    let episodeCount = 1;
    
    // Executar episódios até chegar ao Top 2
    function executeFinalEpisode() {
        if (remainingParticipants.length <= 2) {
            // Chegou ao Top 2 - mostrar final
            showFinalResults(remainingParticipants, 'top2', eliminatedParticipants, true);
            return;
        }
        
        // Selecionar campeão e eliminado
        const campeao = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)];
        const availableForElimination = remainingParticipants.filter(p => p !== campeao);
        const eliminado = availableForElimination[Math.floor(Math.random() * availableForElimination.length)];
        
        // Mostrar resultado do episódio
        showChavesFinalEpisodeResult(episodeCount, remainingParticipants, campeao, eliminado);
        
        // Atualizar listas
        remainingParticipants = remainingParticipants.filter(p => p !== eliminado);
        eliminatedParticipants.unshift(eliminado); // Adicionar no início (ordem de eliminação)
        episodeCount++;
        
        // Próximo episódio
        setTimeout(() => {
            executeFinalEpisode();
        }, 3000);
    }
    
    // Mostrar introdução da fase final
    showChavesFinalIntro(participants);
    
    setTimeout(() => {
        executeFinalEpisode();
    }, 3000);
}

function showChavesFinalIntro(participants) {
    const mainBlock = document.getElementById('MainBlock');
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 3.5em; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🎊 FASE FINAL DO MODO CHAVES! 🎊
            </h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h2 style="font-size: 2.2em; margin-bottom: 25px; color: #FFD700;">
                    👑 OS 6 CLASSIFICADOS
                </h2>
                
                <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 25px 0;">
                    ${participants.map(participant => `
                        <div style="background: rgba(255,255,255,0.3); padding: 20px 30px; 
                                    border-radius: 15px; font-weight: bold; font-size: 1.3em;
                                    box-shadow: 0 6px 20px rgba(0,0,0,0.3); backdrop-filter: blur(10px);">
                            ✨ ${participant}
                        </div>
                    `).join('')}
                </div>
                
                <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; margin-top: 30px;">
                    <h3 style="font-size: 1.6em; margin-bottom: 15px; color: #FFD700;">
                        🏆 FORMATO DA FASE FINAL:
                    </h3>
                    <div style="text-align: left; font-size: 1.2em; line-height: 1.8;">
                        <p>🎯 <strong>Competição tradicional com eliminação</strong></p>
                        <p>👑 <strong>Um campeão por episódio</strong></p>
                        <p>💔 <strong>Um eliminado por episódio</strong></p>
                        <p>🏁 <strong>Até chegar ao Top 2 Final</strong></p>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; color: #666; font-size: 1.3em;">
                ⏳ Iniciando a Fase Final em alguns segundos...
            </div>
        </div>
    `;
}

function showChavesFinalEpisodeResult(episode, participants, campeao, eliminado) {
    const mainBlock = document.getElementById('MainBlock');
    
    const remaining = participants.filter(p => p !== eliminado);
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #ff4081; font-size: 2.8em; margin-bottom: 20px;">
                🏆 FASE FINAL - EPISÓDIO ${episode}
            </h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 35px; border-radius: 20px; margin: 25px 0; color: white;">
                
                <div style="background: rgba(76, 175, 80, 0.3); padding: 25px; border-radius: 15px; 
                            margin-bottom: 25px; border: 2px solid #4CAF50;">
                    <h3 style="font-size: 2.2em; margin-bottom: 15px; color: #FFD700;">
                        👑 ${campeao.toUpperCase()} VENCEU!
                    </h3>
                    <p style="font-size: 1.3em;">
                        🛡️ Está seguro para o próximo episódio!
                    </p>
                </div>
                
                <div style="background: rgba(244, 67, 54, 0.3); padding: 25px; border-radius: 15px; 
                            margin-bottom: 25px; border: 2px solid #f44336;">
                    <h3 style="font-size: 2em; margin-bottom: 15px; color: #FFD700;">
                        💔 ${eliminado.toUpperCase()} FOI ELIMINADO
                    </h3>
                    <p style="font-size: 1.2em;">
                        😢 Sua jornada no Modo Chaves chegou ao fim...
                    </p>
                </div>
                
                <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px;">
                    <h4 style="font-size: 1.6em; margin-bottom: 20px; color: #FFD700;">
                        🚀 PARTICIPANTES RESTANTES (${remaining.length}):
                    </h4>
                    <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                        ${remaining.map(p => `
                            <div style="background: ${p === campeao ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255,255,255,0.3)'}; 
                                        padding: 12px 20px; border-radius: 10px; font-weight: bold; font-size: 1.1em;
                                        ${p === campeao ? 'border: 2px solid #4CAF50;' : ''}">
                                ${p === campeao ? '👑' : '✨'} ${p}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${remaining.length === 2 ? `
                    <div style="background: rgba(255, 193, 7, 0.3); padding: 20px; border-radius: 12px; 
                                margin-top: 25px; border: 2px solid #ffc107;">
                                                <h4 style="color: #FFD700; font-size: 1.5em; margin-bottom: 10px;">
                            🏁 TOP 2 ALCANÇADO!
                        </h4>
                        <p style="font-size: 1.2em;">
                            Chegamos à Grande Final do Modo Chaves!
                        </p>
                    </div>
                ` : `
                    <div style="margin-top: 25px; font-size: 1.2em; opacity: 0.9;">
                        ⏳ Próximo episódio da Fase Final em alguns segundos...
                    </div>
                `}
            </div>
        </div>
    `;
}

