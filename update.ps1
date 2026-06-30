$style = @"
<style>
  [fill^="url(#pattern"] {
    animation: float 6s ease-in-out infinite;
    transform-origin: center;
  }
  [fill^="url(#pattern"]:nth-child(even) {
    animation-duration: 8s;
  }
  [fill^="url(#pattern"]:nth-child(3n) {
    animation-duration: 7s;
    animation-delay: -2s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
</style>
"@

$files = @("Berrybg.svg", "Citrusbg.svg", "Kiwibg.svg", "Litchbg.svg", "Orangebg.svg", "Pearbg.svg")
$dir = "d:\Tin Juice Can\src\assets"

foreach ($file in $files) {
    $path = Join-Path $dir $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -notmatch "<style>") {
            $content = $content -replace '(<svg[^>]*>)', "`$1`n$style"
            Set-Content -Path $path -Value $content
            Write-Host "Successfully updated $file" -ForegroundColor Green
        } else {
            Write-Host "Style already in $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}
