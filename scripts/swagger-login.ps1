$ErrorActionPreference = "Stop"

$ApiBaseUrl = "http://localhost:3001/api"
$SwaggerUrl = "$ApiBaseUrl/docs"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "        HIGEIA - SWAGGER LOGIN" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------
# 1. CREDENCIAIS
# ---------------------------------------------------------

$email = Read-Host "E-mail"

$passwordSecure = Read-Host "Senha" -AsSecureString

$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR(
    $passwordSecure
)

try {
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
        $passwordPointer
    )
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(
        $passwordPointer
    )
}

# ---------------------------------------------------------
# 2. LOGIN
# ---------------------------------------------------------

Write-Host ""
Write-Host "[1/4] Fazendo login..." -ForegroundColor Yellow

$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "$ApiBaseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
}
catch {
    Write-Host ""
    Write-Host "ERRO AO FAZER LOGIN." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

$initialAccessToken = $loginResponse.accessToken

if (-not $initialAccessToken) {
    Write-Host ""
    Write-Host "A API nao retornou accessToken." -ForegroundColor Red
    exit 1
}

Write-Host "Login realizado." -ForegroundColor Green

# ---------------------------------------------------------
# 3. LISTAR ORGANIZACOES
# ---------------------------------------------------------

Write-Host ""
Write-Host "[2/4] Buscando organizacoes..." -ForegroundColor Yellow

$headers = @{
    Authorization = "Bearer $initialAccessToken"
}

try {
    $organizations = Invoke-RestMethod `
        -Uri "$ApiBaseUrl/auth/organizations" `
        -Method Get `
        -Headers $headers
}
catch {
    Write-Host ""
    Write-Host "ERRO AO BUSCAR ORGANIZACOES." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

if (-not $organizations) {
    Write-Host ""
    Write-Host "Nenhuma organizacao disponivel para este usuario." -ForegroundColor Red
    exit 1
}

# Garante array mesmo quando houver apenas uma organizacao
$organizations = @($organizations)

Write-Host ""
Write-Host "Organizacoes disponiveis:" -ForegroundColor Cyan
Write-Host ""

for ($i = 0; $i -lt $organizations.Count; $i++) {

    $organization = $organizations[$i]

    $organizationName = $organization.name

    if (-not $organizationName) {
        $organizationName = $organization.organizationName
    }

    if (-not $organizationName) {
        $organizationName = $organization.id
    }

    Write-Host "[$($i + 1)] $organizationName"
}

# ---------------------------------------------------------
# 4. SELECIONAR ORGANIZACAO
# ---------------------------------------------------------

if ($organizations.Count -eq 1) {

    $selectedOrganization = $organizations[0]

    Write-Host ""
    Write-Host "Uma unica organizacao encontrada. Selecionando automaticamente." -ForegroundColor Green

}
else {

    Write-Host ""

    do {

        $selection = Read-Host "Escolha a organizacao"

        $selectionNumber = 0

        $validSelection =
            [int]::TryParse(
                $selection,
                [ref]$selectionNumber
            ) -and
            $selectionNumber -ge 1 -and
            $selectionNumber -le $organizations.Count

        if (-not $validSelection) {
            Write-Host "Opcao invalida." -ForegroundColor Red
        }

    } until ($validSelection)

    $selectedOrganization =
        $organizations[$selectionNumber - 1]
}

$organizationId = $selectedOrganization.id

if (-not $organizationId) {
    $organizationId = $selectedOrganization.organizationId
}

if (-not $organizationId) {

    Write-Host ""
    Write-Host "Nao foi possivel identificar organizationId." -ForegroundColor Red

    Write-Host ""
    Write-Host "Resposta recebida:" -ForegroundColor Yellow

    $selectedOrganization |
        ConvertTo-Json -Depth 10 |
        Write-Host

    exit 1
}

Write-Host ""
Write-Host "[3/4] Selecionando organizacao..." -ForegroundColor Yellow

$organizationBody = @{
    organizationId = $organizationId
} | ConvertTo-Json

try {

    $organizationResponse = Invoke-RestMethod `
        -Uri "$ApiBaseUrl/auth/select-organization" `
        -Method Post `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $organizationBody

}
catch {

    Write-Host ""
    Write-Host "ERRO AO SELECIONAR ORGANIZACAO." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    exit 1
}

$contextualizedAccessToken =
    $organizationResponse.accessToken

if (-not $contextualizedAccessToken) {

    Write-Host ""
    Write-Host "A API nao retornou o access token contextualizado." -ForegroundColor Red

    Write-Host ""
    Write-Host "Resposta recebida:" -ForegroundColor Yellow

    $organizationResponse |
        ConvertTo-Json -Depth 10 |
        Write-Host

    exit 1
}

# ---------------------------------------------------------
# 5. COPIAR TOKEN
# ---------------------------------------------------------

Write-Host ""
Write-Host "[4/4] Preparando Swagger..." -ForegroundColor Yellow

Set-Clipboard -Value $contextualizedAccessToken

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " TOKEN COPIADO PARA A AREA DE TRANSFERENCIA" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Write-Host ""
Write-Host "No Swagger:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Clique em Authorize"
Write-Host "2. Pressione CTRL + V"
Write-Host "3. Clique em Authorize"
Write-Host ""
Write-Host "IMPORTANTE: nao escreva Bearer." -ForegroundColor Yellow
Write-Host ""

# ---------------------------------------------------------
# 6. ABRIR SWAGGER
# ---------------------------------------------------------

Start-Process $SwaggerUrl

Write-Host "Swagger aberto no navegador." -ForegroundColor Green
Write-Host ""