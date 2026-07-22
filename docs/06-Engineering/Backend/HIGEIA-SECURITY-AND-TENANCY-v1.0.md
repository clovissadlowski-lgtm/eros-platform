# Higeia Security and Tenancy v1.0

**Status:** Baseline aprovada  
**Escopo:** Backend, dados, IA, storage e multi-tenancy  
**Versão:** 1.0

## 1. Finalidade

Este documento define princípios e controles iniciais para proteger:

- pacientes;
- profissionais;
- organizações;
- dados pessoais;
- dados de saúde;
- credenciais;
- uploads;
- integrações;
- saídas de IA;
- fronteiras entre tenants.

Ele não substitui avaliação jurídica, DPO, segurança especializada ou revisão clínica.

## 2. Princípios

1. Negar por padrão.
2. Menor privilégio.
3. Minimização de dados.
4. Isolamento entre organizações.
5. Rastreabilidade.
6. Segurança por camadas.
7. Segredos fora do código.
8. Dados sensíveis fora de logs.
9. Provedor externo tratado como fronteira de risco.
10. Consentimento e finalidade explícitos.
11. Histórico preservado quando exigido.
12. Exclusão e retenção controladas.

## 3. Classificação de dados

### Público

Exemplo:

- conteúdo institucional.

### Interno

Exemplo:

- documentação técnica não sensível;
- métricas agregadas.

### Confidencial

Exemplo:

- contratos;
- dados comerciais;
- configuração interna.

### Sensível

Exemplo:

- identidade do paciente;
- exames;
- sintomas;
- medicamentos;
- fotos;
- anamnese;
- planos;
- notas profissionais;
- dados enviados à IA.

Dados de saúde devem ser tratados como sensíveis.

## 4. Tenant

A organização é a fronteira de negócio.

O tenant técnico inicial é `organizationId`.

Todo recurso pertencente a organização deve conter ou derivar essa referência.

## 5. Regra de consulta

Nunca consultar apenas por ID.

Usar conceitualmente:

```text
id = requestedId
AND
organizationId = authenticatedOrganizationId
```

Repositórios devem tornar essa regra difícil de esquecer.

## 6. Origem do tenant

O tenant deve vir de:

- token validado;
- membership validada;
- contexto autenticado do backend.

Não confiar em:

- body;
- query;
- header arbitrário do cliente;
- parâmetro enviado sem validação.

Para usuário com várias organizações, será criado mecanismo explícito de seleção.

## 7. Autenticação

Direção inicial: Amazon Cognito.

Requisitos:

- validar assinatura;
- validar issuer;
- validar audience;
- validar expiração;
- rejeitar token inválido;
- não registrar token;
- aplicar rotação e configuração segura;
- usar HTTPS.

## 8. Autorização

Autorização deve considerar:

- identidade;
- organização;
- membership;
- papel;
- permissão;
- propriedade do recurso;
- estado do recurso;
- categoria profissional quando necessário.

Não basta verificar papel global.

## 9. Dados sensíveis em resposta

Retornar apenas o necessário.

Evitar:

- entidade completa por conveniência;
- notas internas em endpoint de paciente;
- metadados de provedor;
- campos de auditoria;
- identificadores secretos;
- consentimentos fora do contexto.

Usar DTO de resposta quando necessário.

## 10. Logs

Nunca registrar por padrão:

- senha;
- token;
- cookie;
- chave de API;
- anamnese completa;
- exames;
- foto;
- medicamento;
- prompt completo com PII;
- resposta completa de IA sensível.

Logs devem usar identificadores e metadados mínimos.

## 11. Segredos

- nunca versionar;
- usar `.env` apenas local;
- produção usa secret store;
- rotacionar;
- limitar acesso;
- separar ambiente;
- não reutilizar credencial;
- não colocar segredo em imagem Docker;
- não enviar segredo em ticket ou screenshot.

## 12. Criptografia

### Em trânsito

- HTTPS/TLS;
- conexão segura com banco;
- conexão segura com provedores;
- bloquear protocolo inseguro em produção.

### Em repouso

- criptografia do banco;
- criptografia de objetos S3;
- backups criptografados;
- chaves gerenciadas;
- avaliação de campos com criptografia adicional quando necessário.

## 13. Uploads

Uploads são não confiáveis.

Controles:

- tamanho máximo;
- tipo permitido;
- validação real de conteúdo;
- nome gerado;
- storage privado;
- URL temporária;
- antivírus ou scanning quando aplicável;
- autorização por tenant;
- metadados mínimos;
- proibição de execução.

## 14. Consentimentos

Consentimento deve registrar:

- paciente;
- finalidade;
- texto/version;
- data;
- canal;
- status;
- revogação;
- evidência.

Consentimento não substitui base legal aplicável. Avaliação jurídica é necessária.

## 15. Auditoria

Eventos relevantes:

- acesso a dado sensível;
- criação ou alteração de paciente;
- visualização de avaliação;
- upload;
- geração de IA;
- revisão profissional;
- mudança de consentimento;
- exportação;
- exclusão;
- alteração de permissão.

Audit log não é o mesmo que log operacional.

## 16. IA e dados sensíveis

Antes de enviar dado a provedor:

- confirmar finalidade;
- confirmar base legal/consentimento aplicável;
- minimizar;
- anonimizar ou pseudonimizar quando possível;
- remover campos não necessários;
- registrar provedor, modelo e prompt;
- aplicar timeout;
- controlar retenção;
- revisar contrato do provedor;
- impedir uso indevido para treinamento quando contratualmente possível.

A IA não deve receber acesso irrestrito ao banco.

## 17. Professional Review

Saída de IA deve permanecer em estado de revisão quando houver impacto clínico ou profissional.

A publicação deve registrar:

- revisor;
- data;
- decisão;
- versão;
- alterações;
- origem da análise.

## 18. Exclusão e retenção

Exclusão não deve ser implementada como simples `DELETE` sem política.

Avaliar:

- obrigação legal;
- retenção clínica;
- auditoria;
- consentimento;
- backups;
- anonimização;
- soft delete;
- hard delete;
- prazo de execução;
- prova da conclusão.

## 19. Exportação

Exportação de dados deve:

- autenticar;
- autorizar;
- registrar;
- limitar escopo;
- proteger arquivo;
- expirar link;
- evitar tenant cruzado;
- informar formato;
- permitir acompanhamento.

## 20. Ambientes

Separar:

- development;
- test;
- staging;
- production.

Não usar dado real em development/test.

Credenciais e bancos devem ser separados.

## 21. Dependências

- usar lockfile;
- revisar vulnerabilidades;
- atualizar dependências;
- evitar pacote abandonado;
- restringir scripts de build;
- revisar licença;
- usar fontes confiáveis;
- não ignorar alerta crítico sem decisão.

## 22. Segurança no CI/CD

- secrets protegidos;
- princípio de menor privilégio;
- branch protection;
- revisão;
- scans;
- artefatos assinados quando aplicável;
- logs sem segredo;
- deploy rastreável;
- rollback.

## 23. Incidentes

Em incidente:

1. conter;
2. preservar evidência;
3. identificar escopo;
4. revogar/rotacionar;
5. corrigir;
6. avaliar obrigação de comunicação;
7. registrar;
8. prevenir recorrência.

Plano formal será criado antes de produção.

## 24. Testes obrigatórios

- acesso sem token;
- token inválido;
- papel sem permissão;
- tenant A não acessa B;
- ID válido de outro tenant retorna resposta segura;
- payload extra é rejeitado;
- upload inválido é rejeitado;
- segredo não aparece em log;
- AI adapter minimiza contexto;
- exportação respeita tenant.

## 25. Checklist de feature

- quais dados são tratados?
- qual classificação?
- qual tenant?
- quem pode acessar?
- há consentimento?
- há auditoria?
- há upload?
- há IA?
- há retenção?
- há exportação?
- há segredo?
- há dado no log?
- teste de tenant existe?
- erro evita vazamento?
- revisão jurídica/clínica é necessária?
