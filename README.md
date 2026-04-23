# 📚 Portal Escolar Inteligente - Documentação Completa

## Visão Geral

Portal Escolar Inteligente é uma plataforma web moderna, elegante e minimalista desenvolvida para instituições educacionais. O sistema oferece um dashboard informativo com dados em tempo real, design premium e excelente experiência do utilizador (UX).

---

## 🎨 Características Principais

### Design & Estética
- ✨ **Design Minimalista**: Interface limpa sem poluição visual
- 🎭 **Visual Premium**: Aparência sofisticada e institucional
- 📐 **Layout Responsivo**: Funciona perfeitamente em desktop, tablet e telemóvel
- 🎪 **Animações Suaves**: Transições delicadas e microanimações profissionais
- 🎨 **Paleta Harmoniosa**: Cores suaves, elegantes e bem equilibradas

### Funcionalidades
1. **Relógio Digital em Tempo Real** ⏰
   - Exibição com horas, minutos e segundos
   - Atualização contínua
   - Design elegante com gradiente

2. **Widget Meteorológico** 🌤️
   - Temperatura atual
   - Condições meteorológicas
   - Previsão por horas
   - Previsão para 7 dias
   - Posicionado no canto direito (sidebar pegajosa)

3. **Calendário Escolar** 📅
   - Data e dia atual
   - Eventos importantes (exames, férias, atividades)
   - Visual limpo e intuitivo

4. **Qualidade do Ar por Sala** 💨
   - Monitoramento de 5 salas (317, 318, 319, 320, 321)
   - Indicadores visuais (Excelente, Bom, Aceitável)
   - Barras de progresso animadas
   - Valores em ppm

5. **Ementa do Almoço** 🍽️
   - Data do dia
   - Entrada, prato principal, acompanhamento, sobremesa, bebida
   - Design elegante com gradiente

6. **Consumo Escolar** ⚡
   - **Dia de Semana**: Comparação com dia anterior
   - **Sexta-Feira**: Média semanal vs semana anterior
   - Indicadores visuais (setas, percentagens)
   - Subcategorias: Eletricidade, Água, Aquecimento

---

## 📁 Estrutura do Projeto

```
PJT/
├── index.html          # Estrutura HTML semântica
├── styles.css          # Estilos moderno e responsivo
├── script.js           # Funcionalidades JavaScript
├── README.md           # Documentação (este arquivo)
└── assets/             # Recursos (imagens, ícones, etc.)
```

---

## 🚀 Como Usar

### Instalação Básica
1. Clone ou baixe o repositório
2. Abra `index.html` num navegador moderno
3. O site carregará automaticamente com dados simulados

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Nenhuma dependência externa necessária para versão básica
- JavaScript ativado

---

## 📋 Estrutura HTML

### Seções Principais

```html
<!-- HEADER -->
<header class="header">
  Logo e título da página
</header>

<!-- LAYOUT WRAPPER -->
<div class="layout-wrapper">
  <!-- CONTEÚDO PRINCIPAL -->
  <section class="main-content">
    <div class="cards-grid">
      <!-- Múltiplos cards informativos -->
    </div>
  </section>

  <!-- WIDGET METEOROLÓGICO (SIDEBAR) -->
  <aside class="weather-widget">
    <!-- Relógio, localização, tempo, previsão -->
  </aside>
</div>
```

---

## 🎨 Design System CSS

### Variáveis Globais

```css
:root {
    /* Cores */
    --color-primary: #2563eb;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    
    /* Espaçamento */
    --spacing-lg: 2rem;
    --spacing-md: 1.5rem;
    
    /* Tipografia */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
    --font-size-xl: 1.25rem;
    
    /* Sombras */
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    
    /* Transições */
    --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Classes Principais

| Classe | Descrição |
|--------|-----------|
| `.card` | Container base para conteúdo |
| `.cards-grid` | Grid responsivo de cards |
| `.weather-widget` | Sidebar com informações meteorológicas |
| `.layout-wrapper` | Container principal do layout |
| `.card-header` | Cabeçalho de cada card |
| `.card-body` | Corpo de cada card |

---

## ⚙️ Funcionalidades JavaScript

### Módulos Principais

#### 1. **initializeClock()**
Atualiza relógio digital em tempo real.
```javascript
// Resultado: HH:MM:SS
// Atualização: a cada segundo
```

#### 2. **initializeCalendar()**
Exibe data e dia da semana atual.

#### 3. **initializeConsumption()**
Calcula e exibe comparação de consumo:
- **Dias normais**: vs dia anterior
- **Sexta-feira**: média semanal vs semana anterior
- Indicadores visuais (↑ ↓ −)

#### 4. **initializeWeatherData()**
Gerencia dados meteorológicos.
- Temperatura atual
- Previsão por horas
- Previsão 7 dias

#### 5. **setupAutomaticUpdates()**
Atualiza dados automaticamente cada 5 minutos.

---

## 🔄 Integração com APIs Reais

### Adicionando Dados Dinâmicos

#### 1. **API Meteorológica**
```javascript
// Substituir initializeWeatherData() por:
async function fetchWeatherData() {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m`
    );
    const data = await response.json();
    // Processar dados
}
```

#### 2. **API Qualidade do Ar**
```javascript
// Exemplo com API real:
async function fetchAirQuality() {
    const response = await fetch(
        'https://api.waqi.info/feed/Pombal/?token=YOUR_TOKEN'
    );
    const data = await response.json();
    // Atualizar UI com dados reais
}
```

#### 3. **Calendário Escolar**
```javascript
// Integrar com backend escolar:
async function fetchSchoolCalendar() {
    const response = await fetch('/api/calendar');
    const events = await response.json();
    renderCalendarEvents(events);
}
```

#### 4. **Ementa do Almoço**
```javascript
async function fetchMenuData() {
    const response = await fetch(`/api/menu/${today}`);
    const menu = await response.json();
    renderMenu(menu);
}
```

#### 5. **Dados de Consumo**
```javascript
async function fetchConsumptionData() {
    const response = await fetch('/api/consumption');
    const data = await response.json();
    updateConsumption(data);
}
```

---

## 📱 Responsividade

### Breakpoints

| Breakpoint | Largura | Ajustes |
|-----------|---------|---------|
| Desktop | 1400px+ | Layout 2 colunas (main + sidebar) |
| Tablet | 1024px | Cards com 2 colunas |
| Móvel | 768px | Cards com 1 coluna |
| Móvel Pequeno | 480px | Ajustes adicionais |

### Media Queries Aplicadas
- Grid responsivo que se adapta automaticamente
- Tipografia escalável
- Espaciamento ajustado
- Sidebar integrada no fluxo móvel

---

## ♿ Acessibilidade

### Implementações
- ✅ Semântica HTML5 apropriada
- ✅ Suporte a modo escuro do SO
- ✅ Respeito a `prefers-reduced-motion`
- ✅ Contraste de cores WCAG AA
- ✅ Estrutura lógica de navegação

### Para Melhorar
```html
<!-- Adicionar ARIA labels -->
<div role="status" aria-live="polite">
  Dados atualizados
</div>

<!-- Adicionar descrições -->
<img alt="Temperatura atual: 15°C">
```

---

## 🎯 Sugestões de Melhorias Futuras

### 1. **Autenticação e Permissões**
```javascript
// Sistema de login com roles (Admin, Professor, Aluno)
- Dashboard personalizado por tipo de utilizador
- Histórico de acesso
- Notificações personalizadas
```

### 2. **Animações Avançadas**
```css
/* Transições de página */
@keyframes fadeIn { }
@keyframes slideUp { }

/* Loader customizado */
.loader { }
```

### 3. **Sistema de Notificações**
```javascript
// Toast notifications
- Alertas de consumo elevado
- Lembretes de eventos
- Avisos de qualidade do ar
```

### 4. **Gráficos Avançados**
```javascript
// Integrar Chart.js ou D3.js
- Gráfico de consumo semanal/mensal
- Histórico de temperatura
- Tendências de qualidade do ar
```

### 5. **PWA (Progressive Web App)**
```json
// Manifesto web app
{
  "name": "Portal Escolar",
  "display": "standalone",
  "icons": []
}
```

### 6. **Modo Offline**
```javascript
// Service Worker para cache
- Funcionalidade offline
- Sincronização em background
- Notificações offline
```

### 7. **Themes Customizáveis**
```javascript
// Sistema de temas
- Múltiplas paletas de cores
- Espaçamento customizável
- Tipografia variável
```

### 8. **Dashboard Administrativo**
```
- Edição de eventos
- Gerenciamento de salas
- Controle de consumo
- Relatórios detalhados
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Grid, Flexbox, Gradientes, Animações
- **JavaScript ES6+**: Moderno e otimizado
- **Responsive Design**: Mobile-first approach

### Ferramentas Recomendadas
- **VS Code**: Editor de código
- **DevTools**: Debugging
- **Lighthouse**: Performance audit
- **WAVE**: Acessibilidade

### Frameworks Opcionais (para expansão)
- **React/Vue**: Para interfaces mais complexas
- **Tailwind CSS**: Para estilização rápida
- **Chart.js**: Para gráficos
- **Socket.io**: Para atualizações em tempo real

---

## 📊 Performance

### Otimizações Implementadas
- ✅ CSS modular e reutilizável
- ✅ JavaScript sem dependências
- ✅ Lazy loading ready
- ✅ Imagens otimizadas
- ✅ Cache-friendly structure

### Scores Esperados
- **Lighthouse**: 90+
- **Core Web Vitals**: Verde
- **Accessibility**: 95+

---

## 🔐 Segurança

### Recomendações
1. **Validação de Dados**
   - Sanitizar inputs do utilizador
   - Validação lado cliente e servidor
   - Rate limiting em APIs

2. **Autenticação**
   - JWT tokens
   - HTTPS obrigatório
   - CORS configurado

3. **Proteção de Dados**
   - Criptografia de senhas
   - XSS prevention
   - CSRF tokens

---

## 📝 Convenções de Código

### Naming
```javascript
// Classes e IDs
.card-header          // kebab-case para CSS
cardHeader()          // camelCase para JS
CONSTANT_VALUE        // UPPER_SNAKE_CASE para constantes
```

### Estrutura
```javascript
// 1. Importações/Setup
// 2. Configurações
// 3. Estado
// 4. Inicialização
// 5. Funções (organizadas por módulo)
// 6. Utilitários
```

---

## 🐛 Debugging

### Console Logs
```javascript
// Ativo durante desenvolvimento
console.log('🎓 Portal Escolar iniciando...');
console.table(AppState);
```

### DevTools
1. **Elements**: Inspecionar HTML/CSS
2. **Console**: Checar erros e logs
3. **Network**: Monitorar requisições
4. **Performance**: Analisar velocidade
5. **Accessibility**: Testar a11y

---

## 📞 Suporte e Manutenção

### Problemas Comuns

**Problema**: Relógio não atualiza
```javascript
// Solução: Verificar se initializeClock() foi chamado
// Verificar console para erros
```

**Problema**: Dados não carregam
```javascript
// Solução: Verificar conexão de rede
// Testar API endpoints
```

**Problema**: Layout quebrado em móvel
```css
/* Solução: Verificar media queries */
/* Testar em diferentes resoluções */
```

---

## 📚 Referências Úteis

### Documentação
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [Web.dev](https://web.dev/)

### APIs Recomendadas
- [Open-Meteo Weather API](https://open-meteo.com/)
- [WAQI Air Quality API](https://aqicn.org/api/)
- [OpenStreetMap Geocoding](https://nominatim.openstreetmap.org/)

### CSS Resources
- [CSS Tricks](https://css-tricks.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Animate.css](https://animate.style/)

---

## 📄 Licença

Este projeto é fornecido como está, pronto para uso educacional e comercial.

---

## ✨ Conclusão

O Portal Escolar Inteligente é uma solução moderna e elegante que combina design premium com funcionalidades práticas. A estrutura modular permite fácil expansão e integração com sistemas reais.

**Desenvolvido com ❤️ para escolas modernas.**

---

### Versão: 1.0.0
### Última Atualização: Abril 2026
### Autor: Design Team
