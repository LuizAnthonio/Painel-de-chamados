# 🚀 Painel de Chamados de TI 

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Solução para otimizar chamados de TI**, eliminando a necessidade de interrupções físicas e gerando dados para melhorias futuras.  

## 🔥 Impacto do Projeto  
- ✅ **Redução de 70%** nas interrupções físicas da equipe de TI.  
- ✅ **Centralização** dos chamados em um único painel.  
- ✅ **Dados estruturados** (MongoDB) para análises futuras (ex.: setores com mais demandas).  

## 🛠️ Tecnologias Usadas  
- **Backend**: Node.js + Express.  
- **Frontend**: HTML/CSS/JS puro + EJS (para templates dinâmicos).  
- **Banco de Dados**: MongoDB (armazenamento de chamados e usuários).  
- **Autenticação**: Session-based ou JWT (adicione aqui o método usado).  

## 📸 Screenshots  
<img width="1913" height="931" alt="image" src="https://github.com/user-attachments/assets/d3894318-b15f-4030-8f96-d86be2c12d1b" />
<img width="1913" height="931" alt="image" src="https://github.com/user-attachments/assets/2de5125a-0ce0-4d4f-846b-7772df720a42" />
<img width="1714" height="934" alt="Captura de tela de 2025-07-28 21-05-22" src="https://github.com/user-attachments/assets/1e446e73-08af-4c77-8b88-cde804b34133" />
<img width="1714" height="934" alt="Captura de tela de 2025-07-28 21-05-29" src="https://github.com/user-attachments/assets/fe465b49-7610-4611-a577-ece8e692659c" />
<img width="1913" height="931" alt="Captura de tela de 2025-07-28 21-08-17" src="https://github.com/user-attachments/assets/b3110393-9492-4a42-96aa-3cb829116be0" />
<img width="1913" height="931" alt="Captura de tela de 2025-07-28 21-08-31" src="https://github.com/user-attachments/assets/d102eede-69a3-4876-ab65-17f5ce64c751" />

 


## 🛠 **Rotas do Sistema (Node.js + Express)**

### 🔐 **Autenticação**
| Método | Rota         | Descrição                     | Parâmetros (Body/Query)       | Exemplo                     |
|--------|--------------|-------------------------------|-------------------------------|-----------------------------|
| `GET`  | `/`          | Página inicial (login)        | -                             | `GET /`                     |
| `POST` | `/login`     | Autentica usuário             | `{ email, senha }`            | ```POST /login { "email": "ti@empresa.com", "senha": "123456" }``` |
| `GET`  | `/logout`    | Encerra sessão                | -                             | `GET /logout`               |

### 📋 **Chamados**
| Método | Rota               | Descrição                          | Parâmetros                  | Exemplo de Resposta         |
|--------|--------------------|------------------------------------|-----------------------------|-----------------------------|
| `GET`  | `/chamados`        | Lista todos chamados (admin)       | `?status=aberto` (filtro)   | ```json [{ "id": 1, "titulo": "Impressora quebrada", "status": "aberto" }]``` |
| `POST` | `/chamados`        | Cria novo chamado                  | `{ titulo, descricao, setor }` | ```POST /chamados { "titulo": "Internet lenta", "setor": "RH" }``` |

