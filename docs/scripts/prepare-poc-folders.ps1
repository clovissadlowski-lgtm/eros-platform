$ErrorActionPreference = "Stop"

Write-Host "Higeia PoC safe folder preparation"
Write-Host "This script does not install packages or access the internet."

$required = @(
  "apps",
  "packages/shared-types",
  "packages/validation",
  "packages/ai-contracts",
  "tests/security",
  "evidence/stack-poc"
)

foreach ($path in $required) {
  New-Item -ItemType Directory -Force $path | Out-Null
  Write-Host "Prepared: $path"
}

Write-Host ""
Write-Host "Next: review docs/12-Roadmap/Stack-PoC/HIGEIA-STACK-SCAFFOLD-COMMAND-PLAN-v1.0.md"
