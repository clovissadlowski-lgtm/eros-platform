param(
    [string]$PatientId = "507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab"
)

$ErrorActionPreference = "Stop"

$ApiBaseUrl = "http://localhost:3001/api"

$createdExamId = $null
$createdResultId = $null
$contextualizedHeaders = $null

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " HIGEIA - LABORATORY EXAMS SMOKE TEST" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Paciente:" -ForegroundColor DarkGray
Write-Host $PatientId -ForegroundColor White
Write-Host ""

# ---------------------------------------------------------
# CREDENCIAIS
# ---------------------------------------------------------

$email = Read-Host "E-mail"

$passwordSecure =
    Read-Host "Senha" -AsSecureString

$passwordPointer =
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR(
        $passwordSecure
    )

try {
    $password =
        [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
            $passwordPointer
        )
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(
        $passwordPointer
    )
}

try {

    # ---------------------------------------------------------
    # 1. LOGIN
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[1/10] Fazendo login..." -ForegroundColor Yellow

    $loginBody = @{
        email    = $email
        password = $password
    } | ConvertTo-Json

    $loginResponse =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $loginBody

    $initialAccessToken =
        $loginResponse.accessToken

    if (-not $initialAccessToken) {
        throw "A API nao retornou accessToken no login."
    }

    Write-Host "OK - Login realizado." -ForegroundColor Green

    $initialHeaders = @{
        Authorization = "Bearer $initialAccessToken"
    }

    # ---------------------------------------------------------
    # 2. ORGANIZACOES
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[2/10] Buscando organizacoes..." -ForegroundColor Yellow

    $organizations =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/auth/organizations" `
            -Method Get `
            -Headers $initialHeaders

    $organizations = @($organizations)

    if ($organizations.Count -eq 0) {
        throw "Nenhuma organizacao disponivel."
    }

    Write-Host ""
    Write-Host "Organizacoes disponiveis:" -ForegroundColor Cyan

    for (
        $i = 0;
        $i -lt $organizations.Count;
        $i++
    ) {
        $organization =
            $organizations[$i]

        $organizationName =
            $organization.name

        if (-not $organizationName) {
            $organizationName =
                $organization.organizationName
        }

        if (-not $organizationName) {
            $organizationName =
                $organization.organizationId
        }

        if (-not $organizationName) {
            $organizationName =
                $organization.id
        }

        Write-Host "[$($i + 1)] $organizationName"
    }

    if ($organizations.Count -eq 1) {
        $selectedOrganization =
            $organizations[0]

        Write-Host ""
        Write-Host "Organizacao selecionada automaticamente." -ForegroundColor Green
    }
    else {
        Write-Host ""

        do {
            $selection =
                Read-Host "Escolha a organizacao"

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

    $organizationId =
        $selectedOrganization.id

    if (-not $organizationId) {
        $organizationId =
            $selectedOrganization.organizationId
    }

    if (-not $organizationId) {
        throw "Nao foi possivel identificar organizationId."
    }

    # ---------------------------------------------------------
    # 3. SELECIONAR ORGANIZACAO
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[3/10] Selecionando organizacao..." -ForegroundColor Yellow

    $organizationBody = @{
        organizationId = $organizationId
    } | ConvertTo-Json

    $organizationResponse =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/auth/select-organization" `
            -Method Post `
            -Headers $initialHeaders `
            -ContentType "application/json" `
            -Body $organizationBody

    $contextualizedAccessToken =
        $organizationResponse.accessToken

    if (-not $contextualizedAccessToken) {
        throw "A API nao retornou accessToken contextualizado."
    }

    $contextualizedHeaders = @{
        Authorization = "Bearer $contextualizedAccessToken"
    }

    Write-Host "OK - Contexto da organizacao ativo." -ForegroundColor Green

    # ---------------------------------------------------------
    # 4. CRIAR EXAME
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[4/10] Criando exame laboratorial..." -ForegroundColor Yellow

    $today =
        Get-Date -Format "yyyy-MM-dd"

    $examBody = @{
        name           = "Painel metabolico - smoke test"
        laboratoryName = "Laboratorio Higeia Teste"
        collectedAt    = $today
        resultedAt     = $today
        notes          = "Registro criado automaticamente pelo smoke test."
    } | ConvertTo-Json

    $createdExam =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams" `
            -Method Post `
            -Headers $contextualizedHeaders `
            -ContentType "application/json" `
            -Body $examBody

    $createdExamId =
        $createdExam.id

    if (-not $createdExamId) {
        throw "Exame criado sem ID."
    }

    Write-Host "OK - Exame criado." -ForegroundColor Green
    Write-Host "Exam ID: $createdExamId" -ForegroundColor DarkGray

    # ---------------------------------------------------------
    # 5. LISTAR EXAMES
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[5/10] Listando exames..." -ForegroundColor Yellow

    $examList =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams" `
            -Method Get `
            -Headers $contextualizedHeaders

    $examList = @($examList)

    $foundExam =
        $examList |
        Where-Object {
            $_.id -eq $createdExamId
        }

    if (-not $foundExam) {
        throw "O exame criado nao foi encontrado na listagem."
    }

    Write-Host "OK - Exame encontrado na listagem." -ForegroundColor Green

    # ---------------------------------------------------------
    # 6. CRIAR RESULTADO
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[6/10] Criando resultado laboratorial..." -ForegroundColor Yellow

    $resultBody = @{
        name           = "Glicose"
        value          = "92"
        unit           = "mg/dL"
        referenceRange = "70 - 99 mg/dL"
        interpretation = "NORMAL"
    } | ConvertTo-Json

    $createdResult =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId/results" `
            -Method Post `
            -Headers $contextualizedHeaders `
            -ContentType "application/json" `
            -Body $resultBody

    $createdResultId =
        $createdResult.id

    if (-not $createdResultId) {
        throw "Resultado criado sem ID."
    }

    Write-Host "OK - Resultado criado." -ForegroundColor Green
    Write-Host "Result ID: $createdResultId" -ForegroundColor DarkGray

    # ---------------------------------------------------------
    # 7. CONSULTAR EXAME COM RESULTADOS
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[7/10] Consultando exame com resultados..." -ForegroundColor Yellow

    $examWithResults =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId" `
            -Method Get `
            -Headers $contextualizedHeaders

    $returnedResults =
        @($examWithResults.results)

    $foundResult =
        $returnedResults |
        Where-Object {
            $_.id -eq $createdResultId
        }

    if (-not $foundResult) {
        throw "Resultado criado nao apareceu na consulta do exame."
    }

    Write-Host "OK - Resultado vinculado corretamente ao exame." -ForegroundColor Green

    # ---------------------------------------------------------
    # 8. ATUALIZAR RESULTADO
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[8/10] Atualizando resultado..." -ForegroundColor Yellow

    $updateResultBody = @{
        value          = "105"
        unit           = "mg/dL"
        referenceRange = "70 - 99 mg/dL"
        interpretation = "HIGH"
    } | ConvertTo-Json

    $updatedResult =
        Invoke-RestMethod `
            -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId/results/$createdResultId" `
            -Method Patch `
            -Headers $contextualizedHeaders `
            -ContentType "application/json" `
            -Body $updateResultBody

    if ($updatedResult.value -ne "105") {
        throw "O valor atualizado nao foi retornado corretamente."
    }

    if ($updatedResult.interpretation -ne "HIGH") {
        throw "A interpretacao atualizada nao foi retornada corretamente."
    }

    Write-Host "OK - Resultado atualizado." -ForegroundColor Green

    # ---------------------------------------------------------
    # 9. EXCLUIR RESULTADO
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[9/10] Excluindo resultado..." -ForegroundColor Yellow

    Invoke-RestMethod `
        -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId/results/$createdResultId" `
        -Method Delete `
        -Headers $contextualizedHeaders

    $createdResultId = $null

    Write-Host "OK - Resultado excluido." -ForegroundColor Green

    # ---------------------------------------------------------
    # 10. EXCLUIR EXAME
    # ---------------------------------------------------------

    Write-Host ""
    Write-Host "[10/10] Excluindo exame..." -ForegroundColor Yellow

    Invoke-RestMethod `
        -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId" `
        -Method Delete `
        -Headers $contextualizedHeaders

    $createdExamId = $null

    Write-Host "OK - Exame excluido." -ForegroundColor Green

    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host " LABORATORY EXAMS SMOKE TEST: PASSOU" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Red
    Write-Host " LABORATORY EXAMS SMOKE TEST: FALHOU" -ForegroundColor Red
    Write-Host "==============================================" -ForegroundColor Red
    Write-Host ""

    Write-Host $_.Exception.Message -ForegroundColor Red

    if (
        $_.ErrorDetails -and
        $_.ErrorDetails.Message
    ) {
        Write-Host ""
        Write-Host "Resposta da API:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }

    Write-Host ""

    # ---------------------------------------------------------
    # LIMPEZA DE SEGURANCA
    # ---------------------------------------------------------

    if (
        $contextualizedHeaders -and
        $createdResultId
    ) {
        try {
            Invoke-RestMethod `
                -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId/results/$createdResultId" `
                -Method Delete `
                -Headers $contextualizedHeaders

            Write-Host "Cleanup: resultado removido." -ForegroundColor DarkGray
        }
        catch {
            Write-Host "Cleanup: nao foi possivel remover o resultado." -ForegroundColor DarkYellow
        }
    }

    if (
        $contextualizedHeaders -and
        $createdExamId
    ) {
        try {
            Invoke-RestMethod `
                -Uri "$ApiBaseUrl/patients/$PatientId/medical-record/laboratory-exams/$createdExamId" `
                -Method Delete `
                -Headers $contextualizedHeaders

            Write-Host "Cleanup: exame removido." -ForegroundColor DarkGray
        }
        catch {
            Write-Host "Cleanup: nao foi possivel remover o exame." -ForegroundColor DarkYellow
        }
    }

    exit 1
}