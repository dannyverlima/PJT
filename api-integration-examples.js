/* ============================================
   GUIA DE INTEGRAÇÃO COM APIs REAIS
   Exemplos de código para expandir o projeto
   ============================================ */

/*
   ESTE ARQUIVO CONTÉM EXEMPLOS DE COMO INTEGRAR
   DADOS REAIS COM DIFERENTES APIs E BACKENDS.
   
   Copie e adapte conforme necessário.
*/

/* ============================================
   1. INTEGRAÇÃO COM OPEN-METEO (METEOROLOGIA)
   ============================================ */

/**
 * Fetcha dados meteorológicos reais da Open-Meteo
 * API gratuita, sem chave necessária
 */
async function fetchWeatherFromOpenMeteo(latitude = 40.2368, longitude = -8.6378) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,humidity&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Lisbon`
        );
        
        if (!response.ok) throw new Error('Erro ao buscar dados meteorológicos');
        
        const data = await response.json();
        
        return {
            current: {
                temperature: Math.round(data.current.temperature_2m),
                condition: getWeatherDescription(data.current.weather_code),
                wind: `Rajadas até ${Math.round(data.current.wind_speed_10m)} km/h`,
                humidity: data.current.humidity,
                weatherCode: data.current.weather_code
            },
            hourly: data.hourly.time.slice(0, 7).map((time, idx) => ({
                time: new Date(time).toLocaleTimeString('pt-PT', { hour: '2-digit' }),
                temp: Math.round(data.hourly.temperature_2m[idx]),
                icon: getWeatherIcon(data.hourly.weather_code[idx])
            })),
            daily: data.daily.time.map((time, idx) => ({
                day: getDayName(new Date(time)),
                icon: getWeatherIcon(data.daily.weather_code[idx]),
                min: Math.round(data.daily.temperature_2m_min[idx]),
                max: Math.round(data.daily.temperature_2m_max[idx]),
                high: Math.round(data.daily.temperature_2m_max[idx])
            }))
        };
    } catch (error) {
        console.error('❌ Erro ao buscar meteorologia:', error);
        return null;
    }
}

/**
 * Converte código WMO em descrição
 */
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Céu limpo',
        1: 'Principalmente claro',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        48: 'Nevoeiro com granizo',
        51: 'Chuvisco ligeiro',
        53: 'Chuvisco moderado',
        55: 'Chuvisco intenso',
        61: 'Chuva ligeira',
        63: 'Chuva moderada',
        65: 'Chuva intensa',
        71: 'Neve ligeira',
        73: 'Neve moderada',
        75: 'Neve intensa',
        77: 'Granizo',
        80: 'Aguaceiros ligeiros',
        81: 'Aguaceiros moderados',
        82: 'Aguaceiros intensos',
        85: 'Aguaceiros de neve ligeiros',
        86: 'Aguaceiros de neve intensos',
        95: 'Trovoada',
        96: 'Trovoada com granizo ligeiro',
        99: 'Trovoada com granizo intenso'
    };
    return descriptions[code] || 'Desconhecido';
}

/**
 * Retorna emoji apropriado para código WMO
 */
function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 86) return '🌨️';
    if (code >= 80 && code <= 82) return '⛈️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌤️';
}

/**
 * Retorna nome abreviado do dia
 */
function getDayName(date) {
    const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    return days[date.getDay()];
}

// Usar na inicialização:
// const weatherData = await fetchWeatherFromOpenMeteo();
// updateWeatherUI(weatherData);

/* ============================================
   2. INTEGRAÇÃO COM QUALIDADE DO AR (WAQI)
   ============================================ */

/**
 * Fetcha dados de qualidade do ar em tempo real
 * Requer token gratuito em https://aqicn.org/api/
 */
async function fetchAirQualityData(token = 'YOUR_TOKEN_HERE') {
    try {
        // Dados por sala (seria num backend real)
        const rooms = {
            '317': { lat: 40.2368, lon: -8.6378 },
            '318': { lat: 40.2368, lon: -8.6378 },
            '319': { lat: 40.2368, lon: -8.6378 },
            '320': { lat: 40.2368, lon: -8.6378 },
            '321': { lat: 40.2368, lon: -8.6378 }
        };

        const airData = {};

        for (const [room, coords] of Object.entries(rooms)) {
            try {
                const response = await fetch(
                    `https://api.waqi.info/feed/geo:${coords.lat};${coords.lon}/?token=${token}`
                );
                const data = await response.json();

                if (data.status === 'ok') {
                    const aqi = data.data.aqi;
                    airData[room] = {
                        aqi: aqi,
                        co2: aqi, // Simplificado
                        status: getAirQualityStatus(aqi),
                        color: getAirQualityColor(aqi)
                    };
                }
            } catch (error) {
                console.error(`Erro ao buscar qualidade do ar para sala ${room}:`, error);
            }
        }

        return airData;
    } catch (error) {
        console.error('❌ Erro ao buscar dados de qualidade do ar:', error);
        return null;
    }
}

/**
 * Retorna status de qualidade do ar
 */
function getAirQualityStatus(aqi) {
    if (aqi <= 50) return 'Excelente';
    if (aqi <= 100) return 'Bom';
    if (aqi <= 150) return 'Aceitável';
    if (aqi <= 200) return 'Prejudicial';
    if (aqi <= 300) return 'Muito Prejudicial';
    return 'Perigoso';
}

/**
 * Retorna cor para status de qualidade do ar
 */
function getAirQualityColor(aqi) {
    if (aqi <= 50) return '#10b981'; // Verde
    if (aqi <= 100) return '#3b82f6'; // Azul
    if (aqi <= 150) return '#f59e0b'; // Laranja
    if (aqi <= 200) return '#ef4444'; // Vermelho
    if (aqi <= 300) return '#7c3aed'; // Roxo
    return '#000000'; // Preto
}

// Usar na inicialização:
// const airData = await fetchAirQualityData('YOUR_TOKEN');
// updateAirQualityUI(airData);

/* ============================================
   3. INTEGRAÇÃO COM BACKEND PRÓPRIO (CALENDÁRIO)
   ============================================ */

/**
 * Fetcha calendário escolar do backend
 */
async function fetchSchoolCalendar(apiUrl = 'http://localhost:3000/api') {
    try {
        const response = await fetch(`${apiUrl}/calendar`);
        
        if (!response.ok) throw new Error('Erro ao buscar calendário');
        
        const events = await response.json();
        
        return {
            events: events.map(event => ({
                id: event.id,
                date: new Date(event.date),
                name: event.name,
                type: event.type, // 'exam', 'holiday', 'activity'
                description: event.description
            }))
        };
    } catch (error) {
        console.error('❌ Erro ao buscar calendário:', error);
        return null;
    }
}

/**
 * Exemplo de POST para adicionar evento (necessita autenticação)
 */
async function addCalendarEvent(event, token) {
    try {
        const response = await fetch(
            'http://localhost:3000/api/calendar',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(event)
            }
        );
        
        if (!response.ok) throw new Error('Erro ao adicionar evento');
        
        return await response.json();
    } catch (error) {
        console.error('❌ Erro ao adicionar evento:', error);
        return null;
    }
}

// Usar:
// const calendar = await fetchSchoolCalendar();
// renderCalendarEvents(calendar.events);

/* ============================================
   4. INTEGRAÇÃO COM EMENTA (BACKEND)
   ============================================ */

/**
 * Fetcha ementa do almoço para um dia específico
 */
async function fetchMenuData(date = new Date(), apiUrl = 'http://localhost:3000/api') {
    try {
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const response = await fetch(
            `${apiUrl}/menu/${dateStr}`
        );
        
        if (!response.ok) throw new Error('Ementa não disponível');
        
        const menu = await response.json();
        
        return {
            date: new Date(menu.date),
            entrada: menu.entrada,
            pratoPrincipal: menu.pratoPrincipal,
            acompanhamento: menu.acompanhamento,
            sobremesa: menu.sobremesa,
            bebida: menu.bebida,
            alergenos: menu.alergenos || []
        };
    } catch (error) {
        console.error('❌ Erro ao buscar ementa:', error);
        return null;
    }
}

/**
 * Exemplo de resposta esperada do backend:
 * 
 * {
 *   "date": "2026-04-23",
 *   "entrada": "Sopa de Abóbora",
 *   "pratoPrincipal": "Frango Grelhado com Batata",
 *   "acompanhamento": "Salada Mista",
 *   "sobremesa": "Maçã Fresca",
 *   "bebida": "Água ou Sumo Natural",
 *   "alergenos": ["glúten", "lactose"]
 * }
 */

// Usar:
// const menu = await fetchMenuData();
// updateMenuUI(menu);

/* ============================================
   5. INTEGRAÇÃO COM DADOS DE CONSUMO (BACKEND)
   ============================================ */

/**
 * Fetcha dados de consumo da escola
 */
async function fetchConsumptionData(apiUrl = 'http://localhost:3000/api') {
    try {
        const response = await fetch(`${apiUrl}/consumption`);
        
        if (!response.ok) throw new Error('Erro ao buscar dados de consumo');
        
        const data = await response.json();
        
        return {
            today: {
                electricity: data.today.electricity,
                water: data.today.water,
                heating: data.today.heating,
                timestamp: new Date(data.today.timestamp)
            },
            yesterday: {
                electricity: data.yesterday.electricity,
                water: data.yesterday.water,
                heating: data.yesterday.heating
            },
            thisWeek: {
                electricity: data.thisWeek.electricity,
                water: data.thisWeek.water,
                heating: data.thisWeek.heating
            },
            lastWeek: {
                electricity: data.lastWeek.electricity,
                water: data.lastWeek.water,
                heating: data.lastWeek.heating
            }
        };
    } catch (error) {
        console.error('❌ Erro ao buscar consumo:', error);
        return null;
    }
}

/**
 * Fetcha histórico de consumo para gráficos
 */
async function fetchConsumptionHistory(days = 30, apiUrl = 'http://localhost:3000/api') {
    try {
        const response = await fetch(
            `${apiUrl}/consumption/history?days=${days}`
        );
        
        if (!response.ok) throw new Error('Erro ao buscar histórico');
        
        return await response.json();
    } catch (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        return null;
    }
}

/**
 * Exemplo de resposta esperada:
 * 
 * {
 *   "today": {
 *     "electricity": 285,
 *     "water": 1240,
 *     "heating": 92,
 *     "timestamp": "2026-04-23T14:30:00Z"
 *   },
 *   "yesterday": {
 *     "electricity": 265,
 *     "water": 1100,
 *     "heating": 85
 *   },
 *   "thisWeek": {
 *     "electricity": 1850,
 *     "water": 8200,
 *     "heating": 650
 *   },
 *   "lastWeek": {
 *     "electricity": 1920,
 *     "water": 8500,
 *     "heating": 680
 *   }
 * }
 */

// Usar:
// const consumption = await fetchConsumptionData();
// updateConsumptionUI(consumption);

/* ============================================
   6. CONFIGURAÇÃO DE AUTENTICAÇÃO
   ============================================ */

/**
 * Sistema simples de autenticação com JWT
 */
class AuthManager {
    constructor(apiUrl = 'http://localhost:3000/api') {
        this.apiUrl = apiUrl;
        this.token = localStorage.getItem('auth_token');
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) throw new Error('Erro ao fazer login');

            const data = await response.json();
            this.token = data.token;
            localStorage.setItem('auth_token', this.token);

            return data;
        } catch (error) {
            console.error('❌ Erro ao fazer login:', error);
            return null;
        }
    }

    async logout() {
        localStorage.removeItem('auth_token');
        this.token = null;
    }

    isAuthenticated() {
        return !!this.token;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
}

// Usar:
// const auth = new AuthManager();
// await auth.login('user@school.edu', 'password');
// const headers = auth.getHeaders(); // Para requests autenticados

/* ============================================
   7. SISTEMA DE NOTIFICAÇÕES EM TEMPO REAL
   ============================================ */

/**
 * Conecta a WebSockets para atualizações em tempo real
 */
class RealtimeConnection {
    constructor(wsUrl = 'ws://localhost:3000') {
        this.wsUrl = wsUrl;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect() {
        try {
            this.ws = new WebSocket(this.wsUrl);

            this.ws.onopen = () => {
                console.log('✅ Conectado a atualizações em tempo real');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealtimeUpdate(data);
            };

            this.ws.onerror = (error) => {
                console.error('❌ Erro na conexão WebSocket:', error);
            };

            this.ws.onclose = () => {
                console.log('⚠️ Desconectado de atualizações em tempo real');
                this.reconnect();
            };
        } catch (error) {
            console.error('❌ Erro ao conectar WebSocket:', error);
            this.reconnect();
        }
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.pow(2, this.reconnectAttempts) * 1000;
            console.log(`⏳ Tentando reconectar em ${delay}ms...`);
            setTimeout(() => this.connect(), delay);
        }
    }

    handleRealtimeUpdate(data) {
        console.log('📊 Atualização em tempo real:', data);

        switch (data.type) {
            case 'consumption_update':
                updateConsumptionUI(data.payload);
                break;
            case 'weather_update':
                updateWeatherUI(data.payload);
                break;
            case 'air_quality_update':
                updateAirQualityUI(data.payload);
                break;
            case 'notification':
                showNotification(data.payload);
                break;
            default:
                console.log('Tipo de atualização desconhecida:', data.type);
        }
    }

    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Usar:
// const realtime = new RealtimeConnection();
// realtime.connect();

/* ============================================
   8. CACHING E SINCRONIZAÇÃO
   ============================================ */

/**
 * Gerenciador de cache com sincronização automática
 */
class CacheManager {
    constructor(storageKey = 'portal_cache') {
        this.storageKey = storageKey;
        this.cache = this.loadCache();
    }

    loadCache() {
        try {
            const cached = localStorage.getItem(this.storageKey);
            return cached ? JSON.parse(cached) : {};
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
            return {};
        }
    }

    saveCache() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }

    set(key, value, ttl = 3600000) { // 1 hora por padrão
        this.cache[key] = {
            value,
            timestamp: Date.now(),
            ttl
        };
        this.saveCache();
    }

    get(key) {
        const item = this.cache[key];
        
        if (!item) return null;
        
        // Verificar se expirou
        if (Date.now() - item.timestamp > item.ttl) {
            delete this.cache[key];
            this.saveCache();
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.cache = {};
        localStorage.removeItem(this.storageKey);
    }

    clearExpired() {
        let cleared = 0;
        for (const key in this.cache) {
            const item = this.cache[key];
            if (Date.now() - item.timestamp > item.ttl) {
                delete this.cache[key];
                cleared++;
            }
        }
        if (cleared > 0) {
            this.saveCache();
            console.log(`🧹 ${cleared} itens expirados removidos do cache`);
        }
    }
}

// Usar:
// const cache = new CacheManager();
// cache.set('weather', weatherData, 300000); // 5 minutos
// const cached = cache.get('weather');

/* ============================================
   9. FUNÇÃO DE INICIALIZAÇÃO COMPLETA
   ============================================ */

/**
 * Inicializa o portal com todas as integrações
 */
async function initializePortalWithAPIs() {
    console.log('🚀 Inicializando portal com APIs reais...');

    try {
        // 1. Autenticação
        const auth = new AuthManager();
        if (!auth.isAuthenticated()) {
            console.log('⚠️ Utilizador não autenticado');
            // Redirecionar para login ou usar modo demo
        }

        // 2. Cache Manager
        const cache = new CacheManager();
        cache.clearExpired();

        // 3. Buscar Meteorologia
        let weatherData = cache.get('weather');
        if (!weatherData) {
            weatherData = await fetchWeatherFromOpenMeteo();
            if (weatherData) {
                cache.set('weather', weatherData, 300000); // 5 minutos
                updateWeatherUI(weatherData);
            }
        }

        // 4. Buscar Calendário
        const calendarData = await fetchSchoolCalendar();
        if (calendarData) {
            renderCalendarEvents(calendarData.events);
        }

        // 5. Buscar Ementa
        const menuData = await fetchMenuData();
        if (menuData) {
            renderMenu(menuData);
        }

        // 6. Buscar Consumo
        const consumptionData = await fetchConsumptionData();
        if (consumptionData) {
            updateConsumptionUI(consumptionData);
        }

        // 7. Buscar Qualidade do Ar
        const airData = await fetchAirQualityData();
        if (airData) {
            updateAirQualityUI(airData);
        }

        // 8. Conectar WebSocket para atualizações em tempo real
        const realtime = new RealtimeConnection();
        realtime.connect();

        // 9. Configurar atualizações periódicas
        setInterval(async () => {
            const fresh = await fetchWeatherFromOpenMeteo();
            if (fresh) updateWeatherUI(fresh);
        }, 300000); // A cada 5 minutos

        console.log('✅ Portal inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar portal:', error);
    }
}

// Descomentar para usar:
// initializePortalWithAPIs();

/* ============================================
   10. FUNÇÕES DE RENDERIZAÇÃO (PLACEHOLDERS)
   ============================================ */

function renderCalendarEvents(events) {
    console.log('📅 Renderizando eventos:', events);
    // Implementar UI de eventos
}

function renderMenu(menu) {
    console.log('🍽️ Renderizando menu:', menu);
    // Implementar UI de menu
}

function updateAirQualityUI(airData) {
    console.log('💨 Atualizando qualidade do ar:', airData);
    // Implementar UI de qualidade do ar
}

function showNotification(notification) {
    console.log('🔔 Notificação:', notification);
    // Implementar sistema de notificações
}

/* ============================================
   EXPORTAR PARA USO MODULAR
   ============================================ */

export {
    fetchWeatherFromOpenMeteo,
    fetchAirQualityData,
    fetchSchoolCalendar,
    fetchMenuData,
    fetchConsumptionData,
    fetchConsumptionHistory,
    AuthManager,
    RealtimeConnection,
    CacheManager,
    initializePortalWithAPIs
};
