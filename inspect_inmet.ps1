$content = Get-Content -Path 'C:\Users\felip\.gemini\antigravity\scratch\inmet_patrocinio.json' -Raw | ConvertFrom-Json
$pat = $content.psobject.properties['3148103'].value

foreach ($dateProp in $pat.psobject.properties) {
    Write-Host "=== DATE: $($dateProp.Name) ==="
    $dayObj = $dateProp.Value
    foreach ($periodProp in $dayObj.psobject.properties) {
        Write-Host "  Period/Key: $($periodProp.Name)"
        $val = $periodProp.Value
        if ($val -is [System.Management.Automation.PSCustomObject]) {
            foreach ($subProp in $val.psobject.properties) {
                if ($subProp.Name -notlike "*icone*") {
                    Write-Host "    $($subProp.Name) = $($subProp.Value)"
                }
            }
        } else {
            if ($periodProp.Name -notlike "*icone*") {
                Write-Host "    Value = $val"
            }
        }
    }
}
