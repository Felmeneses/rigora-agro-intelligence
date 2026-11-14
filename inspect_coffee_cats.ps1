$meta = Get-Content -Path "C:\Users\felip\.gemini\antigravity\scratch\ibge_1613_meta.json" -Raw | ConvertFrom-Json
$c82 = $meta.classificacoes | Where-Object { $_.id -eq "82" }
foreach ($cat in $c82.categorias) {
    if ($cat.nome -match "Café|Cafe|café|cafe") {
        Write-Host "Cat ID: $($cat.id) - $($cat.nome)"
    }
}
