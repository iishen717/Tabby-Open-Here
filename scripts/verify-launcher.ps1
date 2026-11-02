$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
$launcher = Join-Path $repo 'launcher\tabby.exe'
if (-not (Test-Path $launcher)) {
    throw 'Launcher not built. Run npm run build:launcher first.'
}

$tmp = Join-Path $env:TEMP 'tabby-open-here-launcher-test'
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $tmp | Out-Null
$base = Join-Path $tmp 'base'
# Build the Chinese folder name from code points so the script is encoding-independent.
$cnName = -join (0x76EE, 0x6807, 0x0020, 0x6587, 0x4EF6, 0x5939 | ForEach-Object { [char]$_ })
$target = Join-Path $tmp $cnName
New-Item -ItemType Directory -Force $base, $target | Out-Null

$fakeCs = Join-Path $tmp 'FakeTabby.cs'
@'
using System;
using System.IO;
using System.Text;
class FakeTabby {
    static void Main(string[] args) {
        File.WriteAllText(
            Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "fake-args.txt"),
            "cwd=" + Environment.CurrentDirectory + "\nargs=" + string.Join("|", args),
            Encoding.UTF8);
    }
}
'@ | Set-Content -Path $fakeCs -Encoding utf8

$cscCandidates = @(
    (Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'),
    (Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe')
) | Where-Object { Test-Path $_ }
$csc = $cscCandidates[0]
$fake = Join-Path $tmp 'FakeTabby.exe'
& $csc -nologo -target:exe -out:$fake $fakeCs
if ($LASTEXITCODE -ne 0) { throw 'FakeTabby compile failed' }

Set-Content -Path (Join-Path $base 'tabby-path.txt') -Value $fake -Encoding utf8
$env:TABBY_OPEN_HERE_DIR = $base

function Assert-FakeArgs([string]$label, [string]$expected) {
    $out = Join-Path $tmp 'fake-args.txt'
    if (-not (Test-Path $out)) { throw "$label : launcher did not start FakeTabby" }
    $content = Get-Content -Raw -Encoding utf8 $out
    Write-Host "[$label] $content"
    if ($content -notmatch [regex]::Escape($expected)) { throw "$label : wrong directory argument" }
    if ($content -notmatch 'open') { throw "$label : open argument missing" }
    Remove-Item $out -Force
}

# 1) Direct call with a directory containing spaces and Chinese characters.
& $launcher $target
Start-Sleep -Milliseconds 800
Assert-FakeArgs 'direct' $cnName

# 2) App Paths + ShellExecute, simulating the Explorer address bar.
$testKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\tabby-open-here-test.exe'
try {
    New-Item -Path $testKey -Force | Out-Null
    Set-ItemProperty -Path $testKey -Name '(default)' -Value $launcher
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = 'tabby-open-here-test'
    $psi.UseShellExecute = $true
    $psi.WorkingDirectory = $target
    $p = [System.Diagnostics.Process]::Start($psi)
    $p.WaitForExit()
    Start-Sleep -Milliseconds 800
    Assert-FakeArgs 'app-paths' $cnName
} finally {
    Remove-Item -Path $testKey -Recurse -Force -ErrorAction SilentlyContinue
}

# 3) Drive root, verifies trailing-backslash escaping in the open argument.
& $launcher 'C:\'
Start-Sleep -Milliseconds 800
Assert-FakeArgs 'drive-root' 'C:\'

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host 'LAUNCHER TEST PASSED'
