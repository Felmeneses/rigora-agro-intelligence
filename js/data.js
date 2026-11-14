/**
 * Rigora Agro Intelligence - Dados Demonstrativos
 * Projeto Global Solution 2026 - FIAP (CitizenTech)
 * Foco: Pequenos cafeicultores de Minas Gerais
 * 
 * NOTA: Todos os valores e cenários são de caráter demonstrativo.
 */

const RIGORA_DATA = {
  // Dados da Propriedade Principal
  property: {
    id: "prop-01",
    name: "Fazenda Santa Rita do Cerrado",
    owner: "Cooperativa dos Cafeicultores do Cerrado / Produtor Demo",
    municipality: "Patrocínio",
    state: "MG",
    region: "Cerrado Mineiro",
    totalAreaHa: 48.0,
    cultivatedAreaHa: 42.5,
    crop: "Café Arábica",
    varieties: "Catuaí Vermelho IAC 144, Bourbon Amarelo, Mundo Novo",
    currentSafra: "2025/2026",
    altitudeM: 980,
    soilType: "Latossolo Vermelho-Amarelo distrófico",
    irrigation: "Sequeiro com gotejamento emergencial",
    certifications: "Região do Cerrado Mineiro (D.O.) - Transição"
  },

  // Talhões Cadastrados
  talhoes: [
    {
      id: "T01",
      name: "Talhão 01 - Encosta do Sol",
      variety: "Catuaí Vermelho IAC 144",
      plantingYear: 2018,
      areaHa: 15.0,
      estimatedProductivityScHa: 41.2,
      registeredCostBrl: 147500.00,
      status: "Maturação e Enchimento de Grãos",
      statusType: "success", // success, warning, info
      lastIntervention: "Adubação foliar com micronutrientes (Boro e Zinco)"
    },
    {
      id: "T02",
      name: "Talhão 02 - Chapadão Central",
      variety: "Bourbon Amarelo",
      plantingYear: 2019,
      areaHa: 18.5,
      estimatedProductivityScHa: 37.8,
      registeredCostBrl: 178250.00,
      status: "Granação / Atenção Umidade",
      statusType: "warning",
      lastIntervention: "Manejo integrado da ferrugem-do-cafeeiro"
    },
    {
      id: "T03",
      name: "Talhão 03 - Vereda Baixa",
      variety: "Mundo Novo IAC 376-4",
      plantingYear: 2017,
      areaHa: 9.0,
      estimatedProductivityScHa: 35.5,
      registeredCostBrl: 86500.00,
      status: "Pós-Tratamento Fitossanitário",
      statusType: "info",
      lastIntervention: "Roçada ecológica e controle biológico de broca"
    }
  ],

  // Safras Disponíveis
  safras: [
    { id: "2025/2026", label: "Safra 2025/2026 (Atual)", isCurrent: true },
    { id: "2024/2025", label: "Safra 2024/2025 (Concluída)", isCurrent: false },
    { id: "2023/2024", label: "Safra 2023/2024 (Histórica)", isCurrent: false }
  ],

  // Custos por Categoria da Safra Atual
  costsByCategory: [
    { category: "Fertilizantes e Corretivos", value: 165000.00, percentage: 40.0, perHa: 3882.35 },
    { category: "Defensivos e Controle Biológico", value: 92450.00, percentage: 22.4, perHa: 2175.29 },
    { category: "Mão de Obra e Colheita", value: 88500.00, percentage: 21.5, perHa: 2082.35 },
    { category: "Mecanização e Combustível", value: 45300.00, percentage: 11.0, perHa: 1065.88 },
    { category: "Energia, Manutenção e Outros", value: 21000.00, percentage: 5.1, perHa: 494.12 }
  ],

  // Histórico de Safras (Análise Histórica)
  historicalSafras: [
    {
      safra: "2021/2022",
      productivityScHa: 31.5,
      totalProductionSc: 1338,
      costTotalBrl: 308000.00,
      costPerHaBrl: 7247.00,
      avgPricePerSackBrl: 1180.00,
      totalRevenueBrl: 1578840.00,
      netResultBrl: 1270840.00
    },
    {
      safra: "2022/2023",
      productivityScHa: 34.0,
      totalProductionSc: 1445,
      costTotalBrl: 345000.00,
      costPerHaBrl: 8117.00,
      avgPricePerSackBrl: 1020.00,
      totalRevenueBrl: 1473900.00,
      netResultBrl: 1128900.00
    },
    {
      safra: "2023/2024",
      productivityScHa: 33.2,
      totalProductionSc: 1411,
      costTotalBrl: 372000.00,
      costPerHaBrl: 8752.00,
      avgPricePerSackBrl: 1150.00,
      totalRevenueBrl: 1622650.00,
      netResultBrl: 1250650.00
    },
    {
      safra: "2024/2025",
      productivityScHa: 36.8,
      totalProductionSc: 1564,
      costTotalBrl: 395000.00,
      costPerHaBrl: 9294.00,
      avgPricePerSackBrl: 1290.00,
      totalRevenueBrl: 2017560.00,
      netResultBrl: 1622560.00
    },
    {
      safra: "2025/2026 (Est.)",
      productivityScHa: 38.4,
      totalProductionSc: 1632,
      costTotalBrl: 412250.00,
      costPerHaBrl: 9700.00,
      avgPricePerSackBrl: 1250.00,
      totalRevenueBrl: 2040000.00,
      netResultBrl: 1627750.00
    }
  ],

  // Evolução Mensal dos Custos (Safra 2025/2026)
  monthlyCosts2025: [
    { month: "Jul", value: 32000 },
    { month: "Ago", value: 38500 },
    { month: "Set", value: 46200 },
    { month: "Out", value: 58000 },
    { month: "Nov", value: 64500 },
    { month: "Dez", value: 49000 },
    { month: "Jan", value: 43500 },
    { month: "Fev", value: 39200 },
    { month: "Mar (proj)", value: 41350 }
  ],

  // Comparação Regional (Municípios de MG - Referência da Região)
  regionalComparison: [
    {
      municipality: "Patrocínio (Fazenda Santa Rita)",
      region: "Cerrado Mineiro",
      productivityScHa: 38.4,
      avgCostPerHaBrl: 9700.00,
      altitudeM: 980,
      diffToRegionalAvgPct: 9.7, // +9.7% acima
      isCurrentProperty: true
    },
    {
      municipality: "Média Regional Cerrado Mineiro",
      region: "Cerrado Mineiro",
      productivityScHa: 35.0,
      avgCostPerHaBrl: 9850.00,
      altitudeM: 950,
      diffToRegionalAvgPct: 0.0,
      isCurrentProperty: false,
      isBenchmark: true
    },
    {
      municipality: "Guaxupé",
      region: "Sul de Minas",
      productivityScHa: 33.5,
      avgCostPerHaBrl: 9980.00,
      altitudeM: 830,
      diffToRegionalAvgPct: -4.3,
      isCurrentProperty: false
    },
    {
      municipality: "Carmo de Minas",
      region: "Mantiqueira de Minas",
      productivityScHa: 32.8,
      avgCostPerHaBrl: 10450.00,
      altitudeM: 1050,
      diffToRegionalAvgPct: -6.3,
      isCurrentProperty: false
    },
    {
      municipality: "Três Pontas",
      region: "Sul de Minas",
      productivityScHa: 34.2,
      avgCostPerHaBrl: 9620.00,
      altitudeM: 900,
      diffToRegionalAvgPct: -2.3,
      isCurrentProperty: false
    },
    {
      municipality: "Manhuaçu",
      region: "Matas de Minas",
      productivityScHa: 31.0,
      avgCostPerHaBrl: 8900.00,
      altitudeM: 650,
      diffToRegionalAvgPct: -11.4,
      isCurrentProperty: false
    }
  ],

  // Atividades Recentes Registradas
  recentActivities: [
    {
      id: "ACT-104",
      date: "12/03/2026",
      talhaoId: "T02",
      talhaoName: "Talhão 02 - Chapadão Central",
      category: "Defensivos e Controle Biológico",
      description: "Aplicação preventiva de fungicida cúprico e agente biológico (Bacillus subtilis)",
      costBrl: 4200.00
    },
    {
      id: "ACT-103",
      date: "05/03/2026",
      talhaoId: "T01",
      talhaoName: "Talhão 01 - Encosta do Sol",
      category: "Fertilizantes e Corretivos",
      description: "Adubação foliar com boro e zinco para sustentação dos frutos",
      costBrl: 3150.00
    },
    {
      id: "ACT-102",
      date: "24/02/2026",
      talhaoId: "T03",
      talhaoName: "Talhão 03 - Vereda Baixa",
      category: "Mecanização e Combustível",
      description: "Roçada mecanizada nas entrelinhas e manutenção de cobertura verde",
      costBrl: 1850.00
    },
    {
      id: "ACT-101",
      date: "15/02/2026",
      talhaoId: "T01",
      talhaoName: "Talhão 01 - Encosta do Sol",
      category: "Mão de Obra e Colheita",
      description: "Desbrota manual e alinhamento de ramos produtivos",
      costBrl: 2400.00
    }
  ],

  // Condições Climáticas (Simulação Estação Meteorológica Patrocínio / INMET)
  weather: {
    station: "Estação Automática INMET Patrocínio (A522 - Simulada)",
    temperatureC: 24.5,
    minTempC: 17.2,
    maxTempC: 29.8,
    humidityPct: 68,
    windSpeedKmh: 11.5,
    accumulatedRainMonthMm: 142.4,
    historicalMonthAvgMm: 165.0,
    rainStatus: "Normal para março",
    cropPhaseRecommendation: "Fase de enchimento/maturação: Umidade favorável, monitorar talhões de baixada para risco de cercosporiose."
  },

  // Alertas do Sistema
  alerts: [
    {
      id: "ALT-01",
      level: "warning", // warning, danger, info
      title: "Umidade do Solo Abaixo do Ideal",
      target: "Talhão 02 - Chapadão Central",
      description: "Estimativa de déficit hídrico decendial de 18mm no horizonte de 20cm. Recomenda-se acionamento pontual de rega.",
      date: "Hoje às 08:30",
      active: true
    },
    {
      id: "ALT-02",
      level: "info",
      title: "Limite de Custo com Defensivos em 85%",
      target: "Orçamento da Safra 2025/2026",
      description: "Gastos com proteção fitossanitária atingiram R$ 92.450 de um limite estimado de R$ 108.000.",
      date: "Ontem às 16:45",
      active: true
    },
    {
      id: "ALT-03",
      level: "success",
      title: "Clima Favorável para Maturação",
      target: "Geral da Propriedade",
      description: "Amplitude térmica de 12°C nos últimos 7 dias beneficia a concentração de açúcares no grão arábica.",
      date: "10/03/2026",
      active: false
    }
  ],

  // Estoque de Insumos (Regra 2 de Automação)
  inventory: [
    {
      id: "INS-01",
      name: "Fertilizante NPK 20-00-20",
      category: "Nutrição de Solo",
      currentQuantity: 18,
      minQuantity: 25,
      unit: "sacas (50kg)",
      status: "Crítico - Reposição Necessária"
    },
    {
      id: "INS-02",
      name: "Fungicida Biológico (Bacillus subtilis)",
      category: "Controle Biológico",
      currentQuantity: 32,
      minQuantity: 15,
      unit: "litros",
      status: "Estoque Regular"
    },
    {
      id: "INS-03",
      name: "Adubo Foliar Quelatado (Zinco + Boro)",
      category: "Nutrição Foliar",
      currentQuantity: 8,
      minQuantity: 12,
      unit: "galões (20L)",
      status: "Atenção - Próximo ao Mínimo"
    },
    {
      id: "INS-04",
      name: "Óleo Mineral Emulsionável",
      category: "Adjuvante",
      currentQuantity: 40,
      minQuantity: 20,
      unit: "litros",
      status: "Estoque Adequado"
    }
  ],

  // Regras de Automação Demonstrativas
  automationRules: [
    {
      id: "RULE-01",
      name: "Alerta de Custo Elevado por Hectare",
      condition: "Quando o custo registrado por hectare ultrapassar o limite configurado.",
      thresholdValue: 10500.00,
      unit: "R$/ha",
      enabled: true,
      lastTrigger: "10/03/2026 11:20",
      description: "Monitora a soma das despesas rateadas pela área total. Se ultrapassar o teto, notifica o cafeicultor.",
      type: "cost"
    },
    {
      id: "RULE-02",
      name: "Aviso de Estoque Mínimo de Insumos Críticos",
      condition: "Quando a quantidade de qualquer insumo no galpão ficar menor que a reserva de segurança.",
      thresholdValue: 20, // genérico
      unit: "unidades",
      enabled: true,
      lastTrigger: "08/03/2026 09:15",
      description: "Evita paralisações de pulverização ou adubação durante janelas climáticas ideais.",
      type: "stock"
    },
    {
      id: "RULE-03",
      name: "Alerta Fitossanitário por Condição Climática",
      condition: "Quando houver mais de 5 dias seguidos com umidade > 80% e temperatura média entre 22°C e 26°C.",
      thresholdValue: 80,
      unit: "% UR",
      enabled: true,
      lastTrigger: "02/03/2026 17:40",
      description: "Identifica condições altamente favoráveis à ferrugem-do-cafeeiro (Hemileia vastatrix) e cercosporiose.",
      type: "climate"
    }
  ],

  // Fontes de Dados e Referências Técnicas
  dataSources: [
    {
      id: "SRC-01",
      name: "IBGE - SIDRA (Sistema IBGE de Recuperação Automática)",
      dataType: "Produção Agrícola Municipal (PAM) e Produtividade em Sacas/ha",
      period: "Séries históricas 2020 a 2024",
      status: "Integração planejada",
      statusCode: "planned",
      officialUrl: "https://sidra.ibge.gov.br",
      technicalNote: "Dados públicos agregados por município de MG. Futuro conector via REST API SIDRA no pipeline Python."
    },
    {
      id: "SRC-02",
      name: "Conab (Companhia Nacional de Abastecimento)",
      dataType: "Custos de Produção da Cafeicultura e Acompanhamento de Safras",
      period: "Série histórica 2021 a 2025",
      status: "Integração planejada",
      statusCode: "planned",
      officialUrl: "https://www.conab.gov.br",
      technicalNote: "Parâmetros de custo operacional total (COT) e custo operacional efetivo (COE) para café arábica."
    },
    {
      id: "SRC-03",
      name: "INMET (Instituto Nacional de Meteorologia)",
      dataType: "Previsão meteorológica diária municipal (temperatura mín/máx, umidade e condições)",
      period: "Previsão diária e decendial (Patrocínio - MG / IBGE 3148103)",
      status: "Integrado (API Previsão)",
      statusCode: "connected",
      officialUrl: "https://apiprevmet3.inmet.gov.br/previsao/3148103",
      technicalNote: "Conector via API aberta INMET (apiprevmet3.inmet.gov.br/previsao/3148103) para dados de previsão municipal."
    },
    {
      id: "SRC-04",
      name: "Registros de Campo da Propriedade (Rigora Ledger)",
      dataType: "Lançamentos de despesas, atividades operacionais, talhões e insumos",
      period: "Safra 2025/2026 (Em andamento)",
      status: "Conectado (Local)",
      statusCode: "connected",
      officialUrl: "",
      technicalNote: "Dados armazenados localmente na sessão do produtor, prontos para sincronização ou exportação tabular."
    }
  ]
};

// Congelamento superficial de suporte (pode ser clonado em runtime)
if (typeof window !== "undefined") {
  window.RIGORA_DATA = RIGORA_DATA;
}
