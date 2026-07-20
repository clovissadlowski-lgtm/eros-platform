# Higeia — Testing Strategy

**Documento:** Higeia Testing Strategy  
**Versão:** 0.1  
**Status:** Estratégia oficial inicial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia será testado antes, durante e depois de cada entrega.

Esta estratégia cobre:

- produto;
- aplicação web;
- APIs;
- banco de dados;
- autenticação;
- segurança;
- privacidade;
- LGPD;
- inteligência artificial;
- memória;
- dados derivados;
- acessibilidade;
- desempenho;
- infraestrutura;
- exclusão de conta;
- recuperação de falhas;
- experiência do usuário.

---

## 2. Princípio central

Uma funcionalidade não é considerada pronta porque “funciona na máquina do desenvolvedor”.

Ela só é considerada pronta quando:

- atende ao requisito;
- possui testes adequados;
- não quebra fluxos existentes;
- protege dados;
- registra falhas;
- permite rollback;
- foi validada em ambiente apropriado.

---

## 3. Objetivos da qualidade

O Higeia deverá buscar:

1. confiabilidade;
2. previsibilidade;
3. segurança;
4. privacidade;
5. acessibilidade;
6. rastreabilidade;
7. recuperação;
8. explicabilidade;
9. estabilidade;
10. confiança do usuário.

---

## 4. Pirâmide de testes

### Testes unitários

Testam regras isoladas.

Exemplos:

- cálculo de progresso;
- validação de respostas;
- transformação de dados;
- regras de retenção;
- classificação de estados;
- geração de identificadores;
- autorização por papel.

### Testes de integração

Testam a interação entre componentes.

Exemplos:

- API e banco;
- autenticação e sessão;
- fila e worker;
- aplicação e storage;
- IA e schema de saída;
- exclusão e fornecedores.

### Testes end-to-end

Testam a jornada completa do usuário.

Exemplos:

- criar conta;
- aceitar consentimentos;
- preencher anamnese;
- salvar progresso;
- gerar perfil;
- fazer check-in;
- solicitar exclusão.

### Testes manuais exploratórios

Buscam problemas não previstos pelos testes automatizados.

---

## 5. Tipos de teste

O Higeia deverá utilizar:

- unitários;
- integração;
- end-to-end;
- contrato;
- regressão;
- smoke;
- segurança;
- privacidade;
- acessibilidade;
- desempenho;
- carga;
- recuperação;
- banco de dados;
- migração;
- observabilidade;
- IA;
- usabilidade;
- compatibilidade.

---

## 6. Ambientes

### Local

Usado para desenvolvimento individual.

### Development

Usado para integração frequente.

### Staging

Deve reproduzir o comportamento de produção sem usar dados reais.

### Production

Usado apenas após aprovação dos gates.

### Regra

Nenhum teste destrutivo deve ser executado em produção.

---

## 7. Dados de teste

Os dados devem ser:

- fictícios;
- reproduzíveis;
- separados por ambiente;
- claramente identificados;
- apropriados ao cenário;
- livres de dados pessoais reais.

### Proibido

- copiar banco de produção para desenvolvimento;
- usar prontuários reais;
- inserir documentos reais;
- usar credenciais reais em testes;
- colocar dados sensíveis em fixtures públicas.

---

## 8. Estrutura recomendada

```text
tests/
├── unit/
├── integration/
├── e2e/
├── contract/
├── security/
├── accessibility/
├── ai/
├── fixtures/
└── helpers/
```

Testes próximos ao código também poderão ser usados:

```text
feature-name.test.ts
component-name.test.tsx
```

---

## 9. Convenção de nomes

Formato:

```text
<arquivo>.test.ts
<arquivo>.spec.ts
```

Descrição recomendada:

```ts
describe("Assessment progress", () => {
  it("restores the last completed section", () => {
    // ...
  });
});
```

O nome deve descrever comportamento, não implementação interna.

---

## 10. Testes unitários obrigatórios

Devem existir para:

- validações;
- funções puras;
- regras de negócio;
- transformações;
- cálculos;
- estados;
- permissões;
- retenção;
- seleção de contexto para IA;
- classificação de risco;
- schemas;
- serializers.

---

## 11. Testes de integração obrigatórios

Devem existir para:

- criação e leitura no banco;
- autenticação;
- autorização;
- sessões;
- filas;
- storage;
- e-mail;
- webhooks;
- provedor de IA;
- migrations;
- exclusão;
- logs;
- analytics.

---

## 12. Fluxos end-to-end obrigatórios

### Identidade

- cadastro;
- login;
- logout;
- verificação;
- recuperação de senha;
- expiração de sessão.

### Consentimento

- leitura;
- aceite;
- rejeição;
- registro de versão;
- revogação quando aplicável.

### Anamnese

- iniciar;
- responder;
- voltar;
- salvar;
- continuar depois;
- validação;
- conclusão;
- erro de conexão;
- recuperação.

### Perfil

- geração;
- carregamento;
- falha;
- retry;
- feedback;
- atualização;
- versionamento.

### Check-in

- abertura;
- preenchimento;
- envio;
- evolução;
- histórico;
- erro;
- duplicidade.

### Segurança

- acesso indevido;
- sessão inválida;
- usuário tentando acessar dados de outro usuário;
- rate limit;
- input malicioso.

### Privacidade

- acesso;
- correção;
- exportação futura;
- exclusão;
- revogação;
- bloqueio.

---

## 13. Testes de autenticação

Verificar:

- senha inválida;
- usuário inexistente;
- e-mail duplicado;
- token expirado;
- sessão revogada;
- múltiplas sessões;
- brute force;
- recuperação;
- MFA administrativo;
- logout global quando aplicável.

---

## 14. Testes de autorização

Cada recurso deve verificar ownership e papel.

Casos:

- usuário acessando seu próprio dado;
- usuário acessando dado alheio;
- administrador com acesso permitido;
- administrador sem necessidade;
- serviço interno;
- objeto inexistente;
- ID manipulado;
- rota direta;
- chamada de API manual.

---

## 15. Testes de banco de dados

Verificar:

- constraints;
- chaves;
- relações;
- cascade;
- soft delete quando aplicável;
- migrations;
- rollback;
- índices;
- transações;
- concorrência;
- idempotência;
- consistência.

---

## 16. Testes de migrations

Toda migration deve possuir:

- aplicação em banco vazio;
- aplicação em banco com dados fictícios;
- compatibilidade;
- teste de rollback quando possível;
- verificação de perda de dados;
- revisão de índices;
- revisão de permissões.

---

## 17. Testes de APIs

Verificar:

- schema;
- autenticação;
- autorização;
- status codes;
- erros;
- paginação;
- idempotência;
- rate limit;
- timeout;
- conteúdo inesperado;
- correlation ID;
- versionamento.

---

## 18. Testes de filas e jobs

Verificar:

- execução normal;
- retry;
- backoff;
- timeout;
- duplicidade;
- falha parcial;
- idempotência;
- dead-letter;
- cancelamento;
- observabilidade;
- reprocessamento.

---

## 19. Testes de arquivos

Verificar:

- tipo;
- tamanho;
- conteúdo;
- nome;
- upload interrompido;
- malware quando aplicável;
- acesso;
- autorização;
- URL expirada;
- exclusão;
- versão;
- preview;
- cache.

---

## 20. Testes de segurança

Categorias:

- autenticação;
- autorização;
- injeção;
- XSS;
- CSRF;
- SSRF;
- open redirect;
- upload;
- secrets;
- sessão;
- dependências;
- rate limiting;
- enumeração;
- headers;
- configuração;
- prompt injection.

---

## 21. Testes de privacidade

Verificar:

- minimização;
- coleta opcional;
- consentimento;
- versão do consentimento;
- revogação;
- acesso;
- correção;
- exclusão;
- dados derivados;
- fornecedores;
- logs;
- backup;
- analytics;
- exportação futura.

---

## 22. Testes de exclusão

A exclusão deverá abranger:

- conta;
- perfil;
- respostas;
- sinais;
- eventos;
- estados;
- memórias;
- hipóteses;
- evidências;
- check-ins;
- conversas;
- arquivos;
- embeddings futuros;
- cache;
- sessões;
- fornecedores;
- analytics identificáveis.

### Critério

Depois da exclusão:

- o usuário não autentica;
- seus dados não aparecem;
- jobs não recriam dados;
- restauração não reativa dados excluídos;
- auditoria permanece sem conteúdo sensível.

---

## 23. Testes de retenção

Verificar:

- expiração automática;
- mudança de estado;
- bloqueio;
- arquivamento;
- anonimização;
- exclusão;
- legal hold;
- backup;
- fornecedor;
- idempotência.

---

## 24. Testes de inteligência artificial

Cada fluxo de IA deve avaliar:

- schema;
- factualidade;
- relevância;
- coerência;
- incerteza;
- limites;
- segurança;
- consistência;
- regressão;
- latência;
- custo;
- idioma;
- recuperação de falha.

---

## 25. Dataset de avaliação de IA

Deve conter casos:

- comuns;
- raros;
- ambíguos;
- incompletos;
- conflitantes;
- sensíveis;
- adversariais;
- de crise;
- fora de escopo;
- com erros do usuário.

Cada caso deve possuir:

- entrada;
- contexto;
- comportamento esperado;
- comportamento proibido;
- critérios;
- severidade;
- versão.

---

## 26. Testes de segurança da IA

Verificar:

- prompt injection;
- jailbreak;
- instrução conflitante;
- pedido de diagnóstico;
- pedido de prescrição;
- crise;
- transtorno alimentar;
- autolesão;
- dados de outro usuário;
- vazamento de prompt;
- vazamento de memória;
- conteúdo discriminatório;
- excesso de confiança.

---

## 27. Testes de memória

Verificar:

- criação;
- atualização;
- conflito;
- expiração;
- provenance;
- confiança;
- correção;
- exclusão;
- temporalidade;
- isolamento entre usuários;
- seleção de contexto;
- não reutilização indevida.

---

## 28. Testes de acessibilidade

Verificar:

- teclado;
- ordem de foco;
- foco visível;
- labels;
- mensagens de erro;
- headings;
- landmarks;
- contraste;
- zoom;
- leitor de tela;
- reduced motion;
- conteúdo dinâmico.

### Regra

Fluxos críticos devem ser utilizáveis sem mouse.

---

## 29. Testes de usabilidade

Avaliar:

- compreensão;
- tempo;
- abandono;
- erros;
- dúvidas;
- confiança;
- esforço;
- percepção de julgamento;
- clareza das explicações;
- facilidade de correção.

---

## 30. Testes de desempenho

Medir:

- carregamento;
- resposta de API;
- consultas;
- geração de perfil;
- processamento de check-in;
- filas;
- upload;
- consumo;
- custo.

### Regra

Otimizar somente depois de medir.

---

## 31. Testes de carga

Antes de crescimento relevante, avaliar:

- usuários simultâneos;
- picos;
- filas;
- banco;
- rate limits;
- provedor de IA;
- storage;
- degradação;
- recuperação.

---

## 32. Testes de resiliência

Simular:

- banco indisponível;
- provedor de IA indisponível;
- fila parada;
- storage indisponível;
- timeout;
- e-mail falhando;
- conexão interrompida;
- deploy com erro;
- migration parcial.

---

## 33. Testes de observabilidade

Verificar:

- logs;
- métricas;
- traces;
- correlation IDs;
- alertas;
- dashboards;
- redaction;
- classificação;
- diagnóstico.

### Critério

Uma falha crítica deve ser detectável sem depender de reclamação do usuário.

---

## 34. Testes de compatibilidade

Inicialmente:

- Chrome;
- Edge;
- Firefox;
- Safari;
- Android;
- iOS;
- desktop;
- tablet;
- celular.

Prioridade deve seguir analytics reais quando disponíveis.

---

## 35. Smoke tests

Após cada deploy, testar:

- aplicação abre;
- login funciona;
- banco responde;
- rota crítica responde;
- anamnese abre;
- API principal funciona;
- logs estão ativos;
- nenhum erro crítico aparece.

---

## 36. Testes de regressão

Devem rodar:

- em Pull Requests;
- antes de release;
- após mudanças em IA;
- após migrations;
- após atualização de dependências;
- após incidente;
- após correção crítica.

---

## 37. Gates de Pull Request

Uma PR não pode ser aceita se houver:

- build quebrado;
- lint falhando;
- typecheck falhando;
- teste crítico falhando;
- vulnerabilidade crítica;
- migração insegura;
- vazamento de segredo;
- autorização ausente;
- alteração de IA sem avaliação;
- alteração de dados sem revisão.

---

## 38. Gates de staging

Antes de staging:

- testes automáticos aprovados;
- migrations aplicadas;
- variáveis configuradas;
- seeds fictícios;
- logs ativos;
- smoke test;
- rollback preparado.

---

## 39. Gates de produção

Antes de produção:

- PR aprovada;
- CI aprovado;
- staging validado;
- regressão aprovada;
- segurança revisada;
- privacidade revisada;
- migrations revisadas;
- rollback disponível;
- monitoramento ativo;
- release notes prontas;
- responsável definido.

---

## 40. Critérios para Alpha fechado

O Alpha só poderá iniciar quando:

- cadastro estiver estável;
- consentimentos funcionarem;
- anamnese salvar progresso;
- perfil for gerado com validação;
- autorização estiver testada;
- exclusão estiver testada;
- incident response estiver definido;
- logs estiverem redigidos;
- IA passar nos casos críticos;
- acessibilidade mínima estiver validada;
- backup e restauração estiverem testados;
- revisão jurídica estiver concluída.

---

## 41. Cobertura

Cobertura de código é um indicador, não objetivo isolado.

Prioridades:

1. regras críticas;
2. autorização;
3. dados;
4. segurança;
5. IA;
6. exclusão;
7. retenção;
8. jornadas principais.

Evitar testes criados apenas para aumentar porcentagem.

---

## 42. Severidade de falhas

### P0

Risco grave, vazamento ou indisponibilidade total.

### P1

Fluxo crítico quebrado ou risco elevado.

### P2

Função importante comprometida com alternativa limitada.

### P3

Problema moderado.

### P4

Melhoria ou problema cosmético.

---

## 43. Gestão de defeitos

Cada defeito deve registrar:

- título;
- ambiente;
- versão;
- passos;
- esperado;
- observado;
- evidência;
- severidade;
- impacto;
- responsável;
- status;
- regressão associada.

---

## 44. Ferramentas iniciais recomendadas

Para stack Next.js e TypeScript:

- Vitest;
- React Testing Library;
- Playwright;
- Zod;
- axe-core;
- ESLint;
- TypeScript;
- ferramentas de scan de dependência;
- testes nativos do provedor de banco.

A escolha final deve ser registrada em ADR.

---

## 45. Execução no CI

Pipeline inicial:

1. install;
2. lint;
3. typecheck;
4. unit;
5. integration;
6. security scan;
7. build;
8. E2E selecionado;
9. relatório.

---

## 46. Responsabilidades

### Desenvolvedor

Criar e manter testes da alteração.

### Revisor

Verificar risco e cobertura adequada.

### Produto

Validar critérios de aceite.

### Segurança

Revisar controles e cenários adversariais.

### IA

Manter datasets e avaliações.

### Fundador

Aprovar gates e prioridades sem dispensar testes críticos.

---

## 47. Uso de IA para criar testes

IA pode ajudar a:

- gerar cenários;
- sugerir bordas;
- criar fixtures;
- revisar cobertura;
- produzir rascunhos.

Mas os testes devem ser:

- compreendidos;
- revisados;
- executados;
- mantidos;
- relacionados a riscos reais.

---

## 48. Definition of Tested

Uma funcionalidade está testada quando:

- comportamento esperado está coberto;
- principais falhas estão cobertas;
- riscos estão cobertos;
- testes passam;
- testes são confiáveis;
- ambiente é adequado;
- evidência está disponível;
- regressão foi considerada.

---

## 49. Questões abertas

1. Ferramentas finais.
2. Meta de cobertura.
3. Frequência de E2E completo.
4. Testes de carga.
5. Browser matrix inicial.
6. Ambiente de avaliação de IA.
7. Processo de pentest.
8. Processo de testes com usuários.
9. Estratégia de mocks.
10. Gestão de dados de teste.

---

## 50. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da estratégia oficial inicial de testes. |
