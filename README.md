# Rigora Agro Intelligence — MVP

> **Global Solution 2026 • FIAP • Tema: CitizenTech**  
> Democratizando inteligência de dados agrícolas, econômicos e climáticos para pequenos cafeicultores de Minas Gerais.

---

## 🎯 Objetivo do Projeto

O **Rigora Agro Intelligence** é uma plataforma SaaS demonstrativa desenvolvida para apoiar pequenos produtores de café arábica e cooperativas agrícolas de Minas Gerais (destaque para a região do Cerrado Mineiro).

A solução reúne em uma interface limpa, corporativa e intuitiva:
- **Dashboards de Gestão de Safra**: Acompanhamento de custos, produtividade estimada e alertas fitossanitários.
- **Mapeamento de Talhões**: Controle granular por variedade (Catuaí Vermelho, Bourbon Amarelo, Mundo Novo).
- **Inteligência e Projeções**:
  - Análise histórica de 5 safras (rendimento, custo/ha e margem).
  - Benchmarking municipal com polos cafeeiros de Minas Gerais (Patrocínio, Guaxupé, Carmo de Minas, Três Pontas, Manhuaçu).
  - Simulador paramétrico de cenários com recálculo em tempo real de receita, custos e resultado operacional.
- **Automações Inteligentes**: Testes locais de regras de custo elevado, reposição de estoque de insumos e alertas climáticos para prevenção de doenças.
- **Catálogo de Fontes de Dados**: Transparência sobre origens públicas oficiais (IBGE SIDRA, Conab, INMET) e registros locais do cafeicultor.

---

## 🚀 Como Executar

O projeto foi construído com **HTML5, CSS3 e JavaScript puro**, sem necessidade de instalação de dependências, Node.js, compilação ou servidores web obrigatórios.

1. Navegue até a pasta do projeto:
   ```
   C:\Users\felip\.gemini\antigravity\scratch\rigora-agro-intelligence\
   ```
2. Abra o arquivo **`index.html`** diretamente em qualquer navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. Na **Tela de Login**, clique em **"Entrar no Dashboard"** para acessar a aplicação (ambiente demonstrativo com credenciais pré-configuradas).

---

## 📁 Estrutura de Arquivos

```
rigora-agro-intelligence/
├── index.html          # Estrutura semântica SPA (Login e 5 telas internas)
├── css/
│   └── style.css       # Design System corporativo (Grid, Flexbox, Responsivo, Paleta #163D32 e #248763)
├── js/
│   ├── data.js         # Base de dados demonstrativa (Fazenda Santa Rita do Cerrado, safras, insumos)
│   ├── charts.js       # Motor de gráficos vetoriais em SVG puro (sem dependências externas)
│   └── app.js          # Lógica da aplicação, navegação, fórmulas do simulador, testes e cadastro
├── assets/             # Recursos estáticos adicionais
└── README.md           # Documentação completa do projeto
```

---

## 🖥️ Mapeamento das Telas e Funcionalidades

### 1. Tela de Login
- **Layout Split Screen**: Painel institucional verde-escuro (`#163D32`) à esquerda com a frase síntese do projeto; formulário à direita com e-mail e senha de demonstração.
- **Acesso direto**: Redirecionamento instantâneo sem necessidade de validação ou dados reais.

### 2. Visão Geral (Dashboard)
- **4 Cards KPI**:
  - Área Cultivada (`42,5 ha`)
  - Custo Estimado da Safra (`R$ 412.250,00` / `R$ 9.700,00 por hectare`)
  - Produtividade Estimada (`38,4 sc/ha` — +9,7% vs média regional)
  - Alertas Ativos (`2 alertas operacionais`)
- **Divisão 65% / 35%**:
  - Gráfico de evolução de custos mensais (safra 2025/2026).
  - Gráfico de barras da produtividade histórica (2021/2022 a 2025/2026).
  - Alertas recentes com níveis de criticidade e componente de **Condições Climáticas** integrado à API pública de previsão do **INMET** (`apiprevmet3.inmet.gov.br/previsao/3148103` - Patrocínio/MG), exibindo temperatura mínima e máxima, condições do tempo, umidade e data de referência, com tratamento de fallback para bloqueio de CORS.
- **Tabela de Custos por Categoria**: Fertilizantes (40%), Defensivos (22,4%), Mão de Obra (21,5%), Mecanização (11%), Energia/Outros (5,1%).

### 3. Propriedades e Safras
- Identificação da **Fazenda Santa Rita do Cerrado** (Patrocínio - MG, 980m de altitude, Denominação de Origem Cerrado Mineiro).
- Tabela com os 3 talhões cadastrados, variedades, área, produtividade estimada, custos e situação fitossanitária.
- Botão **"Nova atividade"**: Formulário interativo para registrar novas despesas de campo, atualizando os custos em memória imediatamente e refletindo nos indicadores da interface.

### 4. Inteligência e Projeções
- **Seção A (Análise Histórica)**: Gráficos e tabela comparando 5 safras, com seletor de métrica (Produtividade, Custo Total, Custo/ha, Resultado Operacional).
- **Seção B (Comparação Regional)**: Gráfico e benchmarking comparando a propriedade a municípios de referência de Minas Gerais, integrado aos dados oficiais da API do **IBGE SIDRA** (Tabela 1613 - PAM para Patrocínio/MG, Café em grão). A produtividade municipal é calculada dividindo o rendimento em kg/ha por 60 ($\text{sc/ha} = \text{kg/ha} / 60$), preservando a distinção dos indicadores fictícios da propriedade.
- **Seção C (Simulador de Cenários)**:
  - Sliders e inputs interativos para: Área, Produtividade, Custo/ha, Preço da saca e Variação percentual de custos.
  - Fórmulas de recálculo em tempo real:
    $$\text{Produção} = \text{Área} \times \text{Produtividade}$$
    $$\text{Receita} = \text{Produção} \times \text{Preço por saca}$$
    $$\text{Custo} = \text{Área} \times \text{Custo por hectare} \times \left(1 + \frac{\text{Variação \%}}{100}\right)$$
    $$\text{Resultado Operacional} = \text{Receita} - \text{Custo}$$
  - Gráfico comparativo entre o Cenário Base e o Cenário Simulado.
  - Botões para presets "Cenário Conservador" e "Cenário Otimista".

### 5. Automações
- **Regra 1 (Custo Elevado)**: Alerta disparado quando o custo registrado ultrapassar o limite (permite editar o teto em R$/ha).
- **Regra 2 (Estoque Baixo)**: Aviso de reposição quando insumos críticos atingem a reserva de segurança.
- **Regra 3 (Condição Climática)**: Diagnóstico fitossanitário para risco de ferrugem e cercosporiose com base em temperatura e umidade.
- Botão **"Testar regra"**: Executa diagnósticos locais imediatos com exibição detalhada no console de execução e toasts visuais.

### 6. Fontes de Dados
- Mapeamento das 4 fontes: **IBGE (SIDRA - Tabela 1613)**, **Conab**, **INMET** e **Registros da Propriedade**.
- O status do **IBGE** é atualizado para "Conectado" dinamicamente mediante recebimento e validação oficial da resposta da API SIDRA.
- Links oficiais e identificação de "Integração planejada" para fontes ainda em consolidação.
- Explicação do alinhamento com a arquitetura **CitizenTech** e conexão planejada com o pipeline de dados Python.

---

## 🎨 Identidade Visual e Design System

- **Cor Primária**: `#163D32` (Verde corporativo escuro)
- **Cor Secundária**: `#248763` (Verde destaque e ação)
- **Background**: `#F5F7F6` (Cinza claro suave)
- **Cards & Superfícies**: `#FFFFFF`
- **Textos & Títulos**: `#26352F` (Grafite de alto contraste)
- **Tipografia**: `Inter`, com alternativas sans-serif de sistema

---

## ⚖️ Conformidade e Premissas da Global Solution

1. Todos os valores de simulação são identificados com a tag **"Dados demonstrativos"**.
2. Não são atribuídos números inventados como declarações oficiais do IBGE, Conab ou INMET.
3. Não há dependências de APIs pagas, CDNs obrigatórias ou serviços em nuvem.
4. O projeto está 100% pronto para demonstração em bancas, pitches acadêmicos e para receber futuras atualizações via notebook Python.
