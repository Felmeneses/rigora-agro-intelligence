/**
 * Rigora Agro Intelligence - Motor de Gráficos SVG Puro
 * Sem dependências externas, 100% autônomo e responsivo
 */

const RigoraCharts = {
  // Cores institucionais do projeto
  colors: {
    primary: '#163D32',
    secondary: '#248763',
    accent: '#44A08D',
    lightGreen: '#E6F4EA',
    warning: '#D97706',
    danger: '#DC2626',
    text: '#26352F',
    muted: '#64748B',
    grid: '#E2E8F0',
    card: '#FFFFFF'
  },

  /**
   * Utilitário para formatar moeda brasileira
   */
  formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  },

  /**
   * Utilitário para formatar números
   */
  formatNumber(val, decimals = 1) {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
  },

  /**
   * Gráfico de Linha com Área Suave (Evolução Mensal ou Séries Temporais)
   */
  renderLineChart(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = options.data || [];
    if (!data.length) {
      container.innerHTML = '<div class="chart-empty">Nenhum dado disponível</div>';
      return;
    }

    const width = 640;
    const height = 260;
    const padding = { top: 25, right: 30, bottom: 40, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const values = data.map(d => d.value);
    const minVal = options.minZero ? 0 : Math.min(...values) * 0.85;
    const maxVal = Math.max(...values) * 1.15;
    const range = maxVal - minVal || 1;

    const getX = (i) => padding.left + (i / (data.length - 1)) * chartW;
    const getY = (v) => padding.top + chartH - ((v - minVal) / range) * chartH;

    // Gerar pontos da linha
    const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');

    // Área sob a curva
    const areaPoints = `${getX(0)},${padding.top + chartH} ${points} ${getX(data.length - 1)},${padding.top + chartH}`;

    // Linhas de grade horizontais (4 passos)
    const gridSteps = 4;
    let gridLinesSvg = '';
    for (let step = 0; step <= gridSteps; step++) {
      const yVal = minVal + (range / gridSteps) * step;
      const yPos = getY(yVal);
      const labelText = options.isCurrency 
        ? this.formatCurrency(yVal) 
        : (options.unit ? `${this.formatNumber(yVal, 0)} ${options.unit}` : this.formatNumber(yVal, 0));

      gridLinesSvg += `
        <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="${this.colors.grid}" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${yPos + 4}" fill="${this.colors.muted}" font-size="11" text-anchor="end" font-family="Inter, sans-serif">${labelText}</text>
      `;
    }

    // Rótulos do eixo X
    let xLabelsSvg = '';
    data.forEach((d, i) => {
      const xPos = getX(i);
      xLabelsSvg += `
        <text x="${xPos}" y="${height - 12}" fill="${this.colors.muted}" font-size="11" text-anchor="middle" font-family="Inter, sans-serif">${d.label}</text>
      `;
    });

    // Círculos interativos
    let dotsSvg = '';
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.value);
      const formattedVal = options.isCurrency ? this.formatCurrency(d.value) : `${this.formatNumber(d.value, 1)} ${options.unit || ''}`;
      dotsSvg += `
        <g class="chart-point" data-label="${d.label}: ${formattedVal}">
          <circle cx="${x}" cy="${y}" r="4.5" fill="${options.color || this.colors.secondary}" stroke="#FFFFFF" stroke-width="2" class="point-circle" />
          <title>${d.label}: ${formattedVal}</title>
        </g>
      `;
    });

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="rigora-svg-chart" style="width: 100%; height: auto; max-height: 260px; display: block;" role="img" aria-label="${options.title || 'Gráfico'}">
        <defs>
          <linearGradient id="areaGrad-${containerId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${options.color || this.colors.secondary}" stop-opacity="0.28" />
            <stop offset="100%" stop-color="${options.color || this.colors.secondary}" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${gridLinesSvg}
        <polygon points="${areaPoints}" fill="url(#areaGrad-${containerId})" />
        <polyline fill="none" stroke="${options.color || this.colors.secondary}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${points}" />
        ${dotsSvg}
        ${xLabelsSvg}
      </svg>
    `;

    container.innerHTML = svg;
  },

  /**
   * Gráfico de Barras Verticais (Produtividade ou Custos por Período)
   */
  renderBarChart(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = options.data || [];
    if (!data.length) {
      container.innerHTML = '<div class="chart-empty">Nenhum dado disponível</div>';
      return;
    }

    const width = 640;
    const height = 260;
    const padding = { top: 25, right: 30, bottom: 45, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const values = data.map(d => d.value);
    const maxVal = Math.max(...values) * 1.15;
    const minVal = 0;
    const range = maxVal || 1;

    const barGroupWidth = chartW / data.length;
    const barWidth = Math.min(36, barGroupWidth * 0.55);

    // Linhas de grade horizontais
    const gridSteps = 4;
    let gridLinesSvg = '';
    for (let step = 0; step <= gridSteps; step++) {
      const yVal = (range / gridSteps) * step;
      const yPos = padding.top + chartH - (yVal / range) * chartH;
      const labelText = options.isCurrency 
        ? this.formatCurrency(yVal) 
        : (options.unit ? `${this.formatNumber(yVal, 0)} ${options.unit}` : this.formatNumber(yVal, 0));

      gridLinesSvg += `
        <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="${this.colors.grid}" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${yPos + 4}" fill="${this.colors.muted}" font-size="11" text-anchor="end" font-family="Inter, sans-serif">${labelText}</text>
      `;
    }

    // Barras
    let barsSvg = '';
    data.forEach((d, i) => {
      const groupCenter = padding.left + i * barGroupWidth + barGroupWidth / 2;
      const barX = groupCenter - barWidth / 2;
      const bHeight = (d.value / range) * chartH;
      const barY = padding.top + chartH - bHeight;
      const barColor = d.isHighlight ? this.colors.secondary : (d.color || this.colors.primary);
      const formattedVal = options.isCurrency ? this.formatCurrency(d.value) : `${this.formatNumber(d.value, 1)} ${options.unit || ''}`;

      barsSvg += `
        <g class="chart-bar-group">
          <rect x="${barX}" y="${barY}" width="${barWidth}" height="${bHeight}" rx="4" ry="4" fill="${barColor}" class="bar-rect">
            <title>${d.label}: ${formattedVal}</title>
          </rect>
          <!-- Valor no topo da barra -->
          <text x="${groupCenter}" y="${barY - 6}" fill="${this.colors.text}" font-size="10.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">${this.formatNumber(d.value, 1)}</text>
          <!-- Rótulo do eixo X -->
          <text x="${groupCenter}" y="${height - 18}" fill="${this.colors.muted}" font-size="11" text-anchor="middle" font-family="Inter, sans-serif">${d.label}</text>
        </g>
      `;
    });

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="rigora-svg-chart" style="width: 100%; height: auto; max-height: 260px; display: block;" role="img" aria-label="${options.title || 'Gráfico de Barras'}">
        ${gridLinesSvg}
        ${barsSvg}
      </svg>
    `;

    container.innerHTML = svg;
  },

  /**
   * Gráfico de Comparação Regional (Barras Horizontais com Benchmark)
   */
  renderRegionalBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || !data.length) {
      container.innerHTML = '<div class="chart-empty">Nenhum dado disponível</div>';
      return;
    }

    const width = 640;
    const rowHeight = 38;
    const height = data.length * rowHeight + 40;
    const padding = { top: 20, right: 65, bottom: 20, left: 190 };
    const chartW = width - padding.left - padding.right;

    const maxVal = Math.max(...data.map(d => d.productivityScHa)) * 1.15;

    let barsSvg = '';
    data.forEach((d, i) => {
      const y = padding.top + i * rowHeight;
      const barW = (d.productivityScHa / maxVal) * chartW;
      const isCurrent = d.isCurrentProperty;
      const isBenchmark = d.isBenchmark;
      
      const barFill = isCurrent ? this.colors.secondary : (isBenchmark ? '#0284C7' : '#94A3B8');
      const fontW = isCurrent ? '700' : (isBenchmark ? '600' : '500');

      barsSvg += `
        <g class="regional-row">
          <!-- Nome da localidade -->
          <text x="${padding.left - 12}" y="${y + 18}" fill="${isCurrent ? this.colors.primary : this.colors.text}" font-size="12" font-weight="${fontW}" text-anchor="end" font-family="Inter, sans-serif">
            ${d.municipality}
          </text>
          <!-- Fundo da barra -->
          <rect x="${padding.left}" y="${y + 5}" width="${chartW}" height="18" rx="4" ry="4" fill="#F1F5F9" />
          <!-- Barra de valor -->
          <rect x="${padding.left}" y="${y + 5}" width="${barW}" height="18" rx="4" ry="4" fill="${barFill}">
            <title>${d.municipality}: ${this.formatNumber(d.productivityScHa, 1)} sc/ha (${d.region})</title>
          </rect>
          <!-- Rótulo do valor -->
          <text x="${padding.left + barW + 8}" y="${y + 19}" fill="${this.colors.text}" font-size="11.5" font-weight="600" font-family="Inter, sans-serif">
            ${this.formatNumber(d.productivityScHa, 1)} sc/ha
          </text>
        </g>
      `;
    });

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="rigora-svg-chart" style="width: 100%; height: auto; display: block;" role="img" aria-label="Comparativo Regional de Produtividade">
        ${barsSvg}
      </svg>
    `;

    container.innerHTML = svg;
  },

  /**
   * Gráfico Comparativo do Simulador de Cenários (Original vs Simulado)
   */
  renderScenarioComparison(containerId, originalScenario, simulatedScenario) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 640;
    const height = 280;
    const padding = { top: 35, right: 30, bottom: 50, left: 90 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const metrics = [
      { key: 'revenue', label: 'Receita Bruta' },
      { key: 'cost', label: 'Custo Total' },
      { key: 'margin', label: 'Resultado Oper.' }
    ];

    const allValues = [
      originalScenario.revenue, originalScenario.cost, originalScenario.margin,
      simulatedScenario.revenue, simulatedScenario.cost, simulatedScenario.margin
    ];

    const maxVal = Math.max(...allValues, 100000) * 1.15;
    const minVal = Math.min(0, ...allValues); // suporte a resultado negativo se houver prejuízo
    const range = (maxVal - minVal) || 1;

    const getY = (val) => padding.top + chartH - ((val - minVal) / range) * chartH;
    const zeroY = getY(0);

    // Linhas de grade horizontais
    const gridSteps = 4;
    let gridLinesSvg = '';
    for (let step = 0; step <= gridSteps; step++) {
      const yVal = minVal + (range / gridSteps) * step;
      const yPos = getY(yVal);
      gridLinesSvg += `
        <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="${this.colors.grid}" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${padding.left - 10}" y="${yPos + 4}" fill="${this.colors.muted}" font-size="11" text-anchor="end" font-family="Inter, sans-serif">${this.formatCurrency(yVal)}</text>
      `;
    }

    // Linha de base zero se minVal < 0
    if (minVal < 0) {
      gridLinesSvg += `<line x1="${padding.left}" y1="${zeroY}" x2="${width - padding.right}" y2="${zeroY}" stroke="${this.colors.text}" stroke-width="1.2" />`;
    }

    const groupWidth = chartW / metrics.length;
    const barW = Math.min(32, groupWidth * 0.32);
    const barGap = 6;

    let barsSvg = '';
    metrics.forEach((m, idx) => {
      const groupCenter = padding.left + idx * groupWidth + groupWidth / 2;
      const origVal = originalScenario[m.key];
      const simVal = simulatedScenario[m.key];

      // Barra Original (Esquerda)
      const origX = groupCenter - barW - barGap / 2;
      const origH = Math.abs(getY(origVal) - zeroY);
      const origY = origVal >= 0 ? getY(origVal) : zeroY;
      const origColor = '#94A3B8'; // Cinza corporativo para referência base

      // Barra Simulada (Direita)
      const simX = groupCenter + barGap / 2;
      const simH = Math.abs(getY(simVal) - zeroY);
      const simY = simVal >= 0 ? getY(simVal) : zeroY;
      const simColor = m.key === 'margin' 
        ? (simVal >= 0 ? this.colors.secondary : this.colors.danger)
        : (m.key === 'cost' ? '#E11D48' : this.colors.primary);

      barsSvg += `
        <g class="metric-group">
          <!-- Barra Original -->
          <rect x="${origX}" y="${origY}" width="${barW}" height="${origH}" rx="3" fill="${origColor}">
            <title>Original - ${m.label}: ${this.formatCurrency(origVal)}</title>
          </rect>
          <!-- Barra Simulada -->
          <rect x="${simX}" y="${simY}" width="${barW}" height="${simH}" rx="3" fill="${simColor}">
            <title>Simulado - ${m.label}: ${this.formatCurrency(simVal)}</title>
          </rect>
          <!-- Rótulo no Eixo X -->
          <text x="${groupCenter}" y="${height - 24}" fill="${this.colors.text}" font-size="12" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">
            ${m.label}
          </text>
          <!-- Valores formatados discretos -->
          <text x="${origX + barW / 2}" y="${origY - 5}" fill="${this.colors.muted}" font-size="9.5" text-anchor="middle" font-family="Inter, sans-serif">
            ${this.formatCurrency(origVal)}
          </text>
          <text x="${simX + barW / 2}" y="${simY - 5}" fill="${simColor}" font-size="9.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">
            ${this.formatCurrency(simVal)}
          </text>
        </g>
      `;
    });

    // Legenda no topo
    const legendSvg = `
      <g transform="translate(${width / 2 - 120}, 14)">
        <rect x="0" y="0" width="12" height="12" rx="2" fill="#94A3B8" />
        <text x="18" y="10" fill="${this.colors.text}" font-size="11" font-family="Inter, sans-serif">Cenário Base Original</text>
        <rect x="140" y="0" width="12" height="12" rx="2" fill="${this.colors.secondary}" />
        <text x="158" y="10" fill="${this.colors.text}" font-size="11" font-weight="600" font-family="Inter, sans-serif">Cenário Simulado</text>
      </g>
    `;

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="rigora-svg-chart" style="width: 100%; height: auto; max-height: 280px; display: block;" role="img" aria-label="Comparativo de Cenários Financeiros">
        ${legendSvg}
        ${gridLinesSvg}
        ${barsSvg}
      </svg>
    `;

    container.innerHTML = svg;
  }
};

if (typeof window !== "undefined") {
  window.RigoraCharts = RigoraCharts;
}
