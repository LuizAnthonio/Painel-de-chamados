document.addEventListener('DOMContentLoaded', function() {
    const salas = [];
    const btnAdicionar = document.getElementById('btnAdicionar');
    const inputSala = document.getElementById('sala');
    const listaSalas = document.getElementById('listaSalas');
    const form = document.getElementById('unidadeForm');
    

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

    



    function atualizarListaSalas() {
        listaSalas.innerHTML = '';
        
        if (salas.length === 0) {
            listaSalas.innerHTML = '<p class="empty-message">Nenhuma sala adicionada ainda</p>';
            return;
        }
        
        const ul = document.createElement('ul');
        ul.className = 'salas-list';
        
        salas.forEach((sala, index) => {
            const li = document.createElement('li');
            li.className = 'sala-item';
            li.innerHTML = `
                <span class="sala-name">${sala}</span>
                <button type="button" class="btn-remove" data-index="${index}" title="Remover sala">×</button>
            `;
            ul.appendChild(li);
        });
        
        listaSalas.appendChild(ul);
        
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                salas.splice(index, 1);
                atualizarListaSalas();
            });
        });
    }
    
    atualizarListaSalas();
    
    btnAdicionar.addEventListener('click', function(e) {
        e.preventDefault();
        const nomeSala = inputSala.value.trim();
        
        if (nomeSala) {
            if (!salas.includes(nomeSala)) {
                salas.push(nomeSala);
                inputSala.value = '';
                atualizarListaSalas();
                inputSala.focus();
            } else {
                alert('Esta sala já foi adicionada!');
            }
        }
    });
    
    inputSala.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnAdicionar.click();
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nomeUnidade = document.getElementById('nomeUni').value.trim();
        
        if (!nomeUnidade) {
            alert('Por favor, insira um nome para a unidade');
            return;
        }
        
        if (salas.length === 0) {
            alert('Por favor, adicione pelo menos uma sala');
            return;
        }
        
        // Aqui você enviaria para o back-end
        console.log('Dados para enviar:', {
            nomeUnidade: nomeUnidade,
            salas: salas
        });

        fetch("/cadastrar/unidade", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({nome: nomeUnidade,salas:salas})

        })
        
        alert(`Unidade "${nomeUnidade}" com salas: ${salas.join(', ')} será enviada para o back-end`);
        form.reset();
        salas.length = 0;
        atualizarListaSalas();
    });
});