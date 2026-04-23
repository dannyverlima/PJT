/* ============================================
   PORTAL ESCOLAR - SCRIPT PRINCIPAL
   ============================================ */

// Configuração Global
const CONFIG = {
    updateInterval: 300000, // 5 minutos
    slideInterval: 10000, // 10 segundos
    clockUpdateInterval: 1000, // 1 segundo
    api: {
        weather: 'https://api.open-meteo.com/v1/forecast',
        location: 'Pombal, Portugal',
        coords: { lat: 40.2368, lon: -8.6378 }
    }
};

// Estado da Aplicação
const AppState = {
    currentDay: new Date(),
    isFriday: new Date().getDay() === 5,
    activeSlide: 0,
    slideTimer: null,
    slideTitles: ['Sobre', 'Calendário Escolar', 'Qualidade do Ar', 'Ementa do Almoço', 'Consumo Escolar'],
    consumptionData: {
        today: { electricity: 285, water: 1240, heating: 92 },
        yesterday: { electricity: 265, water: 1100, heating: 85 },
        thisWeek: { electricity: 1850, water: 8200, heating: 650 },
        lastWeek: { electricity: 1920, water: 8500, heating: 680 }
    },
    weatherData: null
};

/* ============================================
   1. INICIALIZAÇÃO E SETUP
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎓 Portal Escolar iniciando...');
    
    initializeClock();
    initializeSlideRotation();
    initializeCalendar();
    initializeMenuDate();
    initializeConsumption();
    initializeWeatherData();
    setupAutomaticUpdates();
    
    console.log('✅ Portal Escolar carregado com sucesso!');
});

/* ============================================
   2. RELÓGIO DIGITAL EM TEMPO REAL
   ============================================ */

function initializeClock() {
    const clockElement = document.querySelector('.clock-time');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, CONFIG.clockUpdateInterval);
}

/* ============================================
   2. ROTAÇÃO AUTOMÁTICA DOS PAINÉIS
   ============================================ */

function initializeSlideRotation() {
    const slides = Array.from(document.querySelectorAll('.slide-panel'));
    const dotsContainer = document.getElementById('slider-dots');
    const currentLabel = document.querySelector('.slider-current');

    if (!slides.length) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });

    function showSlide(index) {
        AppState.activeSlide = index;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === index;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.slider-dot'));
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
        });

        if (currentLabel) {
            currentLabel.textContent = AppState.slideTitles[index] || `Painel ${index + 1}`;
        }
    }

    function nextSlide() {
        const nextIndex = (AppState.activeSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    showSlide(0);
    if (AppState.slideTimer) {
        clearInterval(AppState.slideTimer);
    }
    AppState.slideTimer = setInterval(nextSlide, CONFIG.slideInterval);
}

/* ============================================
   3. CALENDÁRIO ESCOLAR
   ============================================ */

function initializeCalendar() {
    const calendarWidget = document.getElementById('calendar');
    if (!calendarWidget) return;

    const now = new Date();
    const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };

    const dateString = now.toLocaleDateString('pt-PT', options);
    const dayName = now.toLocaleDateString('pt-PT', { weekday: 'long' });

    calendarWidget.innerHTML = `
        <div class="calendar-widget-date">${now.getDate()}</div>
        <div class="calendar-widget-day">${dayName.toUpperCase()}</div>
    `;
}

/* ============================================
   4. DATA DA EMENTA
   ============================================ */

function initializeMenuDate() {
    const menuDate = document.getElementById('menu-date');
    if (!menuDate) return;

    const today = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const dateString = today.toLocaleDateString('pt-PT', options);
    menuDate.textContent = `📅 ${dateString}`;
}

/* ============================================
   5. CONSUMO ESCOLAR COM COMPARAÇÕES
   ============================================ */

function initializeConsumption() {
    const comparisonContainer = document.getElementById('consumption-comparison');
    if (!comparisonContainer) return;

    const today = new Date();
    const isFriday = today.getDay() === 5;

    let html = '';

    if (!isFriday) {
        // Comparação com dia anterior
        const percentChange = calculatePercentChange(
            AppState.consumptionData.today.electricity,
            AppState.consumptionData.yesterday.electricity
        );
        
        const isIncrease = percentChange > 0;
        const arrowClass = isIncrease ? 'arrow-up' : isIncrease < 0 ? 'arrow-down' : 'arrow-neutral';
        const arrowIcon = isIncrease ? '↑' : isIncrease < 0 ? '↓' : '−';

        html = `
            <div class="comparison-item">
                <div class="comparison-label">
                    <span class="comparison-title">Comparação com ontem</span>
                    <span class="comparison-date">${formatDate(new Date(today.getTime() - 86400000))}</span>
                </div>
                <div class="comparison-chart">
                    <div class="comparison-bar">
                        <div class="bar" style="height: 60px;"></div>
                        <span class="bar-label">Hoje</span>
                    </div>
                    <div class="comparison-bar">
                        <div class="bar" style="height: 55px;"></div>
                        <span class="bar-label">Ontem</span>
                    </div>
                </div>
                <div class="comparison-badge">
                    <span class="comparison-arrow ${arrowClass}">${arrowIcon}</span>
                    <span class="comparison-percent">${Math.abs(percentChange).toFixed(1)}%</span>
                </div>
            </div>
        `;
    } else {
        // Comparação semanal na sexta-feira
        const percentChange = calculatePercentChange(
            AppState.consumptionData.thisWeek.electricity,
            AppState.consumptionData.lastWeek.electricity
        );
        
        const isIncrease = percentChange > 0;
        const arrowClass = isIncrease ? 'arrow-up' : isIncrease < 0 ? 'arrow-down' : 'arrow-neutral';
        const arrowIcon = isIncrease ? '↑' : isIncrease < 0 ? '↓' : '−';
        html = `
            <div class="comparison-item">
                <div class="comparison-label">
                    <span class="comparison-title">Média Semanal</span>
                    <span class="comparison-date">Semana atual vs anterior</span>
                </div>
                <div class="comparison-chart">
                    <div class="comparison-bar">
                        <div class="bar" style="height: 65px;"></div>
                        <span class="bar-label">Esta</span>
                    </div>
                    <div class="comparison-bar">
                        <div class="bar" style="height: 70px;"></div>
                        <span class="bar-label">Anterior</span>
                    </div>
                </div>
                <div class="comparison-badge">
                    <span class="comparison-arrow ${arrowClass}">${arrowIcon}</span>
                    <span class="comparison-percent">${Math.abs(percentChange).toFixed(1)}%</span>
                </div>
            </div>
        `;
    }

    comparisonContainer.innerHTML = html;
}

function calculatePercentChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('pt-PT', options);
}

/* ============================================
   6. DADOS METEOROLÓGICOS (SIMULAÇÃO/API)
   ============================================ */

function initializeWeatherData() {
    // Dados simulados (em produção, seria uma API real)
    const weatherData = {
        current: {
            temperature: 15,
            condition: 'Bastante nublado',
            wind: 'Rajadas até 13 km/h',
            humidity: 72,
            pressure: 1013
        },
        hourly: [
            { time: '10h', temp: 15, icon: '☁️' },
            { time: '11h', temp: 16, icon: '☁️' },
            { time: '12h', temp: 17, icon: '☁️' },
            { time: '13h', temp: 19, icon: '☁️' },
            { time: '14h', temp: 20, icon: '☁️' },
            { time: '15h', temp: 20, icon: '☁️' },
            { time: '16h', temp: 20, icon: '☁️' }
        ],
        daily: [
            { day: 'hoje', icon: '☁️', min: 10, max: 21, high: 21 },
            { day: 'sex.', icon: '⛅', min: 10, max: 22, high: 22 },
            { day: 'sáb.', icon: '☀️', min: 12, max: 23, high: 23 },
            { day: 'dom.', icon: '⛅', min: 12, max: 26, high: 26 },
            { day: 'seg.', icon: '⛅', min: 13, max: 28, high: 28 },
            { day: 'ter.', icon: '☁️', min: 12, max: 25, high: 25 }
        ]
    };

    AppState.weatherData = weatherData;
    updateWeatherUI(weatherData);
}

function updateWeatherUI(data) {
    // Atualizar temperatura atual
    const currentTemp = document.getElementById('current-temp');
    if (currentTemp) {
        currentTemp.textContent = Math.round(data.current.temperature);
    }

    // Atualizar status
    const weatherStatus = document.getElementById('weather-status');
    if (weatherStatus) {
        weatherStatus.innerHTML = `
            <span class="status-text">${data.current.condition}</span>
            <span class="status-wind">${data.current.wind}</span>
        `;
    }

    // Atualizar previsão por horas
    const forecastContainer = document.getElementById('weather-forecast');
    if (forecastContainer && data.hourly) {
        const hourlyHTML = data.hourly.map(hour => `
            <div class="forecast-hour">
                <div class="forecast-hour-time">${hour.time}</div>
                <div class="forecast-hour-icon">${hour.icon}</div>
                <div class="forecast-hour-temp">${hour.temp}°</div>
            </div>
        `).join('');

        forecastContainer.innerHTML = `<div class="forecast-hours">${hourlyHTML}</div>`;
    }

    // Atualizar previsão 7 dias
    const daysContainer = document.getElementById('weather-10days');
    if (daysContainer && data.daily) {
        const daysHTML = data.daily.map(day => `
            <div class="forecast-day">
                <div class="day-info">
                    <span class="day-name">${day.day}</span>
                    <span class="day-icon">${day.icon}</span>
                    <div class="day-temps">
                        <span class="day-min">${day.min}°</span>
                        <span class="day-max">${day.max}°</span>
                    </div>
                </div>
                <div class="day-temp-chart"></div>
                <div class="day-high">${day.high}°</div>
            </div>
        `).join('');

        daysContainer.innerHTML = daysHTML;
    }
}

/* ============================================
   7. ATUALIZAÇÕES AUTOMÁTICAS
   ============================================ */

function setupAutomaticUpdates() {
    // Atualizar dados a cada 5 minutos
    setInterval(() => {
        console.log('🔄 Atualizando dados...');
        
        // Simular mudanças nos dados
        AppState.consumptionData.today.electricity += Math.floor(Math.random() * 20 - 10);
        
        // Re-renderizar componentes
        initializeConsumption();
        simulateWeatherUpdates();
    }, CONFIG.updateInterval);
}

function simulateWeatherUpdates() {
    // Simular pequenas variações na temperatura
    if (AppState.weatherData) {
        const variation = (Math.random() - 0.5) * 2; // -1 to +1
        AppState.weatherData.current.temperature += variation;
        updateWeatherUI(AppState.weatherData);
    }
}

/* ============================================
   8. UTILITÁRIOS GERAIS
   ============================================ */

// Observer para detecção de elementos visíveis (para animações)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar cards para animações
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

/* ============================================
   9. MODO ESCURO (Opcional)
   ============================================ */

function initializeDarkModeToggle() {
    document.documentElement.classList.add('dark-mode');
}

// Chamar na inicialização
initializeDarkModeToggle();

/* ============================================
   10. MICRO-ANIMAÇÕES E INTERATIVIDADE
   ============================================ */

// Adicionar efeito de hover interativo nas cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Animar barras de qualidade do ar quando visíveis
const airQualityBars = document.querySelectorAll('.air-indicator');
const airObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

airQualityBars.forEach(bar => airObserver.observe(bar));

/* ============================================
   11. ACESSIBILIDADE E PERFORMANCE
   ============================================ */

// Detectar preferência por menos movimento
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

// Lazy loading otimizado para imagens
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ============================================
   12. DEBUG E LOGGING (Remover em Produção)
   ============================================ */

console.group('📊 Estado da Aplicação');
console.table(AppState);
console.groupEnd();

console.log('📍 Localização:', CONFIG.api.location);
console.log('🌍 Coordenadas:', CONFIG.api.coords);
console.log('⏰ Intervalo de atualização:', CONFIG.updateInterval / 1000, 'segundos');
