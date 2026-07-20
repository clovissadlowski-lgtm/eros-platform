# Higeia — Pull Request Checklist

## Objetivo

Use este checklist em toda Pull Request.

### Produto

- [ ] O problema e o usuário estão claros.
- [ ] Os critérios de aceite foram atendidos.
- [ ] O escopo não cresceu sem registro.

### Código

- [ ] O código está legível.
- [ ] Não há código morto.
- [ ] Não há duplicação desnecessária.
- [ ] Os tipos estão corretos.
- [ ] As entradas são validadas.

### Testes

- [ ] Testes relevantes foram adicionados.
- [ ] Testes existentes continuam aprovados.
- [ ] Fluxos críticos foram verificados.

### Segurança e privacidade

- [ ] Autenticação e autorização foram avaliadas.
- [ ] Nenhum segredo foi versionado.
- [ ] Dados pessoais foram minimizados.
- [ ] Logs não expõem dados sensíveis.
- [ ] Riscos de IA foram avaliados quando aplicável.

### Banco e infraestrutura

- [ ] Migration foi criada quando necessária.
- [ ] Rollback foi considerado.
- [ ] Variáveis de ambiente foram documentadas.
- [ ] Impacto em custos foi avaliado.

### Operação

- [ ] Logs foram adicionados.
- [ ] Métricas foram avaliadas.
- [ ] Alertas foram considerados.
- [ ] Correlation ID está disponível quando necessário.

### Documentação

- [ ] README ou especificação foi atualizada.
- [ ] ADR foi criado quando necessário.
- [ ] Changelog foi atualizado quando aplicável.

### Liberação

- [ ] Staging foi testado.
- [ ] Rollback está disponível.
- [ ] Não existem bloqueadores conhecidos.
