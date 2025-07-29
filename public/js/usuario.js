document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle (seu código existente)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
            localStorage.setItem('darkMode', this.checked);
        });
        
        if (localStorage.getItem('darkMode') === 'true') {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
    }

    // Dropdown de unidades (seu código existente)
    const unidadeContainer = document.getElementById('unidade-container');
    const unidadeDropdown = document.getElementById('unidade-dropdown');
    let dropdownVisible = false;
    let isMobile = window.matchMedia("(max-width: 768px)").matches;

    function toggleDropdown(show) {
        dropdownVisible = show !== undefined ? show : !dropdownVisible;
        if (dropdownVisible) {
            unidadeDropdown.classList.add('show');
        } else {
            unidadeDropdown.classList.remove('show');
        }
    }

    if (!isMobile) {
        unidadeContainer.addEventListener('mouseenter', () => toggleDropdown(true));
        unidadeContainer.addEventListener('mouseleave', () => toggleDropdown(false));
    }

    if (isMobile) {
        unidadeContainer.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDropdown();
        });
    }

    document.addEventListener('click', function(e) {
        if (!unidadeContainer.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    document.querySelectorAll('.unidade-option').forEach(option => {
        option.addEventListener('click', function() {
            toggleDropdown(false);
        });
    });

    window.addEventListener('resize', function() {
        isMobile = window.matchMedia("(max-width: 768px)").matches;
    });

    // Seleção de problema e campo "Outro"
    const problemOptions = document.querySelectorAll('.problem-option');
    const outroProblemContainer = document.getElementById('outro-problem-container');
    const outroProblemInput = document.getElementById('outro-problem');
    const chamadoForm = document.querySelector('.chamado-form');
    const salaSelect = document.getElementById('sala');

    // Variáveis para armazenar os dados
    let problemaSelecionado = null;
    let problemaCustomizado = '';

    // Evento para seleção de problemas
    problemOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove seleção de todos
            problemOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Adiciona seleção ao clicado
            this.classList.add('selected');
            
            // Verifica se é "Outro"
            if (this.getAttribute('data-problem') === 'outro') {
                outroProblemContainer.style.display = 'block';
                problemaSelecionado = 'Outro';
                outroProblemInput.focus(); // Foca no campo de texto
            } else {
                outroProblemContainer.style.display = 'none';
                problemaSelecionado = this.textContent.trim();
            }
        });
    });

    // Atualiza o problema customizado quando o usuário digita
    outroProblemInput.addEventListener('input', function() {
        problemaCustomizado = this.value.trim();
    });

    // Envio do formulário
    if (chamadoForm) {
        chamadoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const unidade = document.getElementById('unidade').textContent.trim();
            const sala = salaSelect.value;
            const data = new Date();
            
            // Determina qual problema usar
            const problemaFinal = problemaSelecionado === 'Outro' ? 
                                problemaCustomizado : 
                                problemaSelecionado;

            // Validação
            if (!unidade || !sala || !problemaFinal) {
                showNotification('Por favor, preencha todos os campos!', 'error');
                return;
            }

            if (problemaSelecionado === 'Outro' && !problemaCustomizado) {
                showNotification('Por favor, descreva o problema!', 'error');
                return;
            }

            // Dados para enviar
            const dadosChamado = {
                unidade,
                local: sala,
                problema: problemaFinal,
                data: data.toISOString(),
                unidadeSelec:unidade,

            };

            //console.log('Dados do chamado:', dadosChamado);

            // Envia para o backend
            fetch("/api/chamado", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosChamado)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erro na resposta');
                return response.json();
            })
            .then(data => {
                showNotification('Chamado aberto com sucesso!', 'success');
                chamadoForm.reset();
                problemOptions.forEach(opt => opt.classList.remove('selected'));
                outroProblemContainer.style.display = 'none';
                outroProblemInput.value = '';
               
            })
            .catch(error => {
                console.error('Erro:', error);
                showNotification('Erro ao enviar chamado. Tente novamente.', 'error');
            });
        });
    }

    // Logout
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            window.location.href = '/';
        });
    }
});

function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification');
    
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
/*
document.addEventListener('DOMContentLoaded', function() {
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
    


        const unidadeContainer = document.getElementById('unidade-container');
    const unidadeDropdown = document.getElementById('unidade-dropdown');
    let dropdownVisible = false;
    let isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Função para mostrar/esconder o dropdown
    function toggleDropdown(show) {
        dropdownVisible = show !== undefined ? show : !dropdownVisible;
        if (dropdownVisible) {
            unidadeDropdown.classList.add('show');
        } else {
            unidadeDropdown.classList.remove('show');
        }
    }

    // Eventos para desktop (hover)
    if (!isMobile) {
        unidadeContainer.addEventListener('mouseenter', () => toggleDropdown(true));
        unidadeContainer.addEventListener('mouseleave', () => toggleDropdown(false));
    }

    // Eventos para mobile (click)
    if (isMobile) {
        unidadeContainer.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDropdown();
        });
    }

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!unidadeContainer.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    // Fechar dropdown ao selecionar uma opção (opcional)
    document.querySelectorAll('.unidade-option').forEach(option => {
        option.addEventListener('click', function() {
            toggleDropdown(false);
            // O redirecionamento já acontece naturalmente pelo href
        });
    });

    // Adaptar ao redimensionamento da tela
    window.addEventListener('resize', function() {
        isMobile = window.matchMedia("(max-width: 768px)").matches;
    });



    
    // Problem selection
    const problemOptions = document.querySelectorAll('.problem-option');
    const problemaInput = document.getElementById('problema');
    
    let problema;
    let local;

    problemOptions.forEach(option => {
        option.addEventListener('click', function() {
            problemOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
       

            problema = option.textContent.trim()
            console.log(problema)
            //problemaInput.value = this.getAttribute('data-problem');
        });
    });

        const problemSelector = document.querySelector('.problem-selector');
   
    const tituloInput = document.getElementById('titulo');
    
    // Delegation de eventos (mais eficiente)
    problemSelector.addEventListener('click', (e) => {
        const clickedOption = e.target.closest('.problem-option');
        if (!clickedOption) return;
        
        // Remove seleção anterior
        problemOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Adiciona seleção ao clicado
        clickedOption.classList.add('selected');
        
      
        
       
    });
    
    // Form submission problem-option
    const chamadoForm = document.querySelector('.chamado-form');
    
    if (chamadoForm) {
        chamadoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const data = new Date()
            
            const unidadeSelec = document.getElementById('unidade').textContent.trim();
            
            
            local = document.getElementById('sala').value;
            
            if (unidadeSelec && local && problema) {
                
                console.log({unidadeSelec,local,problema,data})
                //colocar aqui a requisição para o backend

                // Em uma implementação real, você enviaria isso para o backend
                fetch("/api/chamado",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({unidadeSelec,local,problema,data})
                })

                showNotification('Chamado aberto com sucesso! Prioridade calculada.', 'success');
                chamadoForm.reset();
                problemOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Simulação de notificação para o suporte
                setTimeout(() => {
                    if (Math.random() > 0.5) {
                        showNotification('Seu chamado foi atribuído a um técnico!', 'info');
                    }
                }, 2000);
            } else {
                showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            }
        });
        
    }


    
    // Logout
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            window.location.href = '/';
        });
    }
});

function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification');
    
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

*/