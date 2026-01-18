/**
 * Script para verificar o status do bot em tempo real
 * Adicione este script ao final do seu index.html, antes de </body>
 * 
 * Exemplo de uso no HTML:
 * <div data-bot-status>Online 🟢</div>
 * <script src="./templates/check-bot-status.js"></script>
 * <script>
 *   // Configure a URL do seu bot e a API Key
 *   const BOT_API_CONFIG = {
 *     url: 'https://seu-bot-url.discloud.app/api/bot-status',
 *     apiKey: 'sua-chave-api-aqui'
 *   };
 * </script>
 */

(function() {
    // ========== CONFIGURAÇÃO (MUDE ESTES VALORES!) ==========
    
    // 1. URL do seu bot no Discloud
    // Exemplo: https://marbleshub-12345.discloud.app
    const BOT_API_URL = typeof BOT_API_CONFIG !== 'undefined' 
        ? BOT_API_CONFIG.url 
        : 'https://seu-bot-url-aqui.discloud.app/api/bot-status';
    
    // 2. Chave de API (obtenha do seu .env BOT_API_KEY)
    const API_KEY = typeof BOT_API_CONFIG !== 'undefined' 
        ? BOT_API_CONFIG.apiKey 
        : 'sua-chave-api-aqui';
    
    // Intervalo de verificação (em ms)
    const CHECK_INTERVAL = 30000; // 30 segundos
    
    // ========== FUNÇÃO PRINCIPAL ==========
    async function checkBotStatus() {
        try {
            const response = await fetch(BOT_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY  // Envia a API Key
                },
                mode: 'cors',
                timeout: 5000
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            updateStatusDisplay(data, true);
            console.log('✅ Bot Status:', data);
            return data;
        } catch (error) {
            console.warn('⚠️ Erro ao verificar status do bot:', error);
            updateStatusDisplay({ online: false, error: error.message }, false);
        }
    }
    
    function updateStatusDisplay(data, isSuccessful) {
        // Procura pelo elemento que mostra o status
        const statusElements = document.querySelectorAll('[data-bot-status], .bot-status, .status-badge');
        
        if (statusElements.length === 0) {
            console.warn('⚠️ Nenhum elemento com status encontrado');
            return;
        }
        
        statusElements.forEach(element => {
            updateElement(element, data, isSuccessful);
        });
    }
    
    function updateElement(element, data, isSuccessful) {
        if (!element) return;
        
        if (data.online && isSuccessful) {
            // ✅ Bot online
            element.textContent = '🟢 Online';
            element.style.color = '#10b981';
            element.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
            element.dataset.botOnline = 'true';
            
            element.classList.remove('offline', 'error');
            element.classList.add('online');
        } else {
            // ❌ Bot offline
            element.textContent = '🔴 Offline';
            element.style.color = '#ef4444';
            element.style.textShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
            element.dataset.botOnline = 'false';
            
            element.classList.remove('online', 'error');
            element.classList.add('offline');
        }
    }
    
    // ========== INICIALIZAÇÃO ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Iniciando verificação de status do bot...');
            checkBotStatus();
            setInterval(checkBotStatus, CHECK_INTERVAL);
        });
    } else {
        // Página já carregou
        checkBotStatus();
        setInterval(checkBotStatus, CHECK_INTERVAL);
    }
})();
