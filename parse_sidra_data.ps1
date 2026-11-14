$data = Get-Content -Path "C:\Users\felip\.gemini\antigravity\scratch\sidra_sample_2723.json" -Raw | ConvertFrom-Json
Write-Host "Total rows: $($data.Count)"
# Row 0 is header:
Write-Host "Header: V=$($data[0].V), D2N=$($data[0].D2N), D3N=$($data[0].D3N)"

# Group by Year
$rows = $data | Select-Object -Skip 1
$years = $rows | Select-Object -ExpandProperty D3N -Unique | Sort-Object

foreach ($y in $years) {
    Write-Host "`n--- ANO $y (Patrocínio - MG - Café Total) ---"
    $yRows = $rows | Where-Object { $_.D3N -eq $y }
    foreach ($r in $yRows) {
        $val = $r.V
        $unit = $r.MN
        $var = $r.D2N
        $varCode = $r.D2C
        Write-Host "  [$varCode] ${var}: $val $unit"
        if ($varCode -eq "112") {
            $kgHa = [double]$val
            $scHa = $kgHa / 60.0
            Write-Host "    -> Produtividade calculada em sacas: $($scHa.ToString('F1')) sc/ha (60kg)"
        }
    }
}
