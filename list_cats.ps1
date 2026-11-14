$meta = Get-Content -Path "C:\Users\felip\.gemini\antigravity\scratch\ibge_1613_meta.json" -Raw | ConvertFrom-Json
Write-Host "Classificacoes count: $($meta.classificacoes.Count)"
foreach ($c in $meta.classificacoes) {
    Write-Host "Class: $($c.id) - $($c.nome) (Categorias: $($c.categorias.Count))"
    foreach ($cat in $c.categorias) {
        Write-Host "  $($cat.id) : $($cat.nome)"
    }
}
