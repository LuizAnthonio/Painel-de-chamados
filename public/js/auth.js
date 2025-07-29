
document.querySelector('.auth-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    try {
        const response = await fetch('/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            // Mostrar mensagem de sucesso
            alert('Cadastro realizado com sucesso!');
            window.location.href = '/'; // Redireciona manualmente se quiser
        } else {
            alert(data.message || 'Erro no cadastro');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
});


function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification') || document.body;
    
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