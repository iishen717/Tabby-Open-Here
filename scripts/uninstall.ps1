# Tabby Open Here integration cleanup.
# Use this only when the plugin folder has already been deleted and the
# Tabby settings page is no longer available.
# Normal uninstall: Tabby Settings -> Open Here -> Uninstall Integration.
$ErrorActionPreference = 'SilentlyContinue'

$appPaths = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\tabby.exe'
$marker = (Get-ItemProperty -Path $appPaths -Name OpenHereMarker -ErrorAction SilentlyContinue).OpenHereMarker
if ($marker -eq 'tabby-open-here') {
    Remove-Item -Path $appPaths -Recurse -Force
    Write-Host 'Removed App Paths: tabby'
}

$keys = @(
    'HKCU:\Software\Classes\Directory\shell\TabbyOpenHere',
    'HKCU:\Software\Classes\Directory\Background\shell\TabbyOpenHere',
    'HKCU:\Software\Classes\Drive\shell\TabbyOpenHere',
    'HKCU:\Software\Classes\Drive\Background\shell\TabbyOpenHere'
)
foreach ($key in $keys) {
    if (Test-Path $key) {
        Remove-Item -Path $key -Recurse -Force
        Write-Host "Removed context menu: $key"
    }
}

$baseDir = Join-Path $env:LOCALAPPDATA 'TabbyOpenHere'
if (Test-Path $baseDir) {
    Remove-Item -Path $baseDir -Recurse -Force
    Write-Host "Removed launcher directory: $baseDir"
}

Write-Host 'Tabby Open Here integration cleanup finished.'
