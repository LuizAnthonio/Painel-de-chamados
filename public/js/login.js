
document.querySelector('.auth-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const formData = {
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    try {
        console.log(formData)
        
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log(data)
        
        if (response.ok) {

            localStorage.setItem("@user",data.user)


            window.location.href = '/chamados'; 
        } else {
            alert(data.message || 'Erro no login');
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