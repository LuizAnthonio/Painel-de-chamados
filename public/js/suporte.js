
document.addEventListener('DOMContentLoaded', async function() {
    // Variável global para armazenar chamados
    let chamados = [];
    let refreshInterval;
    const refreshTime = 2000; // 30 segundos
    

function diferencaMinutos(dataObj, dataComparacao = new Date()) {
    // Se já for um objeto Date, usa diretamente
    const dataEspecifica = dataObj instanceof Date ? dataObj : new Date(dataObj);
    
    // Verifica se as datas são válidas
    if (isNaN(dataEspecifica.getTime())) {
        throw new Error(`Data inválida: ${dataObj}`);
    }
    if (isNaN(dataComparacao.getTime())) {
        throw new Error("Data de comparação inválida");
    }

    // Calcula a diferença em milissegundos (valor absoluto)
    const diferencaMs = Math.abs(dataComparacao - dataEspecifica);

    // Converte para minutos (arredondando para baixo)
    return Math.floor(diferencaMs / (1000 * 60));
}




        
    function tempoFormatado(dataObj) {
    try {
        const minutosTotais = diferencaMinutos(dataObj);
        const horas = Math.floor(minutosTotais / 60);
        const minutos = minutosTotais % 60;
        return `${horas}h ${minutos}min`;
    } catch (error) {
        console.error('Erro ao calcular tempo:', error);
        return '--';
    }
}

    
// Adicione no início do seu arquivo (com as outras variáveis globais)
let ultimoChamadoId = null;
const notificationSound = new Audio('som/notificacao.mp3'); // Caminho para seu arquivo de som


// Modifique a função loadAndRefreshChamados
async function loadAndRefreshChamados() {
    try {
        const novosChamados = await fetchChamados();
        const chamadosFormatados = formatarFoma(novosChamados);
        
        // Verifica se houve mudança nos chamados
        if (JSON.stringify(chamados) !== JSON.stringify(chamadosFormatados)) {
            // Verifica se há novos chamados
            if (chamados.length > 0 && chamadosFormatados.length > chamados.length) {
                const novoChamado = encontrarNovoChamado(chamados, chamadosFormatados);
                if (novoChamado) {
                    playNotificationSound();
                    showVisualNotification(novoChamado);
                }
            }
            
            chamados = chamadosFormatados;
            console.log('Chamados atualizados:', chamados);
            loadChamados(getCurrentTab(), filterPriority.value);
            
            if (refreshInterval) {
                showNotification('Chamados atualizados', 'info');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        showNotification('Erro ao atualizar chamados', 'error');
    }
}


// Função para encontrar novos chamados
function encontrarNovoChamado(chamadosAntigos, chamadosNovos) {
    if (chamadosAntigos.length === 0) return null;
    
    // Encontra o ID mais recente nos chamados antigos
    const maxIdAntigo = chamadosAntigos.filter(e => e.status == "pendente").map(c => c._id).sort((a,b) => a - b)
    console.log('MAX',maxIdAntigo)
    
    // Procura por chamados com ID maior que o máximo anterior
    console.log("aqui os novos",chamadosNovos.find(c => c._id > maxIdAntigo ))
    return chamadosNovos.find(c => c._id > maxIdAntigo && c.status === 'pendente');
}

// Função para tocar o som de notificação
function playNotificationSound() {
    try {
        notificationSound.currentTime = 0; // Reinicia o som se já estiver tocando
        notificationSound.play()
            .catch(e => console.error('Erro ao reproduzir som:', e));
    } catch (e) {
        console.error('Erro com o som de notificação:', e);
    }
}



function showVisualNotification() {
    if (!('Notification' in window)) {
        console.log('Este navegador não suporta notificações desktop');
        return;
    }

    Notification.requestPermission().then(per => {
        if(per === "granted") {
            new Notification("Novo Chamado Pendente");
        }
    });

    // Mostra também na interface
    showNotification(`Novo chamado pendente`, 'info');
}

// Cria a notificação desktop
function createNotification(chamado) {
    const notification = new Notification('Novo Chamado');

    notification.onclick = () => {
        window.focus();
        notification.close();
    };
}


// Exemplo: "9h 30min" (se a diferença for 570min)

   function formatarFoma(dados) {
    // Verifica se é um array (caso da API) ou um objeto único
    const listaChamados = Array.isArray(dados) ? dados : [dados];
    
    return listaChamados.map(chamado => {
        // Cria cópia do objeto para não modificar o original
        const formatado = {...chamado};
        
        try {
            if (formatado.data) {
                const dataObj = new Date(formatado.data);
                
                // Verifica se a data é válida
                if (isNaN(dataObj.getTime())) {
                    console.error('Data inválida:', formatado.data);
                    formatado.data = 'Data inválida';
                    formatado.tempo = '--';
                } else {
                    // Formata a data para exibição
                    formatado.data = `${dataObj.getDate()}/${dataObj.getMonth()+1}/${dataObj.getFullYear()} - ${dataObj.getHours()}:${dataObj.getMinutes().toString().padStart(2, '0')}`;
                    
                    // Calcula o tempo decorrido
                    formatado.tempo = tempoFormatado(dataObj);
                }
            } else {
                formatado.data = '--';
                formatado.tempo = '--';
            }
        } catch (error) {
            console.error('Erro ao formatar chamado:', error);
            formatado.data = 'Erro de formatação';
            formatado.tempo = '--';
        }
        
        return formatado;
    });
}



    const exemplo = {
		"id": 1002,
		"titulo": "Problema com impressora",
		"local": "Sala 2 - Térreo",
		"data": "2025-07-19T19:00",
		"status": "pendente"
	}

    formatarFoma(exemplo)



    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
            localStorage.setItem('darkMode', this.checked);
        });
        
        // Load saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
    }

    // Elementos da interface
    const tabButtons = document.querySelectorAll('.tab-btn');
    const chamadosBody = document.getElementById('chamados-body');
    const filterPriority = document.getElementById('filter-priority');
    const modal = document.getElementById('chamado-modal');
    const closeModal = document.querySelector('.close-modal');
    const btnLogout = document.querySelector('.btn-logout');
    const selectUnidade = document.getElementById('filter-unidade')
    let unidadeSelecionada = !localStorage.getItem("@unidade") ? "all" : localStorage.getItem("@unidade")

    
    selectUnidade.addEventListener("change", () => {
        console.log("elementoo",selectUnidade.value)

        localStorage.setItem("@unidade",selectUnidade.value)

        
    })

    


    // Função para buscar chamados da API
    async function fetchChamados() {
        try {
            const response = await fetch("/api/chamados/0", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({unidade:!localStorage.getItem("@unidade") ? "all" : localStorage.getItem("@unidade")})
            });

            if (!response.ok) {
                throw new Error('Erro na requisição');
            }

            return await response.json();
        } catch (err) {
            console.error('Erro ao carregar chamados:', err);
            showNotification('Falha ao carregar chamados', 'error');
            return [];
        }
    }

 async function loadAndRefreshChamados() {
    try {
        const novosChamados = await fetchChamados();
        const chamadosFormatados = formatarFoma(novosChamados);
        
        // Verifica se houve mudança nos chamados
        if (JSON.stringify(chamados) !== JSON.stringify(chamadosFormatados)) {
            // Verifica se há novos chamados PENDENTES
            if (chamados.length > 0 && chamadosFormatados.length > chamados.length) {
                const novoChamado = encontrarNovoChamado(chamados, chamadosFormatados);
                if (novoChamado && novoChamado.status === 'pendente') {
                    playNotificationSound();
                    showVisualNotification();
                    Notification.requestPermission().then(per => {
                        if(per === "granted"){
                            new Notification("Novo Chamado!")
                        }
                    })
                }
            }
            
            chamados = chamadosFormatados;
            console.log('Chamados atualizados:', chamados);
            loadChamados(getCurrentTab(), filterPriority.value);
            
            if (refreshInterval) {
                showNotification();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        showNotification('Erro ao atualizar chamados', 'error');
    }
}

    // Carregar chamados na tabela
    function loadChamados(status = 'pendentes', priority = 'all') {
        if (!chamadosBody) return;
        
        chamadosBody.innerHTML = '';
        
        const filteredChamados = chamados.filter(chamado => {
            const statusMatch = 
                (status === 'pendentes' && chamado.status === 'pendente') ||
                (status === 'andamento' && chamado.status === 'andamento') ||
                (status === 'concluidos' && chamado.status === 'concluido');
            
            const priorityMatch = priority === 'all' || chamado.prioridade === priority;
            
            return statusMatch && priorityMatch;
        });
        
        if (filteredChamados.length === 0) {
            chamadosBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Nenhum chamado encontrado</td></tr>';
            return;
        }
        
        filteredChamados.forEach(chamado => {
            const row = document.createElement('tr');
            
            let priorityClass = '';
            let priorityText = '';
            switch(chamado.prioridade) {
                case 'baixa':
                    priorityClass = 'priority-low';
                    priorityText = 'Baixa';
                    break;
                case 'media':
                    priorityClass = 'priority-medium';
                    priorityText = 'Média';
                    break;
                case 'alta':
                    priorityClass = 'priority-high';
                    priorityText = 'Alta';
                    break;
                case 'critica':
                    priorityClass = 'priority-critical';
                    priorityText = 'Crítica';
                    break;
            }
            
            row.innerHTML = `
                <td>${chamado.problema}</td>
                <td>${chamado.local}</td>
                <td><span class="priority-badge ${priorityClass}">${priorityText}</span></td>
                <td>${chamado.data}</td>
                <td>${chamado.tempo}</td>
                <td>
                    
                    ${chamado.status !== 'concluido' ? 
                        `<button class="action-btn btn-edit" data-id="${chamado._id}">Abrir Chamado</button>` : ''}
                </td>
            `;
            
            chamadosBody.appendChild(row);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                openModal(id, 'view');
            });
        });
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = (btn.getAttribute('data-id'));
              
                openModal(id, 'edit');
            });
        });
    }
    
    // Abrir modal
    function openModal(id, mode) {
        const chamado = chamados.find(c => c._id === id);
        if (!chamado || !modal) return;
        
        document.getElementById('modal-title').textContent = `Chamado - ${chamado.problema}`;
        
        let priorityText = '';
        switch(chamado.prioridade) {
            case 'baixa': priorityText = 'Baixa'; break;
            case 'media': priorityText = 'Média'; break;
            case 'alta': priorityText = 'Alta'; break;
            case 'critica': priorityText = 'Crítica'; break;
        }
        
        document.getElementById('modal-body').innerHTML = `
            <div class="modal-details">
                <p><strong>Local:</strong> ${chamado.local}</p>
                <p><strong>Prioridade:</strong> <span class="priority-badge ${getPriorityClass(chamado.prioridade)}">${priorityText}</span></p>
                <p><strong>Data/Hora:</strong> ${chamado.data}</p>
                <p><strong>Tempo decorrido:</strong> ${chamado.tempo}</p>
                
                <textarea name="descricao" id="descricao" placeholder="Descrição da solução."></textarea>
                <p><strong>Descrição:</strong> ${chamado.descricao}</p>
                <p><strong>Status:</strong> ${getStatusText(chamado.status)}</p>
            </div>
        `;
        
        const modalActions = document.getElementById('modal-actions');
        if (modalActions) {
            modalActions.innerHTML = '';
            
            if (mode === 'edit') {
                const selectStatus = document.createElement('select');
                selectStatus.id = 'modal-status';
                selectStatus.innerHTML = `
                    <option value="pendente" ${chamado.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="andamento" ${chamado.status === 'andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="concluido" ${chamado.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                `;
                
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn-submit btn';
                saveBtn.textContent = 'Salvar';
                saveBtn.addEventListener('click', function() {
                    chamado.status = selectStatus.value;
                    let statusChamado = chamado.status
                    console.log(chamado.status,"aqui")
                    loadChamados(getCurrentTab());
                    modal.style.display = 'none';
                    showNotification('Chamado atualizado com sucesso!', 'success');

                    //Aqui lança para a API para mudar o status
                    
                    fetch("/api/chamados/1", {
                        method:"PUT",
                        headers:{'Content-Type': 'application/json',},
                        body: JSON.stringify({id,statusChamado})
                    })

                });
                
                modalActions.appendChild(selectStatus);
                modalActions.appendChild(saveBtn);
            }
        }
        
        modal.style.display = 'flex';
    }
    
    // Funções auxiliares
    function getPriorityClass(priority) {
        switch(priority) {
            case 'baixa': return 'priority-low';
            case 'media': return 'priority-medium';
            case 'alta': return 'priority-high';
            case 'critica': return 'priority-critical';
            default: return '';
        }
    }
    
    function getStatusText(status) {
        switch(status) {
            case 'pendente': return 'Pendente';
            case 'andamento': return 'Em Andamento';
            case 'concluido': return 'Concluído';
            default: return status;
        }
    }
    
    function getCurrentTab() {
        const activeTab = document.querySelector('.tab-btn.active');
        return activeTab ? activeTab.getAttribute('data-tab') : 'pendentes';
    }
    
    // Event Listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadChamados(this.getAttribute('data-tab'), filterPriority.value);
        });
    });
    
    if (filterPriority) {
        filterPriority.addEventListener('change', function() {
            loadChamados(getCurrentTab(), this.value);
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            window.location.href = '/';
        });
    }

    // Iniciar atualização periódica
    function startAutoRefresh() {
        // Carrega imediatamente
        loadAndRefreshChamados();
        
        // Configura intervalo para atualização automática
        refreshInterval = setInterval(loadAndRefreshChamados, refreshTime);
    }

    // Parar atualização periódica (se necessário)
    function stopAutoRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    }

    // Iniciar o processo
    startAutoRefresh();
});

// Função de notificação 
function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}