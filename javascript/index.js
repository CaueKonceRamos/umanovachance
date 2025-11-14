// Funcionalidades comuns e inicialização
let currentGameMode = 'aleatorio'; // Modo padrão: Aleatório ou VF

// Mapeamento de participantes para suas fotos
const PARTICIPANT_PHOTOS = {
    // Temporada 1
    'Renata Santti': 'fts/participantes/T1/Renata.webp',
    'Vitória Régia': 'fts/participantes/T1/Vitoria.webp',
    'Ju Barbosa': 'fts/participantes/T1/JuBarbosa.jpg',
    'Mariana Soeiro': 'fts/participantes/T1/MarianaSoeiro.webp',
    'Mhanuela com H': 'fts/participantes/T1/Mhanu.webp',
    'Francine Souza': 'fts/participantes/T1/Fran.webp',
    
    // Temporada 2
    'Kenya Borges': 'fts/participantes/T2/KENYA.webp',
    'Palloma Tamirys': 'fts/participantes/T2/PALLOMA.webp',
    'Tabatha Cuzziol': 'fts/participantes/T2/TABATHA.webp',
    'Ego Oliver': 'fts/participantes/T2/EGO.webp',
    'Vini Freire': 'fts/participantes/T2/VINI.webp',
    'Juliana Haendchen': 'fts/participantes/T2/JULIANA.webp',
    'Lea Muller': 'fts/participantes/T2/LEA.webp',
    'Andressah Catty': 'fts/participantes/T2/ANDRESSA.webp',
    
    // Temporada 3
    'Lidyanne Bergman': 'fts/participantes/T3/LidyanneBergman.webp',
    'Nathália Mattis': 'fts/participantes/T3/NathMattis.webp',
    'Paloma Barbiezinha': 'fts/participantes/T3/Paloma.webp',
    'Weel Silva': 'fts/participantes/T3/Weel.webp',
    'Luna Scarlett': 'fts/participantes/T3/Luna.webp',
    'Gabriel Jordan': 'fts/participantes/T3/GABRIEL.webp',
    'Jéssica Brazil': 'fts/participantes/T3/JESSICA.jpg',
    'Jade Kotek': 'fts/participantes/T3/JADE.webp',
    'Lye': 'fts/participantes/T3/LYE.webp',
    'Duds Daher': 'fts/participantes/T3/DUDS.webp',
    
    // Temporada 4
    'Elay Oliv': 'fts/participantes/T4/Elay.webp',
    'Jahde Borg': 'fts/participantes/T4/Jahde.webp',
    'Erick Neto': 'fts/participantes/T4/Erick.webp',
    'DaCota Monteiro': 'fts/participantes/T4/DaCota.webp',
    'Rafa Mello': 'fts/participantes/T4/Rafa.webp',
    'Paula Renata': 'fts/participantes/T4/Paula.webp',
    'Cris Wraase': 'fts/participantes/T4/Cris.webp',
    'Isabela Borges': 'fts/participantes/T4/Isabela.webp',
    'Hillary': 'fts/participantes/T4/Hillary.jpg',
    'Elu Almeida': 'fts/participantes/T4/Elu.webp',
    
    // Temporada 5
    'Huylson': 'fts/participantes/T5/Huylson.webp',
    'Barbit': 'fts/participantes/T5/Barbit.webp',
    'Ive Gotts': 'fts/participantes/T5/Ive.webp',
    'Alyssah Hernandez': 'fts/participantes/T5/Alyssah.webp',
    'Luna Hengel': 'fts/participantes/T5/Luna.jpg',
    'Ella': 'fts/participantes/T5/Ella.webp',
    'Dizaster': 'fts/participantes/T5/Dizaster.webp',
    'Leone Dantas': 'fts/participantes/T5/Leone.webp',
    'Wanessa Brazil': 'fts/participantes/T5/Wanessa.webp',
    'Felipe Sadrak': 'fts/participantes/T5/Sadrak.webp',
    'Fada do Sonho': 'fts/participantes/T5/fada.webp',
    'Dezza': 'fts/participantes/T5/Dezza.webp',
    
    // Temporada 7
    'Mady': 'fts/participantes/T7/Mady.webp',
    'Milena Campos': 'fts/participantes/T7/Milena.webp',
    'Kitty Kawakubo': 'fts/participantes/T7/Kitty.webp',
    'Javi Malpa': 'fts/participantes/T7/Javi.webp',
    'Barcellos': 'fts/participantes/T7/Barcellos.webp',
    'Manillê': 'fts/participantes/T7/Manille.webp',
    'Madrinha': 'fts/participantes/T7/Madrinha.webp',
    'Jordann Vicente': 'fts/participantes/T7/Jordann.webp',
    'Solita': 'fts/participantes/T7/Solita.webp',
    'Giovanna Visnardi': 'fts/participantes/T7/GiovannaCDB7Perfi.webp'
};

// Tornar acessível globalmente para helpers que rodem em outros módulos
window.PARTICIPANT_PHOTOS = PARTICIPANT_PHOTOS;

// Função utilitária para verificar carregamento das imagens no console (chame manualmente)
function verifyParticipantPhotos() {
    if (!window.PARTICIPANT_PHOTOS) {
        console.warn('PARTICIPANT_PHOTOS não está definido');
        return;
    }
    Object.entries(window.PARTICIPANT_PHOTOS).forEach(([name, src]) => {
        const img = new Image();
        img.onload = () => console.log('[OK] Foto:', name, '->', src);
        img.onerror = () => console.warn('[FALHA] Foto não encontrada:', name, '->', src);
        img.src = src;
    });
}

// Dicas contextuais para o usuário
const DICAS = {
    aleatorio: "O sistema irá escolher automaticamente os resultados de cada episódio. Mais rápido e dinâmico!",
    vf: "Você terá controle total sobre os resultados. Escolha quem vence, quem é flop, etc!",
    regular: "Modo clássico com eliminação progressiva. De 8-12 participantes até descobrir a campeã.",
    pontuacao: "Sem eliminações! 9 desafios com pontuação. Os 3 com mais pontos disputam a final.",
    grupos: "Fase de grupos primeiro, depois fase final. Sistema complexo e desafiador.",
    pesquisa: "Digite o nome do participante para filtrar a lista. Case-insensitive."
};

// Função para definir o modo de jogo (Aleatório vs VF)
function setGameMode(mode) {
    currentGameMode = mode;
    
    // Atualizar visibilidade dos botões
    document.getElementById('mode-aleatorio').classList.toggle('active', mode === 'aleatorio');
    document.getElementById('mode-vf').classList.toggle('active', mode === 'vf');
    
    // Mostrar dica
    if (DICAS[mode]) {
        showTip(DICAS[mode]);
    }
}

function showTip(message) {
    // Remover dica anterior se existir
    const existingTip = document.getElementById('tip-container');
    if (existingTip) existingTip.remove();
    
    // Criar novo container de dica
    const tipDiv = document.createElement('div');
    tipDiv.id = 'tip-container';
    tipDiv.style.cssText = 'background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 15px 20px; border-radius: 10px; margin-bottom: 20px; font-size: 1em; text-align: center; animation: slideInFromTop 0.4s ease-out; box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);';
    tipDiv.innerHTML = '💡 ' + message;
    
    const mainBlock = document.getElementById('MainBlock');
    mainBlock.insertBefore(tipDiv, mainBlock.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        tipDiv.style.animation = 'fadeOut 0.4s ease-out';
        setTimeout(() => tipDiv.remove(), 400);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const contestantButtons = document.getElementsByClassName('contestant-btn');
    const startButton = document.getElementById('start-button');
    const premiereFormat = document.getElementById('premiere-format');
    const maxCountSpan = document.getElementById('max-count');
    
    let maxParticipants = 12;
    
    // Adicionar efeito de loading
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Mostrar dica inicial
    showTip(DICAS.aleatorio);
    
    // Atualizar limite baseado no formato selecionado
    premiereFormat.addEventListener('change', function() {
        const selectedList = document.getElementById('selected-list');
        const finalTypeSelect = document.getElementById('final-type');
        const repescagemSelect = document.getElementById('repescagem');
        
        if (this.value === 'regular') {
            maxParticipants = 12;
            maxCountSpan.textContent = '12';
            // Mostrar filtros específicos do modo regular (mínimo 6, máximo 12)
            finalTypeSelect.style.display = 'block';
            repescagemSelect.style.display = 'block';
        } else if (this.value === 'pontuacao') {
            maxParticipants = 8;
            maxCountSpan.textContent = '8';
            // Esconder filtros do modo regular
            finalTypeSelect.style.display = 'none';
            repescagemSelect.style.display = 'none';
        } else if (this.value === 'grupos') {
            maxParticipants = 12;
            maxCountSpan.textContent = '12';
            // Esconder filtros do modo regular
            finalTypeSelect.style.display = 'none';
            repescagemSelect.style.display = 'none';
        }
        
        // Remover participantes excedentes se necessário
        while (selectedList.children.length > maxParticipants) {
            const lastChild = selectedList.lastElementChild;
            const participantName = lastChild.textContent;
            
            // Reabilitar botão
            Array.from(contestantButtons).forEach(btn => {
                const btnName = btn.querySelector('span').textContent;
                if (btnName === participantName) {
                    btn.disabled = false;
                }
            });
            
            lastChild.remove();
        }
        
        updateSelectedCount();
    });
    
    // Disparar evento de mudança para mostrar/esconder filtros inicialmente
    premiereFormat.dispatchEvent(new Event('change'));
    
    // Função de pesquisa melhorada
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        Array.from(contestantButtons).forEach(button => {
            const participantName = button.querySelector('span').textContent.toLowerCase();
            const seasonGroup = button.closest('.season-group');
            
            if (participantName.includes(searchTerm)) {
                button.style.display = 'flex';
                seasonGroup.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
        
        // Ocultar grupos de temporada se não houver participantes visíveis
        document.querySelectorAll('.season-group').forEach(group => {
            const visibleButtons = Array.from(group.querySelectorAll('.contestant-btn'))
                .filter(btn => btn.style.display !== 'none');
            
            if (visibleButtons.length === 0 && searchTerm) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });
    });
    
    // Adicionar event listeners aos botões dos participantes
    Array.from(contestantButtons).forEach(button => {
        button.addEventListener('click', function() {
            // Extrair apenas o texto do nome (que está dentro da tag <span>)
            const participantName = this.querySelector('span').textContent;
            selectParticipant(participantName);
        });
    });
    
    // Função para atualizar contador
    function updateSelectedCount() {
        const selectedList = document.getElementById('selected-list');
        const selectedCount = document.getElementById('selected-count');
        const count = selectedList.children.length;
        
        selectedCount.textContent = count;
        
        // Habilitar/desabilitar botão de início
        const premiereFormat = document.getElementById('premiere-format');
        let canStart = false;
        
        if (premiereFormat.value === 'regular') {
            // Modo Regular: 6-12 participantes
            canStart = count >= 6 && count <= 12;
        } else if (premiereFormat.value === 'pontuacao') {
            // Modo Pontuação: exatamente 8 participantes
            canStart = count === 8;
        } else if (premiereFormat.value === 'grupos') {
            // Modo Grupos: exatamente 12 participantes
            canStart = count === 12;
        }
        
        startButton.disabled = !canStart;
        
        if (canStart) {
            startButton.style.opacity = '1';
            startButton.style.cursor = 'pointer';
            startButton.style.backgroundColor = '#ff4081';
        } else {
            startButton.style.opacity = '0.6';
            startButton.style.cursor = 'not-allowed';
            startButton.style.backgroundColor = '#666';
        }
    }
    
    // Função para selecionar participante
    window.selectParticipant = function(participantName) {
        const selectedList = document.getElementById('selected-list');
        const currentCount = selectedList.children.length;
        const premiereFormat = document.getElementById('premiere-format');
        
        // Verificar limite baseado no modo selecionado
        let maxAllowed = maxParticipants;
        if (premiereFormat.value === 'regular') {
            maxAllowed = 12; // Até 12 para Regular
        }
        
        if (currentCount >= maxAllowed) {
            if (premiereFormat.value === 'regular') {
                alert(`Máximo de ${maxAllowed} participantes atingido! (Mínimo: 6)`);
            } else {
                alert(`Máximo de ${maxAllowed} participantes atingido!`);
            }
            return;
        }
        
        // Verificar se já foi selecionado
        const alreadySelected = Array.from(selectedList.children)
            .some(child => child.textContent === participantName);
        
        if (alreadySelected) {
            alert('Este participante já foi selecionado!');
            return;
        }
        
        // Criar elemento do participante selecionado
        const participantElement = document.createElement('div');
        participantElement.className = 'selected-participant';
        participantElement.textContent = participantName;
        participantElement.onclick = function() {
            removeSelectedParticipant(participantName);
        };
        
        selectedList.appendChild(participantElement);
        
        // Desabilitar botão
        Array.from(contestantButtons).forEach(btn => {
            const btnName = btn.querySelector('span').textContent;
            if (btnName === participantName) {
                btn.disabled = true;
            }
        });
        
        updateSelectedCount();
    };
    
    // Função para remover participante selecionado
    window.removeSelectedParticipant = function(participantName) {
        const selectedList = document.getElementById('selected-list');
        
        // Remover da lista
        Array.from(selectedList.children).forEach(child => {
            if (child.textContent === participantName) {
                child.remove();
            }
        });
        
        // Reabilitar botão
        Array.from(contestantButtons).forEach(btn => {
            const btnName = btn.querySelector('span').textContent;
            if (btnName === participantName) {
                btn.disabled = false;
            }
        });
        
        updateSelectedCount();
    };
    
    // Inicializar contador
    updateSelectedCount();
    
    // Event listener para botão de dado (seleção aleatória)
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', function() {
            // Coletar todos os participantes disponíveis (não desabilitados)
            const availableButtons = Array.from(contestantButtons).filter(btn => !btn.disabled);
            
            if (availableButtons.length === 0) {
                alert('Nenhum participante disponível para seleção aleatória!');
                return;
            }
            
            // Selecionar aleatoriamente
            const randomIndex = Math.floor(Math.random() * availableButtons.length);
            const randomButton = availableButtons[randomIndex];
            const participantName = randomButton.querySelector('span').textContent;
            
            // Chamar seleção
            selectParticipant(participantName);
            
            // Feedback visual
            randomBtn.style.transform = 'scale(1.1) rotate(360deg)';
            setTimeout(() => {
                randomBtn.style.transform = 'scale(1) rotate(0deg)';
            }, 600);
        });
        
        // Adicionar transição suave ao CSS do botão
        randomBtn.style.transition = 'all 0.6s ease';
    }
});

// Função para remover participante (botão)
function removeParticipant() {
    const selectedList = document.getElementById('selected-list');
    
    if (selectedList.children.length === 0) {
        alert('Nenhum participante selecionado para remover!');
        return;
    }
    
    // Remover o último participante adicionado
    const lastParticipant = selectedList.lastElementChild;
    const participantName = lastParticipant.textContent;
    
    removeSelectedParticipant(participantName);
}

// Função principal para iniciar simulação
function startSimulation() {
    const selectedList = document.getElementById('selected-list');
    const premiereFormat = document.getElementById('premiere-format').value;
    const finalFormat = document.getElementById('format').value;
    const finalType = document.getElementById('final-type').value;
    const repescagem = document.getElementById('repescagem').value;
    
    // Coletar participantes selecionados
    const selectedParticipants = Array.from(selectedList.children)
        .map(child => child.textContent);
    
    if (selectedParticipants.length === 0) {
        alert('Selecione os participantes primeiro!');
        return;
    }
    
    // Verificar se tem o número correto de participantes
    let isValid = false;
    let errorMessage = '';
    
    if (premiereFormat === 'regular') {
        // Modo Regular: 6-12 participantes
        if (selectedParticipants.length < 6 || selectedParticipants.length > 12) {
            isValid = false;
            errorMessage = 'Selecione entre 6 e 12 participantes para o Modo Regular!';
        } else {
            isValid = true;
        }
    } else if (premiereFormat === 'pontuacao') {
        // Modo Pontuação: exatamente 8 participantes
        if (selectedParticipants.length !== 8) {
            isValid = false;
            errorMessage = 'Selecione exatamente 8 participantes para o Modo Pontuação!';
        } else {
            isValid = true;
        }
    } else if (premiereFormat === 'grupos') {
        // Modo Grupos: exatamente 12 participantes
        if (selectedParticipants.length !== 12) {
            isValid = false;
            errorMessage = 'Selecione exatamente 12 participantes para o Modo Grupos!';
        } else {
            isValid = true;
        }
    }
    
    if (!isValid) {
        alert(errorMessage);
        return;
    }
    
    // Iniciar simulação baseada no formato
    switch (premiereFormat) {
        case 'regular':
            startRegularMode(selectedParticipants, currentGameMode, finalType, repescagem);
            break;
        case 'pontuacao':
            startScoreMode(selectedParticipants, currentGameMode, finalFormat);
            break;
        case 'grupos':
            startGroupsMode(selectedParticipants, currentGameMode, finalFormat);
            break;
        default:
            alert('Formato não reconhecido!');
    }
}

// Função para mostrar resultados finais (usada por todos os modos)
function showFinalResults(finalists, format, eliminatedOrder, isChavesMode = false) {
    const mainBlock = document.getElementById('MainBlock');
    
    // Determinar campeão
    const campeao = finalists[Math.floor(Math.random() * finalists.length)];
    const viceCampeao = finalists.find(p => p !== campeao);
    
    // Criar ranking completo
    let fullRanking = [];
    
    if (format === 'top2') {
        fullRanking = [campeao, viceCampeao, ...eliminatedOrder];
    } else if (format === 'top3') {
        const terceiro = eliminatedOrder[0];
        fullRanking = [campeao, viceCampeao, terceiro, ...eliminatedOrder.slice(1)];
    } else if (format === 'top4') {
        const terceiro = eliminatedOrder[0];
        const quarto = eliminatedOrder[1];
        fullRanking = [campeao, viceCampeao, terceiro, quarto, ...eliminatedOrder.slice(2)];
    }
    
    const modeTitle = isChavesMode ? 'MODO CHAVES' : 'CORRIDA DAS BLOGUEIRAS';
    
    mainBlock.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h1 style="color: #ff4081; font-size: 4em; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
                🏆 ${modeTitle} - RESULTADO FINAL! 🏆
            </h1>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        padding: 50px; border-radius: 25px; margin: 30px 0; color: #333; 
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h2 style="font-size: 3.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                    👑 ${campeao.toUpperCase()} 👑
                </h2>
                <h3 style="font-size: 2em; margin-bottom: 15px;">
                    🎉 GRANDE CAMPEÃO${isChavesMode ? ' DO MODO CHAVES' : ''}! 🎉
                </h3>
                <p style="font-size: 1.4em; font-weight: bold;">
                    ✨ Parabéns pela vitória incrível! ✨
                </p>
            </div>
            
            ${viceCampeao ? `
                <div style="background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%); 
                            padding: 35px; border-radius: 20px; margin: 25px 0; color: #333;">
                    <h3 style="font-size: 2.5em; margin-bottom: 15px;">
                        🥈 ${viceCampeao.toUpperCase()}
                    </h3>
                    <p style="font-size: 1.3em; font-weight: bold;">
                        Vice-Campeão${isChavesMode ? ' do Modo Chaves' : ''}
                    </p>
                </div>
            ` : ''}
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px; border-radius: 20px; margin: 30px 0; color: white;">
                <h3 style="font-size: 2.2em; margin-bottom: 30px; color: #FFD700;">
                    📊 CLASSIFICAÇÃO FINAL COMPLETA
                </h3>
                
                <div style="display: grid; gap: 12px; max-width: 600px; margin: 0 auto;">
                    ${fullRanking.map((participant, index) => {
                        let bgColor, emoji, position;
                        
                        if (index === 0) {
                            bgColor = 'rgba(255, 215, 0, 0.3)';
                            emoji = '👑';
                            position = '1º - CAMPEÃO';
                        } else if (index === 1) {
                            bgColor = 'rgba(192, 192, 192, 0.3)';
                            emoji = '🥈';
                            position = '2º - VICE-CAMPEÃO';
                        } else if (index === 2) {
                            bgColor = 'rgba(205, 127, 50, 0.3)';
                            emoji = '🥉';
                            position = '3º LUGAR';
                        } else {
                            bgColor = 'rgba(255, 255, 255, 0.2)';
                            emoji = '✨';
                            position = `${index + 1}º LUGAR`;
                        }
                        
                        return `
                            <div style="background: ${bgColor}; padding: 20px; border-radius: 15px; 
                                        display: flex; justify-content: space-between; align-items: center;
                                        backdrop-filter: blur(10px); font-weight: bold; font-size: 1.2em;">
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <span style="font-size: 1.5em;">${emoji}</span>
                                    <span>${participant}</span>
                                </div>
                                <div style="font-size: 1em; opacity: 0.9;">
                                    ${position}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div style="background: #2c3e50; padding: 30px; border-radius: 15px; margin-top: 30px; color: #ecf0f1;">
                <h4 style="font-size: 1.6em; margin-bottom: 20px; color: #3498db;">
                    📈 Estatísticas da Temporada:
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div style="background: #34495e; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="color: #e74c3c; font-weight: bold; font-size: 1.1em;">Total de Participantes</div>
                        <div style="font-size: 2em; margin-top: 10px;">${fullRanking.length}</div>
                    </div>
                    <div style="background: #34495e; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="color: #f39c12; font-weight: bold; font-size: 1.1em;">Episódios Disputados</div>
                        <div style="font-size: 2em; margin-top: 10px;">${isChavesMode ? '13+' : '16+'}</div>
                    </div>
                    <div style="background: #34495e; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="color: #27ae60; font-weight: bold; font-size: 1.1em;">Formato</div>
                        <div style="font-size: 1.3em; margin-top: 10px;">${isChavesMode ? 'Chaves' : 'Tradicional'}</div>
                    </div>
                </div>
            </div>
            
            <button onclick="location.reload()" 
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; border: none; padding: 20px 50px; font-size: 1.4em; 
                           border-radius: 15px; cursor: pointer; font-weight: bold; margin-top: 30px;
                           box-shadow: 0 8px 25px rgba(0,0,0,0.3); transition: all 0.3s ease;"
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'">
                🔄 Nova Simulação
            </button>
        </div>
    `;
}

