$meta = Get-Content -Path "C:\Users\felip\.gemini\antigravity\scratch\ibge_1613_meta.json" -Raw | ConvertFrom-Json
Write-Host "Nome Tabela: $($meta.nome)"
Write-Host "Periodos disponiveis: $($meta.periodicidade.frequencia) de $($meta.periodicidade.inicio) a $($meta.periodicidade.fim)"

Write-Host "`nVariaveis:"
foreach ($v in $meta.variaveis) {
    Write-Host "  ID: $($v.id) - $($v.nome) ($($v.unidade))"
}

Write-Host "`nClassificacoes e Categorias (Filtro Café):"
foreach ($c in $meta.classificacoes) {
    Write-Host "  Class ID: $($c.id) - $($c.nome)"
    foreach ($cat in $c.categorias) {
        if ($cat.nome -match "Café|Cafe") {
            Write-Host "    Cat ID: $($cat.id) - $($cat.nome)"
        }
    }
}
