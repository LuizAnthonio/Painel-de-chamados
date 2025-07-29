document.addEventListener('DOMContentLoaded', function() {
    // 1. Seleciona todos os itens do menu
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    
    // 2. Função para ativar o item correto
    function activateMenuItem() {
        // Remove 'active' de todos os itens
        menuItems.forEach(item => item.classList.remove('active'));
        
        // Obtém o caminho atual da URL
        const currentPath = window.location.pathname;
        
        // Encontra o item correspondente à URL atual
        const activeItem = Array.from(menuItems).find(item => {
            const itemPath = item.getAttribute('href');
            return currentPath === itemPath || 
                  (itemPath !== '/' && currentPath.startsWith(itemPath));
        });
        
        // Se encontrou, ativa o item
        if (activeItem) {
            activeItem.classList.add('active');
        } else {
            // Fallback: ativa a página inicial se nenhum match
            const homeItem = document.querySelector('.sidebar-menu a[href="/"]');
            if (homeItem) homeItem.classList.add('active');
        }
    }
    
    // 3. Configura os eventos de clique
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove 'active' de todos
            menuItems.forEach(i => i.classList.remove('active'));
            // Adiciona ao clicado
            this.classList.add('active');
        });
    });
    
    // 4. Ativa o item correto ao carregar a página
    activateMenuItem();
    
    // 5. Toggle do menu lateral (seu código existente)
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('collapsed');
        this.querySelector('i').classList.toggle('fa-chevron-left');
        this.querySelector('i').classList.toggle('fa-chevron-right');
    });
    
    // 6. Dark mode toggle (seu código existente)
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
});