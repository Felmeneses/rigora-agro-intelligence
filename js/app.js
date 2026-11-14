/**
 * Rigora Agro Intelligence - Aplicação Principal (JavaScript Puro)
 * Projeto Global Solution 2026 - FIAP (CitizenTech)
 */

const RigoraApp = (function() {
  // Estado local em memória (permite interações, cadastro e recálculos na sessão)
  const state = {
    currentTab: 'overview',
    property: JSON.parse(JSON.stringify(RIGORA_DATA.property)),
    talhoes: JSON.parse(JSON.stringify(RIGORA_DATA.talhoes)),
    costsByCategory: JSON.parse(JSON.stringify(RIGORA_DATA.costsByCategory)),
    recentActivities: JSON.parse(JSON.stringify(RIGORA_DATA.recentActivities)),
    inventory: JSON.parse(JSON.stringify(RIGORA_DATA.inventory)),
    automationRules: JSON.parse(JSON.stringify(RIGORA_DATA.automationRules)),
    weather: JSON.parse(JSON.stringify(RIGORA_DATA.weather)),
    alerts: JSON.parse(JSON.stringify(RIGORA_DATA.alerts)),
    dataSources: JSON.parse(JSON.stringify(RIGORA_DATA.dataSources)),
    regionalComparison: JSON.parse(JSON.stringify(RIGORA_DATA.regionalComparison)),
    ibgeData: null,
    
    // Parâmetros do Cenário Base Original (Safra 2025/2026)
    baseScenario: {
      areaHa: 42.5,
      productivityScHa: 38.4,
      costPerHaBrl: 9700.0,
      pricePerSackBrl: 1250.0,
      costVariationPct: 0.0,
      productionSc: 1632.0,
      revenue: 2040000.0,
      cost: 412250.0,
      margin: 1627750.0
    },

    // Parâmetros do Cenário Simulado
    simScenario: {
      areaHa: 42.5,
      productivityScHa: 38.4,
      costPerHaBrl: 9700.0,
      pricePerSackBrl: 1250.0,
      costVariationPct: 0.0,
      productionSc: 1632.0,
      revenue: 2040000.0,
      cost: 412250.0,
      margin: 1627750.0
    }
  };

  /**
   * Inicialização da Aplicação
   */
  function init() {
    renderAll();
    setupEventListeners();
  }

  function setupEventListeners() {
    // Fechar dropdown de notificações ao clicar fora
    document.addEventListener('click', function(e) {
      const notifWrapper = document.querySelector('.notif-wrapper');
      const dropdown = document.getElementById('notif-dropdown');
      if (notifWrapper && dropdown && !notifWrapper.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    // Fechar modal ao clicar fora da caixa
    const modal = document.getElementById('modal-activity');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeNewActivityModal();
        }
      });
    }

    // Responsividade ao redimensionar tela
    window.addEventListener('resize', debounce(function() {
      renderCurrentTabCharts();
    }, 200));
  }

  /**
   * Troca de Tela de Login para App
   */
  function login() {
    const loginView = document.getElementById('view-login');
    const appView = document.getElementById('view-app');
    if (loginView && appView) {
      loginView.style.display = 'none';
      appView.style.display = 'flex';
      showToast('Bem-vindo à Rigora Agro Intelligence! Acesso concedido em modo demonstração.', 'success');
      navigate('overview');
    }
  }

  /**
   * Sair da Plataforma (Retorna ao Login)
   */
  function logout(e) {
    if (e) e.preventDefault();
    const loginView = document.getElementById('view-login');
    const appView = document.getElementById('view-app');
    if (loginView && appView) {
      appView.style.display = 'none';
      loginView.style.display = 'flex';
      showToast('Sessão encerrada com sucesso.', 'info');
    }
  }

  /**
   * Navegação entre as Abas Internas (SPA sem reload)
   */
  function navigate(tabId, event) {
    if (event) event.preventDefault();
    state.currentTab = tabId;

    // Atualiza links do menu lateral
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.classList.remove('active');
    });
    const activeLink = document.getElementById(`nav-${tabId}`);
    if (activeLink) activeLink.classList.add('active');

    // Atualiza títulos do Topbar
    const titles = {
      overview: 'Visão Geral',
      properties: 'Propriedades e Safras',
      intelligence: 'Inteligência e Projeções',
      automations: 'Automações Inteligentes',
      sources: 'Fontes de Dados e Integrações'
    };
    const titleEl = document.getElementById('page-current-title');
    if (titleEl) titleEl.textContent = titles[tabId] || 'Rigora Agro Intelligence';

    // Alterna visualização de conteúdo
    document.querySelectorAll('.content-view').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(`tab-${tabId}`);
    if (targetView) targetView.classList.add('active');

    // Renderiza gráficos da aba ativa
    renderCurrentTabCharts();

    // Fecha sidebar móvel se estiver aberta
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
  }

  /**
   * Renderiza os gráficos da aba visível
   */
  function renderCurrentTabCharts() {
    if (state.currentTab === 'overview') {
      renderOverviewCharts();
    } else if (state.currentTab === 'intelligence') {
      const metricSelect = document.getElementById('filter-historical-metric');
      const metric = metricSelect ? metricSelect.value : 'productivity';
      renderHistoricalCharts(metric);
      renderRegionalChart();
      updateSimulator();
    }
  }

  /**
   * Renderização Global de Dados
   */
  function renderAll() {
    renderOverview();
    renderProperties();
    renderIntelligenceTables();
    renderAutomations();
    renderDataSources();
    renderNotifications();
    fetchIbgeSidra();
  }

  /* ==========================================================================
     RENDERIZAÇÃO: VISÃO GERAL
     ========================================================================== */
  function renderOverview() {
    // 1. Atualizar KPIs principais
    const totalCost = state.talhoes.reduce((sum, t) => sum + t.registeredCostBrl, 0);
    const totalArea = state.property.cultivatedAreaHa;
    const costPerHa = totalCost / (totalArea || 1);
    
    // Média ponderada da produtividade
    const totalProduction = state.talhoes.reduce((sum, t) => sum + (t.areaHa * t.estimatedProductivityScHa), 0);
    const avgProductivity = totalProduction / (totalArea || 1);

    const kpiArea = document.getElementById('kpi-area');
    const kpiCost = document.getElementById('kpi-cost');
    const kpiCostHa = document.getElementById('kpi-cost-ha');
    const kpiProd = document.getElementById('kpi-productivity');
    const kpiAlerts = document.getElementById('kpi-alerts');

    if (kpiArea) kpiArea.textContent = `${totalArea.toFixed(1).replace('.', ',')} ha`;
    if (kpiCost) kpiCost.textContent = RigoraCharts.formatCurrency(totalCost);
    if (kpiCostHa) kpiCostHa.textContent = `${RigoraCharts.formatCurrency(costPerHa)} / ha`;
    if (kpiProd) kpiProd.textContent = `${avgProductivity.toFixed(1).replace('.', ',')} sc/ha`;
    
    const activeAlertsCount = state.alerts.filter(a => a.active).length;
    if (kpiAlerts) kpiAlerts.textContent = `${activeAlertsCount} Alerta${activeAlertsCount !== 1 ? 's' : ''}`;

    // 2. Gráficos da Visão Geral
    renderOverviewCharts();

    // 3. Lista de Alertas Recentes
    renderOverviewAlerts();

    // 4. Tabela Resumida de Custos por Categoria
    renderCostCategoryTable();

    // 5. Integração com Dados de Previsão do INMET (Patrocínio - MG)
    fetchInmetForecast();
  }

  function renderOverviewCharts() {
    // Gráfico de Linha: Evolução Mensal dos Custos (Safra 2025/2026)
    const monthlyData = RIGORA_DATA.monthlyCosts2025.map(d => ({
      label: d.month,
      value: d.value
    }));

    RigoraCharts.renderLineChart('chart-monthly-costs', {
      data: monthlyData,
      isCurrency: true,
      color: '#248763',
      title: 'Custos Mensais Acumulados'
    });

    // Gráfico de Barras: Produtividade Histórica
    const histData = RIGORA_DATA.historicalSafras.map(d => ({
      label: d.safra.replace(' (Est.)', ''),
      value: d.productivityScHa,
      isHighlight: d.safra.includes('2025/2026')
    }));

    RigoraCharts.renderBarChart('chart-historical-productivity-overview', {
      data: histData,
      unit: 'sc/ha',
      title: 'Produtividade Histórica'
    });
  }

  function renderOverviewAlerts() {
    const container = document.getElementById('overview-alerts-list');
    if (!container) return;

    const items = state.alerts.map(a => `
      <div class="alert-item ${a.level}">
        <div class="alert-item-header">
          <span class="alert-item-title">${a.title}</span>
          <span class="alert-item-time">${a.date}</span>
        </div>
        <div class="alert-item-desc">${a.description}</div>
      </div>
    `).join('');

    container.innerHTML = items;
  }

  function renderCostCategoryTable() {
    const tbody = document.getElementById('overview-cost-table-body');
    if (!tbody) return;

    const totalCost = state.talhoes.reduce((sum, t) => sum + t.registeredCostBrl, 0);
    const totalArea = state.property.cultivatedAreaHa;

    tbody.innerHTML = state.costsByCategory.map(cat => {
      const perHa = cat.value / totalArea;
      const pct = (cat.value / totalCost) * 100;

      return `
        <tr>
          <td><strong>${cat.category}</strong></td>
          <td>${RigoraCharts.formatCurrency(cat.value)}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="min-width: 42px;">${pct.toFixed(1)}%</span>
              <div style="flex: 1; height: 6px; background-color: #E2E8F0; border-radius: 3px; overflow: hidden; max-width: 100px;">
                <div style="width: ${pct}%; height: 100%; background-color: var(--color-secondary);"></div>
              </div>
            </div>
          </td>
          <td>${RigoraCharts.formatCurrency(perHa)} / ha</td>
          <td><span class="status-pill info">Safra Corrente</span></td>
        </tr>
      `;
    }).join('');
  }

  /* ==========================================================================
     INTEGRAÇÃO COM A API DE PREVISÃO DO INMET (PATROCÍNIO - MG / 3148103)
     ========================================================================== */
  async function fetchInmetForecast() {
    const endpoint = 'https://apiprevmet3.inmet.gov.br/previsao/3148103';
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Status HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      applyInmetData(data);
    } catch (err) {
      console.warn('[INMET API] Bloqueio de CORS ou API de previsão indisponível:', err);
      applyInmetFallback(err);
    }
  }

  function applyInmetData(data) {
    if (!data) return;
    const cityData = data['3148103'] || data[Object.keys(data)[0]];
    if (!cityData) throw new Error('Estrutura de dados do município não encontrada');

    const dateKeys = Object.keys(cityData);
    if (!dateKeys.length) throw new Error('Datas de previsão não disponíveis');

    const refDate = dateKeys[0];
    const dayData = cityData[refDate];

    // Identificar o período da previsão (manha, tarde, noite ou diário)
    const currentHour = new Date().getHours();
    let periodKey = 'manha';
    if (currentHour >= 18) {
      periodKey = 'noite';
    } else if (currentHour >= 12) {
      periodKey = 'tarde';
    }

    const forecast = dayData[periodKey] || dayData.tarde || dayData.manha || dayData.noite || dayData;
    const periodName = periodKey === 'noite' ? 'Noite' : (periodKey === 'tarde' ? 'Tarde' : 'Manhã');

    const tempMin = forecast.temp_min !== undefined ? forecast.temp_min : '--';
    const tempMax = forecast.temp_max !== undefined ? forecast.temp_max : '--';
    const resumo = forecast.resumo || 'Sem descrição';
    const umidadeMin = forecast.umidade_min !== undefined ? `${forecast.umidade_min}%` : '--';
    const umidadeMax = forecast.umidade_max !== undefined ? `${forecast.umidade_max}%` : '--';
    const intVento = forecast.int_vento || 'Fracos';
    const dirVento = forecast.dir_vento || 'Variável';
    const diaSemana = forecast.dia_semana || '';
    const entidade = forecast.entidade || 'Patrocínio';
    const uf = forecast.uf || 'MG';

    // 1. Subtítulo: identificando corretamente como Previsão e a data de referência
    const subtitleEl = document.getElementById('weather-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = `${entidade} - ${uf} (Previsão INMET • Ref: ${refDate})`;
    }

    // 2. Status Badge
    const badgeEl = document.getElementById('weather-status-badge');
    if (badgeEl) {
      badgeEl.className = 'status-pill success';
      badgeEl.innerHTML = '<span class="status-dot"></span> Previsão Oficial';
      badgeEl.title = `Previsão meteorológica obtida diretamente da API pública do INMET (${refDate})`;
    }

    // 3. Bloco de Temperatura:
    // Conforme Requisito 5: Não inventar valores para temperatura atual quando a API não fornecer
    const tempValEl = document.getElementById('weather-temp-val');
    const unitValEl = document.getElementById('weather-unit-val');
    if (tempValEl) tempValEl.textContent = `${tempMax}`;
    if (unitValEl) unitValEl.textContent = '°C (Máx Prevista)';

    const minMaxEl = document.getElementById('weather-minmax-box');
    if (minMaxEl) {
      minMaxEl.innerHTML = `
        <div>Mín: ${tempMin}°C</div>
        <div>Máx: ${tempMax}°C</div>
      `;
    }

    // 4. Grade de Estatísticas:
    // Conforme Requisito 5: Não inventar valores para precipitação ou umidade pontual
    const statsGridEl = document.getElementById('weather-stats-grid');
    if (statsGridEl) {
      statsGridEl.innerHTML = `
        <div>Condição: <span class="weather-stat-val">${resumo}</span></div>
        <div>Umidade Prevista: <span class="weather-stat-val">${umidadeMin} a ${umidadeMax}</span></div>
        <div>Vento: <span class="weather-stat-val">${intVento} (${dirVento})</span></div>
        <div>Período: <span class="weather-stat-val">${periodName} (${diaSemana})</span></div>
      `;
    }

    // 5. Recomendação Agronômica
    const recEl = document.getElementById('weather-recommendation-box');
    if (recEl) {
      recEl.innerHTML = `
        <strong>Recomendação Agronômica (Previsão INMET):</strong> ${resumo}. Amplitude térmica de ${tempMin}°C a ${tempMax}°C com umidade entre ${umidadeMin} e ${umidadeMax}. Monitorar condições para pulverização e manejo foliar.
      `;
    }

    // Atualiza estado local da previsão meteorológica
    if (state.weather) {
      state.weather.temperatureC = tempMax;
      state.weather.minTempC = tempMin;
      state.weather.maxTempC = tempMax;
      state.weather.humidityPct = forecast.umidade_max || state.weather.humidityPct;
      state.weather.rainStatus = resumo;
      state.weather.station = `Previsão INMET Patrocínio (Ref: ${refDate})`;
    }
  }

  function applyInmetFallback(error) {
    const subtitleEl = document.getElementById('weather-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = 'Patrocínio - MG (INMET A522 - Demonstrativo)';
    }

    const badgeEl = document.getElementById('weather-status-badge');
    if (badgeEl) {
      badgeEl.className = 'status-pill warning';
      badgeEl.innerHTML = '<span class="status-dot"></span> Dados Demonstrativos';
      badgeEl.title = 'A API do INMET (apiprevmet3.inmet.gov.br) apresentou bloqueio de CORS ou está indisponível para acesso direto do navegador. Dados demonstrativos mantidos.';
    }

    const tempValEl = document.getElementById('weather-temp-val');
    const unitValEl = document.getElementById('weather-unit-val');
    if (tempValEl) tempValEl.textContent = '24.5';
    if (unitValEl) unitValEl.textContent = '°C';

    const minMaxEl = document.getElementById('weather-minmax-box');
    if (minMaxEl) {
      minMaxEl.innerHTML = `
        <div>Min: 17.2°C</div>
        <div>Max: 29.8°C</div>
      `;
    }

    const statsGridEl = document.getElementById('weather-stats-grid');
    if (statsGridEl) {
      statsGridEl.innerHTML = `
        <div>Chuva Acum. Mês: <span class="weather-stat-val">142,4 mm</span></div>
        <div>Umidade do Ar: <span class="weather-stat-val">68%</span></div>
        <div>Velocidade Vento: <span class="weather-stat-val">11,5 km/h</span></div>
        <div>Méd. Histórica: <span class="weather-stat-val">165,0 mm</span></div>
      `;
    }

    const recEl = document.getElementById('weather-recommendation-box');
    if (recEl) {
      recEl.innerHTML = `
        <strong>Recomendação Agronômica:</strong> Fase de enchimento de grãos com umidade adequada. Manter monitoramento para ferrugem em baixadas.
      `;
    }
  }

  /* ==========================================================================
     INTEGRAÇÃO COM A API DO IBGE SIDRA (TABELA 1613 - PAM - PATROCÍNIO/MG)
     ========================================================================== */
  async function fetchIbgeSidra() {
    // Parâmetros da API conforme Requisito:
    // Base: https://apisidra.ibge.gov.br/values
    // Tabela: 1613 (Lavouras Permanentes)
    // Município: n6/3148103 (Patrocínio, MG)
    // Variáveis: 214 (Quantidade produzida - t), 215 (Valor da produção - mil R$), 216 (Área colhida - ha), 112 (Rendimento médio - kg/ha)
    // Período: 2020 a 2026 (ou anos disponíveis da série)
    // Categoria: c82/2723 (Café em grão Total)
    const sidraUrl = 'https://apisidra.ibge.gov.br/values/t/1613/n6/3148103/v/214,215,216,112/p/2020,2021,2022,2023,2024,2025,2026/c82/2723';
    const servicodadosFallbackUrl = 'https://servicodados.ibge.gov.br/api/v3/agregados/1613/periodos/2020|2021|2022|2023|2024|2025/variaveis/214|215|216|112?localidades=N6[3148103]&classificacao=82[2723]';

    try {
      // 1. Tentar inicialmente a API do SIDRA (apisidra.ibge.gov.br)
      let response = await fetch(sidraUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        // Requisito 3: Tratar a resposta JSON considerando que o primeiro objeto contém os nomes das colunas
        if (Array.isArray(data) && data.length > 1) {
          applyIbgeSidraData(data);
          return;
        }
      }

      // 2. Se a chamada ao SIDRA falhar ou for bloqueada por CORS no navegador, tentar o espelho oficial com CORS habilitado
      response = await fetch(servicodadosFallbackUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        applyIbgeServicoDadosData(data);
        return;
      }

      throw new Error('Falha na resposta das APIs públicas do IBGE');
    } catch (err) {
      console.warn('[IBGE SIDRA API] Falha ou bloqueio de CORS ao consultar indicadores do café:', err);
      // Requisito 8: Se a API falhar, preservar os dados demonstrativos e sinalizar que não são oficiais
      applyIbgeFallback(err);
    }
  }

  function applyIbgeSidraData(data) {
    if (!Array.isArray(data) || data.length < 2) return;

    // Requisito 3: o primeiro objeto contém os nomes das colunas
    const header = data[0];
    const rows = data.slice(1);

    // Validação agronômica e territorial: garantir que os dados pertencem a Patrocínio e à cultura do Café
    const isPatrocinio = rows.some(r => r.D1C === '3148103' || (r.D1N && r.D1N.includes('Patrocínio')));
    const isCafe = rows.some(r => r.D4C === '2723' || r.D4C === '31619' || (r.D4N && r.D4N.includes('Café')));

    if (!isPatrocinio || !isCafe) {
      console.warn('[IBGE SIDRA API] Dados recebidos não correspondem a Patrocínio/Café.');
      applyIbgeFallback();
      return;
    }

    const yearlyMap = {};
    rows.forEach(r => {
      const year = r.D3N || r.D3C;
      if (!year) return;
      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          year: year,
          municipality: r.D1N || 'Patrocínio (MG)',
          municipalityCode: r.D1C || '3148103',
          product: r.D4N || 'Café (em grão) Total',
          yieldKgHa: null,
          prodScHa: null,
          prodTon: null,
          areaHa: null,
          valMilBrl: null
        };
      }

      const val = parseFloat(r.V);
      if (!isNaN(val)) {
        if (r.D2C === '112') {
          yearlyMap[year].yieldKgHa = val;
          // Requisito 4: Calcular a produtividade em sacas de 60 kg por hectare dividindo o rendimento em kg/ha por 60
          yearlyMap[year].prodScHa = val / 60.0;
        } else if (r.D2C === '214') {
          yearlyMap[year].prodTon = val;
        } else if (r.D2C === '215') {
          yearlyMap[year].valMilBrl = val;
        } else if (r.D2C === '216') {
          yearlyMap[year].areaHa = val;
        }
      }
    });

    const validYears = Object.keys(yearlyMap).filter(y => yearlyMap[y].prodScHa !== null).sort();
    if (!validYears.length) {
      applyIbgeFallback();
      return;
    }

    const latestYear = validYears[validYears.length - 1];
    const latest = yearlyMap[latestYear];

    state.ibgeData = {
      source: 'IBGE/PAM/SIDRA (Tabela 1613)',
      latestYear: latestYear,
      latest: latest,
      series: yearlyMap
    };

    updateRegionalComparisonWithIbge(latest, validYears, yearlyMap);
    updateDataSourceIbgeConnected(latestYear, latest);
  }

  function applyIbgeServicoDadosData(data) {
    if (!Array.isArray(data) || !data.length) return;
    const yearlyMap = {};

    data.forEach(vObj => {
      const varId = vObj.id;
      const serie = vObj.resultados?.[0]?.series?.[0]?.serie || {};
      for (const [year, rawVal] of Object.entries(serie)) {
        if (!yearlyMap[year]) {
          yearlyMap[year] = {
            year: year,
            municipality: 'Patrocínio (MG)',
            municipalityCode: '3148103',
            product: 'Café (em grão) Total',
            yieldKgHa: null,
            prodScHa: null,
            prodTon: null,
            areaHa: null,
            valMilBrl: null
          };
        }
        const val = parseFloat(rawVal);
        if (!isNaN(val)) {
          if (varId === '112') {
            yearlyMap[year].yieldKgHa = val;
            yearlyMap[year].prodScHa = val / 60.0;
          } else if (varId === '214') {
            yearlyMap[year].prodTon = val;
          } else if (varId === '215') {
            yearlyMap[year].valMilBrl = val;
          } else if (varId === '216') {
            yearlyMap[year].areaHa = val;
          }
        }
      }
    });

    const validYears = Object.keys(yearlyMap).filter(y => yearlyMap[y].prodScHa !== null).sort();
    if (!validYears.length) {
      applyIbgeFallback();
      return;
    }

    const latestYear = validYears[validYears.length - 1];
    const latest = yearlyMap[latestYear];

    state.ibgeData = {
      source: 'IBGE/PAM/SIDRA (Tabela 1613)',
      latestYear: latestYear,
      latest: latest,
      series: yearlyMap
    };

    updateRegionalComparisonWithIbge(latest, validYears, yearlyMap);
    updateDataSourceIbgeConnected(latestYear, latest);
  }

  function updateRegionalComparisonWithIbge(latest, validYears, yearlyMap) {
    if (!state.regionalComparison || !state.regionalComparison.length) return;

    // Requisito 9: Não substituir os indicadores fictícios da propriedade por médias municipais
    // A propriedade Fazenda Santa Rita (item 0) permanece intocada com seus 38.4 sc/ha
    const farmProd = state.regionalComparison[0].productivityScHa;
    const ibgeProd = latest.prodScHa;
    const diffPct = Number(((farmProd - ibgeProd) / ibgeProd * 100).toFixed(1));

    // Atualiza o item de benchmark com a média municipal oficial do IBGE/PAM/SIDRA
    const benchIndex = state.regionalComparison.findIndex(r => r.isBenchmark || r.municipality.includes('Média') || r.municipality.includes('IBGE'));
    const ibgeBenchmarkItem = {
      municipality: `Patrocínio - Média Municipal (IBGE/PAM/SIDRA ${latest.year})`,
      region: 'Cerrado Mineiro (Oficial)',
      productivityScHa: Number(ibgeProd.toFixed(1)),
      avgCostPerHaBrl: 9850.00,
      altitudeM: 980,
      diffToRegionalAvgPct: 0.0,
      isCurrentProperty: false,
      isBenchmark: true,
      isOfficialIbge: true,
      refYear: latest.year,
      source: 'IBGE/PAM/SIDRA'
    };

    if (benchIndex >= 0) {
      state.regionalComparison[benchIndex] = ibgeBenchmarkItem;
    } else {
      state.regionalComparison.splice(1, 0, ibgeBenchmarkItem);
    }

    // Atualiza a diferença da propriedade em relação à média oficial do IBGE
    state.regionalComparison[0].diffToRegionalAvgPct = diffPct;

    // Requisito 7: Exibir o ano de referência e identificar a fonte como IBGE/PAM/SIDRA
    const regSub = document.getElementById('regional-subtitle');
    if (regSub) {
      regSub.textContent = `Posicionamento da lavoura vs referências regionais • Média Oficial: IBGE/PAM/SIDRA (Ano ${latest.year}: ${ibgeProd.toFixed(1).replace('.', ',')} sc/ha)`;
    }

    const regBadge = document.getElementById('regional-status-badge');
    if (regBadge) {
      regBadge.className = 'status-pill success';
      regBadge.innerHTML = `<span class="status-dot"></span> Desempenho +${diffPct > 0 ? diffPct.toFixed(1).replace('.', ',') : '0'}% vs IBGE (${latest.year})`;
      regBadge.title = `Média oficial do município de Patrocínio/MG apurada pelo IBGE/PAM/SIDRA no ano ${latest.year}.`;
    }

    // Re-renderiza gráficos e tabelas da tela Inteligência
    renderRegionalChart();
    renderIntelligenceTables();
  }

  function updateDataSourceIbgeConnected(latestYear, latest) {
    // Requisito 6: Na aba Fontes de Dados, alterar o status do IBGE para "Conectado"
    // somente após receber e validar uma resposta oficial
    const ibgeSrc = state.dataSources.find(s => s.id === 'SRC-01');
    if (ibgeSrc) {
      ibgeSrc.status = 'Conectado';
      ibgeSrc.statusCode = 'connected';
      ibgeSrc.period = `Série histórica 2020 a ${latestYear} (Oficial IBGE/PAM/SIDRA)`;
      ibgeSrc.officialUrl = 'https://apisidra.ibge.gov.br/values/t/1613/n6/3148103/v/214,215,216,112/p/2020,2021,2022,2023,2024,2025/c82/2723';
      ibgeSrc.technicalNote = `Dados oficiais validados do IBGE SIDRA (Tabela 1613 - PAM). Patrocínio (MG) - Café (em grão). Rendimento recente: ${latest.yieldKgHa} kg/ha (${latest.prodScHa.toFixed(1).replace('.', ',')} sc/ha de 60kg em ${latestYear}). Produção: ${(latest.prodTon || 0).toLocaleString('pt-BR')} t. Área colhida: ${(latest.areaHa || 0).toLocaleString('pt-BR')} ha.`;
      renderDataSources();
    }
  }

  function applyIbgeFallback(error) {
    // Requisito 8: Se a API falhar, preservar os dados demonstrativos e sinalizar que não são oficiais
    const ibgeSrc = state.dataSources.find(s => s.id === 'SRC-01');
    if (ibgeSrc) {
      ibgeSrc.status = 'Integração planejada (Demonstrativo)';
      ibgeSrc.statusCode = 'planned';
      ibgeSrc.technicalNote = 'Tentativa de conexão oficial realizada. Devido a bloqueio de CORS ou serviço indisponível no navegador, os dados demonstrativos locais foram mantidos.';
      renderDataSources();
    }

    const regBadge = document.getElementById('regional-status-badge');
    if (regBadge) {
      regBadge.className = 'status-pill warning';
      regBadge.innerHTML = '<span class="status-dot"></span> Dados Demonstrativos';
      regBadge.title = 'API pública do IBGE SIDRA inacessível diretamente pelo navegador (CORS/Offline). Exibindo dados de referência demonstrativos.';
    }

    const regSub = document.getElementById('regional-subtitle');
    if (regSub) {
      regSub.textContent = 'Posicionamento da propriedade em relação a municípios de destaque do café arábica mineiro (Dados Demonstrativos - Fonte oficial indisponível)';
    }
  }

  /* ==========================================================================
     RENDERIZAÇÃO: PROPRIEDADES E SAFRAS
     ========================================================================== */
  function renderProperties() {
    renderTalhoesTable();
    renderActivitiesTable();
  }

  function renderTalhoesTable() {
    const tbody = document.getElementById('talhoes-table-body');
    if (!tbody) return;

    tbody.innerHTML = state.talhoes.map(t => {
      const costPerHa = t.registeredCostBrl / (t.areaHa || 1);
      return `
        <tr>
          <td>
            <strong>${t.name}</strong>
            <div style="font-size: 11.5px; color: var(--color-text-muted);">Plantio: ${t.plantingYear}</div>
          </td>
          <td>${t.variety}</td>
          <td>${t.areaHa.toFixed(1).replace('.', ',')} ha</td>
          <td><strong>${t.estimatedProductivityScHa.toFixed(1).replace('.', ',')} sc/ha</strong></td>
          <td>${RigoraCharts.formatCurrency(t.registeredCostBrl)}</td>
          <td>${RigoraCharts.formatCurrency(costPerHa)} / ha</td>
          <td>
            <span class="status-pill ${t.statusType}">
              <span class="status-dot"></span> ${t.status}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderActivitiesTable() {
    const tbody = document.getElementById('activities-table-body');
    if (!tbody) return;

    tbody.innerHTML = state.recentActivities.map(act => `
      <tr>
        <td>${act.date}</td>
        <td><strong>${act.talhaoName}</strong></td>
        <td><span class="demo-tag" style="background-color: #E2E8F0;">${act.category}</span></td>
        <td>${act.description}</td>
        <td><strong style="color: var(--color-primary);">${RigoraCharts.formatCurrency(act.costBrl)}</strong></td>
      </tr>
    `).join('');
  }

  /* ==========================================================================
     MODAL DE NOVA ATIVIDADE (CADASTRO DEMONSTRATIVO EM MEMÓRIA)
     ========================================================================== */
  function openNewActivityModal() {
    const modal = document.getElementById('modal-activity');
    if (modal) {
      modal.classList.add('show');
      const descInput = document.getElementById('act-desc');
      if (descInput) descInput.focus();
    }
  }

  function closeNewActivityModal() {
    const modal = document.getElementById('modal-activity');
    if (modal) {
      modal.classList.remove('show');
      const form = document.getElementById('form-new-activity');
      if (form) form.reset();
      const dateInput = document.getElementById('act-date');
      if (dateInput) dateInput.value = '13/03/2026';
    }
  }

  function submitNewActivity() {
    const talhaoId = document.getElementById('act-talhao').value;
    const category = document.getElementById('act-category').value;
    const date = document.getElementById('act-date').value;
    const desc = document.getElementById('act-desc').value;
    const cost = parseFloat(document.getElementById('act-cost').value);

    if (isNaN(cost) || cost <= 0) {
      showToast('Por favor, informe um valor monetário válido para a despesa.', 'warning');
      return;
    }

    const talhao = state.talhoes.find(t => t.id === talhaoId);
    if (!talhao) return;

    // 1. Atualizar custo do talhão
    talhao.registeredCostBrl += cost;

    // 2. Atualizar categoria de custo correspondente
    const catItem = state.costsByCategory.find(c => c.category === category);
    if (catItem) {
      catItem.value += cost;
    }

    // 3. Adicionar no registro de atividades
    const newAct = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      date: date || '13/03/2026',
      talhaoId: talhao.id,
      talhaoName: talhao.name,
      category: category,
      description: desc || 'Operação de campo cadastrada em sessão',
      costBrl: cost
    };
    state.recentActivities.unshift(newAct);

    // 4. Fechar modal e atualizar toda a interface
    closeNewActivityModal();
    renderAll();

    showToast(`Atividade registrada com sucesso! +${RigoraCharts.formatCurrency(cost)} alocados no ${talhao.name}.`, 'success');
  }

  /* ==========================================================================
     RENDERIZAÇÃO: INTELIGÊNCIA E PROJEÇÕES
     ========================================================================== */
  function renderHistoricalCharts(metric = 'productivity') {
    const historical = RIGORA_DATA.historicalSafras;
    const metricConfigs = {
      productivity: { key: 'productivityScHa', unit: 'sc/ha', isCurrency: false, title: 'Produtividade (sc/ha)' },
      costTotal: { key: 'costTotalBrl', isCurrency: true, title: 'Custo Total da Safra (R$)' },
      costPerHa: { key: 'costPerHaBrl', isCurrency: true, title: 'Custo Médio por Hectare (R$/ha)' },
      netResult: { key: 'netResultBrl', isCurrency: true, title: 'Resultado Operacional Estimado (R$)' }
    };

    const cfg = metricConfigs[metric] || metricConfigs.productivity;
    const chartData = historical.map(d => ({
      label: d.safra.replace(' (Est.)', ''),
      value: d[cfg.key],
      isHighlight: d.safra.includes('2025/2026')
    }));

    if (cfg.isCurrency) {
      RigoraCharts.renderLineChart('chart-historical-intelligence', {
        data: chartData,
        isCurrency: true,
        color: '#163D32',
        title: cfg.title
      });
    } else {
      RigoraCharts.renderBarChart('chart-historical-intelligence', {
        data: chartData,
        unit: cfg.unit,
        title: cfg.title
      });
    }
  }

  function renderRegionalChart() {
    RigoraCharts.renderRegionalBarChart('chart-regional-comparison', state.regionalComparison);
  }

  function renderIntelligenceTables() {
    // 1. Tabela Histórica
    const histTbody = document.getElementById('historical-table-body');
    if (histTbody) {
      histTbody.innerHTML = RIGORA_DATA.historicalSafras.map(d => `
        <tr>
          <td><strong>${d.safra}</strong></td>
          <td>${d.productivityScHa.toFixed(1).replace('.', ',')} sc/ha</td>
          <td>${d.totalProductionSc} sacas</td>
          <td>${RigoraCharts.formatCurrency(d.costTotalBrl)}</td>
          <td>${RigoraCharts.formatCurrency(d.costPerHaBrl)}/ha</td>
          <td>${RigoraCharts.formatCurrency(d.avgPricePerSackBrl)}/sc</td>
          <td>${RigoraCharts.formatCurrency(d.totalRevenueBrl)}</td>
          <td><strong style="color: var(--color-secondary);">${RigoraCharts.formatCurrency(d.netResultBrl)}</strong></td>
        </tr>
      `).join('');
    }

    // 2. Tabela Regional
    const regTbody = document.getElementById('regional-table-body');
    if (regTbody) {
      regTbody.innerHTML = state.regionalComparison.map(d => {
        let diffBadge = '';
        if (d.diffToRegionalAvgPct > 0) {
          diffBadge = `<span class="status-pill success">+${d.diffToRegionalAvgPct.toFixed(1)}% acima</span>`;
        } else if (d.diffToRegionalAvgPct < 0) {
          diffBadge = `<span class="status-pill warning">${d.diffToRegionalAvgPct.toFixed(1)}% abaixo</span>`;
        } else {
          diffBadge = `<span class="status-pill info">Referência Base</span>`;
        }

        return `
          <tr style="${d.isCurrentProperty ? 'background-color: #F0FDF4; font-weight: 600;' : ''}">
            <td>
              <strong>${d.municipality}</strong>
              ${d.isCurrentProperty ? '<span class="demo-tag" style="margin-left:6px; background-color:#DCFCE7; color:#15803D;">Sua Propriedade</span>' : ''}
              ${d.isOfficialIbge ? '<span class="demo-tag" style="margin-left:6px; background-color:#E0F2FE; color:#0369A1;">IBGE/PAM/SIDRA</span>' : ''}
            </td>
            <td>${d.region}</td>
            <td><strong>${d.productivityScHa.toFixed(1).replace('.', ',')} sc/ha</strong></td>
            <td>${RigoraCharts.formatCurrency(d.avgCostPerHaBrl)}/ha</td>
            <td>${d.altitudeM} m</td>
            <td>${diffBadge}</td>
          </tr>
        `;
      }).join('');
    }
  }

  /* ==========================================================================
     SIMULADOR DE CENÁRIOS (CÁLCULOS DINÂMICOS E REATIVOS)
     ========================================================================== */
  function onSimParamChange() {
    const area = parseFloat(document.getElementById('sim-input-area').value);
    const productivity = parseFloat(document.getElementById('sim-input-productivity').value);
    const costPerHa = parseFloat(document.getElementById('sim-input-cost-ha').value);
    const price = parseFloat(document.getElementById('sim-input-price').value);
    const costVar = parseFloat(document.getElementById('sim-input-cost-var').value);

    // Atualiza os labels dos sliders
    document.getElementById('disp-sim-area').textContent = `${area.toFixed(1)} ha`;
    document.getElementById('disp-sim-productivity').textContent = `${productivity.toFixed(1)} sc/ha`;
    document.getElementById('disp-sim-cost-ha').textContent = RigoraCharts.formatCurrency(costPerHa);
    document.getElementById('disp-sim-price').textContent = RigoraCharts.formatCurrency(price);
    document.getElementById('disp-sim-cost-var').textContent = `${costVar > 0 ? '+' : ''}${costVar.toFixed(0)}%`;

    state.simScenario.areaHa = area;
    state.simScenario.productivityScHa = productivity;
    state.simScenario.costPerHaBrl = costPerHa;
    state.simScenario.pricePerSackBrl = price;
    state.simScenario.costVariationPct = costVar;

    updateSimulator();
  }

  function updateSimulator() {
    const sim = state.simScenario;
    const base = state.baseScenario;

    // Fórmulas especificadas no edital:
    // Produção = área × produtividade
    sim.productionSc = sim.areaHa * sim.productivityScHa;
    // Receita = produção × preço por saca
    sim.revenue = sim.productionSc * sim.pricePerSackBrl;
    // Custo = área × custo por hectare × (1 + variação percentual / 100)
    sim.cost = sim.areaHa * sim.costPerHaBrl * (1 + sim.costVariationPct / 100);
    // Resultado operacional estimado = receita − custo
    sim.margin = sim.revenue - sim.cost;

    // Atualizar displays de resultados
    document.getElementById('sim-res-production').textContent = `${RigoraCharts.formatNumber(sim.productionSc, 0)} sc`;
    document.getElementById('sim-res-revenue').textContent = RigoraCharts.formatCurrency(sim.revenue);
    document.getElementById('sim-res-cost').textContent = RigoraCharts.formatCurrency(sim.cost);
    
    const marginEl = document.getElementById('sim-res-margin');
    if (marginEl) {
      marginEl.textContent = RigoraCharts.formatCurrency(sim.margin);
      marginEl.style.color = sim.margin >= 0 ? 'var(--color-secondary)' : 'var(--color-danger)';
    }

    // Deltas em relação ao cenário base original
    renderSimDelta('sim-res-production-delta', sim.productionSc - base.productionSc, 'sc', false);
    renderSimDelta('sim-res-revenue-delta', sim.revenue - base.revenue, '', true);
    renderSimDelta('sim-res-cost-delta', sim.cost - base.cost, '', true, true); // true = invertido (custo maior é negativo)
    renderSimDelta('sim-res-margin-delta', sim.margin - base.margin, '', true);

    // Atualizar gráfico comparativo
    RigoraCharts.renderScenarioComparison('chart-sim-comparison', base, sim);
  }

  function renderSimDelta(elementId, delta, unit, isCurrency, invertGoodness = false) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (Math.abs(delta) < 0.1) {
      el.textContent = 'Igual ao cenário base';
      el.className = 'sim-metric-delta';
      return;
    }

    const isPositive = delta > 0;
    const isGood = invertGoodness ? !isPositive : isPositive;
    const sign = isPositive ? '+' : '';
    const formatted = isCurrency ? RigoraCharts.formatCurrency(delta) : `${sign}${RigoraCharts.formatNumber(delta, 1)} ${unit}`;

    el.textContent = `${isPositive ? '+' : ''}${formatted} vs base`;
    el.className = `sim-metric-delta ${isGood ? 'positive' : 'negative'}`;
  }

  function resetSimulatorDefaults() {
    const base = state.baseScenario;
    document.getElementById('sim-input-area').value = base.areaHa;
    document.getElementById('sim-input-productivity').value = base.productivityScHa;
    document.getElementById('sim-input-cost-ha').value = base.costPerHaBrl;
    document.getElementById('sim-input-price').value = base.pricePerSackBrl;
    document.getElementById('sim-input-cost-var').value = 0;
    onSimParamChange();
    showToast('Parâmetros do simulador restaurados para o padrão original.', 'info');
  }

  function applySimPreset(type) {
    if (type === 'conservative') {
      document.getElementById('sim-input-productivity').value = 32.0;
      document.getElementById('sim-input-price').value = 1100;
      document.getElementById('sim-input-cost-var').value = 10;
      onSimParamChange();
      showToast('Premissa Conservadora aplicada (quebra de 16% na colheita e custos +10%).', 'warning');
    } else if (type === 'optimistic') {
      document.getElementById('sim-input-productivity').value = 44.0;
      document.getElementById('sim-input-price').value = 1450;
      document.getElementById('sim-input-cost-var').value = -5;
      onSimParamChange();
      showToast('Premissa Otimista aplicada (alta produtividade e valorização do café arábica).', 'success');
    }
  }

  /* ==========================================================================
     AUTOMAÇÕES: TESTES E GESTÃO DE REGRAS
     ========================================================================== */
  function renderAutomations() {
    // Configura os valores iniciais dos limiares
    const rule1 = state.automationRules.find(r => r.id === 'RULE-01');
    if (rule1) {
      const lbl = document.getElementById('label-threshold-rule-1');
      const input = document.getElementById('input-threshold-rule-1');
      if (lbl) lbl.textContent = RigoraCharts.formatCurrency(rule1.thresholdValue);
      if (input) input.value = rule1.thresholdValue;
    }
  }

  function onRuleToggle(ruleId, isChecked) {
    const rule = state.automationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = isChecked;
      logToRuleConsole(`[STATUS] ${rule.name}: ${isChecked ? 'ATIVADA' : 'DESATIVADA'} pelo usuário.`);
      showToast(`Automação "${rule.name}" ${isChecked ? 'ativada' : 'desativada'}.`, 'info');
    }
  }

  function onRuleThresholdChange(ruleId, value) {
    const rule = state.automationRules.find(r => r.id === ruleId);
    const num = parseFloat(value);
    if (rule && !isNaN(num)) {
      rule.thresholdValue = num;
      const lbl = document.getElementById('label-threshold-rule-1');
      if (lbl) lbl.textContent = RigoraCharts.formatCurrency(num);
      logToRuleConsole(`[CONFIGURAÇÃO] Limite da regra "${rule.name}" ajustado para ${RigoraCharts.formatCurrency(num)}.`);
    }
  }

  function testRule(ruleId) {
    const rule = state.automationRules.find(r => r.id === ruleId);
    if (!rule) return;

    if (!rule.enabled) {
      showToast(`Atenção: A regra "${rule.name}" está desativada no momento. Ative o switch para monitoramento contínuo.`, 'warning');
    }

    const timestamp = new Date().toLocaleTimeString('pt-BR');

    if (ruleId === 'RULE-01') {
      // Regra 1: Custo Elevado
      const totalCost = state.talhoes.reduce((sum, t) => sum + t.registeredCostBrl, 0);
      const currentCostPerHa = totalCost / state.property.cultivatedAreaHa;
      const threshold = rule.thresholdValue;

      if (currentCostPerHa > threshold) {
        const diff = currentCostPerHa - threshold;
        logToRuleConsole(`[${timestamp}] ⚠️ ALERTA DISPARADO (Regra 1 - Custo Elevado):
   • Custo atual: ${RigoraCharts.formatCurrency(currentCostPerHa)}/ha
   • Limite configurado: ${RigoraCharts.formatCurrency(threshold)}/ha
   • Excesso identificado: +${RigoraCharts.formatCurrency(diff)}/ha (+${((diff/threshold)*100).toFixed(1)}%).
   • Diagnóstico: Sugere-se renegociação de lotes de insumos ou adiamento de intervenções não prioritárias.`);
        showToast(`ALERTA: Custo atual (${RigoraCharts.formatCurrency(currentCostPerHa)}/ha) ultrapassou o teto de ${RigoraCharts.formatCurrency(threshold)}!`, 'danger');
      } else {
        logToRuleConsole(`[${timestamp}] ✅ TESTE CONCLUÍDO COM SUCESSO (Regra 1 - Custo Elevado):
   • Custo atual: ${RigoraCharts.formatCurrency(currentCostPerHa)}/ha
   • Limite configurado: ${RigoraCharts.formatCurrency(threshold)}/ha
   • Margem de segurança restante: ${RigoraCharts.formatCurrency(threshold - currentCostPerHa)}/ha. Nenhum alerta necessário.`);
        showToast(`Regra 1 testada: Custo atual de ${RigoraCharts.formatCurrency(currentCostPerHa)}/ha está DENTRO do limite (${RigoraCharts.formatCurrency(threshold)}).`, 'success');
      }
    } else if (ruleId === 'RULE-02') {
      // Regra 2: Estoque Baixo
      const criticalItems = state.inventory.filter(i => i.currentQuantity < i.minQuantity);
      if (criticalItems.length > 0) {
        const itemNames = criticalItems.map(i => `${i.name} (${i.currentQuantity} ${i.unit} em estoque / Mínimo: ${i.minQuantity})`).join('\n   • ');
        logToRuleConsole(`[${timestamp}] ⚠️ AVISO DE REPOSIÇÃO DISPARADO (Regra 2 - Estoque de Insumos):
   • ${criticalItems.length} insumo(s) abaixo da reserva de segurança:
   • ${itemNames}
   • Recomendação: Emitir solicitação à cooperativa para evitar atrasos na janela agronômica.`);
        showToast(`AVISO: ${criticalItems.length} insumo(s) abaixo do estoque mínimo. Veja o console.`, 'warning');
      } else {
        logToRuleConsole(`[${timestamp}] ✅ TESTE CONCLUÍDO (Regra 2 - Estoque de Insumos): Todos os itens com quantidade satisfatória.`);
        showToast('Regra 2 testada: Todos os insumos estão acima da reserva mínima.', 'success');
      }
    } else if (ruleId === 'RULE-03') {
      // Regra 3: Condição Climática
      const w = state.weather;
      logToRuleConsole(`[${timestamp}] ⛅ PARECER FITOSSANITÁRIO CLIMÁTICO (Regra 3 - Análise Meteorológica INMET A522):
   • Temperatura Atual: ${w.temperatureC}°C (Min: ${w.minTempC}°C | Max: ${w.maxTempC}°C)
   • Umidade Relativa: ${w.humidityPct}% (Limiar de alerta contínuo: >80%)
   • Chuva Acumulada no Mês: ${w.accumulatedRainMonthMm} mm
   • Avaliação: Condições de microclima favoráveis para o café arábica. Risco para ferrugem classificado como BAIXO/MODERADO nos talhões de encosta.`);
      showToast('Regra 3 testada: Análise bioclimática gerada com sucesso. Risco sanitário controlado.', 'info');
    }
  }

  function logToRuleConsole(message) {
    const consoleEl = document.getElementById('rule-test-console');
    if (!consoleEl) return;
    const entry = document.createElement('div');
    entry.style.marginTop = '8px';
    entry.style.whiteSpace = 'pre-wrap';
    entry.textContent = message;
    consoleEl.appendChild(entry);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function clearRuleLog() {
    const consoleEl = document.getElementById('rule-test-console');
    if (consoleEl) {
      consoleEl.innerHTML = '<div style="color: #64748B;">// Console de testes limpo. Pronto para novas simulações de regras.</div>';
    }
  }

  /* ==========================================================================
     FONTES DE DADOS E NOTIFICAÇÕES
     ========================================================================== */
  function renderDataSources() {
    const tbody = document.getElementById('data-sources-table-body');
    if (!tbody) return;

    tbody.innerHTML = state.dataSources.map(src => {
      const statusPill = src.statusCode === 'connected'
        ? '<span class="status-pill success"><span class="status-dot"></span> Conectado (Local)</span>'
        : '<span class="status-pill info"><span class="status-dot"></span> Integração planejada</span>';

      const linkHtml = src.officialUrl
        ? `<a href="${src.officialUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--color-secondary); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">Acessar Portal ↗</a>`
        : '<span style="color: var(--color-text-muted);">Banco Local Rigora</span>';

      return `
        <tr>
          <td>
            <strong>${src.name}</strong>
            <div style="font-size: 11.5px; color: var(--color-text-muted); margin-top: 2px;">${src.technicalNote}</div>
          </td>
          <td>${src.dataType}</td>
          <td>${src.period}</td>
          <td>${statusPill}</td>
          <td>${linkHtml}</td>
        </tr>
      `;
    }).join('');
  }

  function renderNotifications() {
    const list = document.getElementById('notif-items-list');
    if (!list) return;

    list.innerHTML = state.alerts.map(a => `
      <div class="notif-item ${a.level}" onclick="RigoraApp.navigate('overview')">
        <div style="font-weight: 600; color: var(--color-text);">${a.title}</div>
        <div style="font-size: 11.5px; color: var(--color-text-muted);">${a.target} • ${a.date}</div>
      </div>
    `).join('');
  }

  function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
  }

  function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  }

  function onSafraChange(safra) {
    showToast(`Visualizando indicadores da ${safra}.`, 'info');
  }

  function onPropertyChange(propId) {
    showToast(`Propriedade ativa: ${state.property.name}.`, 'info');
  }

  /**
   * Sistema de Toasts Informativos
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'danger') toast.style.backgroundColor = '#991B1B';
    if (type === 'warning') toast.style.backgroundColor = '#B45309';
    if (type === 'success') toast.style.backgroundColor = '#163D32';

    toast.innerHTML = `
      <div style="flex: 1;">${message}</div>
      <button style="background: none; border: none; color: #FFFFFF; cursor: pointer; font-size: 16px;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4200);
  }

  /**
   * Debounce utilitário
   */
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Inicializa quando a página carregar
  document.addEventListener('DOMContentLoaded', init);

  return {
    login,
    logout,
    navigate,
    renderHistoricalCharts,
    onSimParamChange,
    resetSimulatorDefaults,
    applySimPreset,
    openNewActivityModal,
    closeNewActivityModal,
    submitNewActivity,
    testRule,
    clearRuleLog,
    onRuleToggle,
    onRuleThresholdChange,
    toggleNotifications,
    toggleMobileSidebar,
    onSafraChange,
    onPropertyChange,
    fetchInmetForecast,
    fetchIbgeSidra,
    showToast
  };
})();

if (typeof window !== "undefined") {
  window.RigoraApp = RigoraApp;
}
