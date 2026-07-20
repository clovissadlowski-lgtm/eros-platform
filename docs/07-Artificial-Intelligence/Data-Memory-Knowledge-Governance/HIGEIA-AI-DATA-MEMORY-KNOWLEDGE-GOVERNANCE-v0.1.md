# Higeia — AI Data, Memory and Knowledge Governance

**Documento:** Higeia AI Data, Memory and Knowledge Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia coletará, transformará, armazenará, recuperará, corrigirá, expirará e excluirá dados usados por funcionalidades de inteligência artificial.

Este framework cobre:

- contexto de execução;
- memória de curto e longo prazo;
- dados derivados;
- embeddings;
- documentos;
- bases de conhecimento;
- conteúdo clínico;
- proveniência;
- atualização;
- correção;
- expiração;
- confiança;
- isolamento;
- exclusão;
- auditoria.

---

## 2. Princípio central

A IA não deve tratar todo dado armazenado como verdadeiro, atual, autorizado ou apropriado para reutilização.

Todo dado usado para personalização deve possuir, quando aplicável:

- origem;
- titular;
- finalidade;
- data;
- versão;
- nível de confiança;
- sensibilidade;
- validade;
- possibilidade de correção;
- regra de expiração;
- regra de exclusão.

---

## 3. Escopo

Aplica-se a:

- dados declarados pelo usuário;
- dados medidos;
- respostas de anamnese;
- exames;
- receitas;
- documentos;
- check-ins;
- conversas;
- resumos;
- hipóteses;
- preferências;
- metas;
- memória;
- embeddings;
- perfis de inteligência;
- conhecimento clínico;
- fontes externas;
- feedback;
- correções;
- dados de profissionais.

---

## 4. Categorias de dados

### SOURCE-DATA

Dado original fornecido ou importado.

### NORMALIZED-DATA

Dado convertido para formato padronizado.

### DERIVED-DATA

Dado criado por regra, cálculo ou IA.

### MEMORY-DATA

Dado autorizado para reutilização futura.

### KNOWLEDGE-DATA

Conteúdo usado como referência geral.

### EVALUATION-DATA

Dado usado para testes e avaliação.

### TELEMETRY-DATA

Dado operacional e de observabilidade.

---

## 5. Origem dos dados

Possíveis origens:

- usuário;
- profissional;
- dispositivo;
- arquivo;
- integração;
- sistema;
- inferência;
- cálculo;
- modelo de IA;
- fonte pública;
- fonte licenciada.

A origem deve ser registrada sempre que influenciar decisões ou personalização.

---

## 6. Proveniência

Cada item relevante deve permitir responder:

- de onde veio;
- quando foi criado;
- quem forneceu;
- se foi alterado;
- se foi confirmado;
- qual processo o derivou;
- qual modelo participou;
- qual versão estava ativa;
- qual evidência o sustenta.

---

## 7. Tipos de verdade

### DECLARED

Declarado pelo usuário ou profissional.

### MEASURED

Obtido por medição.

### IMPORTED

Importado de documento ou integração.

### CALCULATED

Calculado por regra determinística.

### INFERRED

Inferido pela IA.

### CONFIRMED

Confirmado posteriormente por fonte autorizada.

### DISPUTED

Contestado.

### UNKNOWN

Sem origem ou confiança suficiente.

---

## 8. Confiança

Escala proposta:

- CONFIDENCE-HIGH;
- CONFIDENCE-MEDIUM;
- CONFIDENCE-LOW;
- CONFIDENCE-UNKNOWN.

Confiança não deve ser confundida com certeza clínica.

---

## 9. Sensibilidade

Classificação inicial:

- PUBLIC;
- INTERNAL;
- PERSONAL;
- SENSITIVE;
- HEALTH-SENSITIVE;
- RESTRICTED.

Dados de saúde devem receber controles reforçados.

---

## 10. Contexto de execução

O contexto enviado ao modelo deve ser:

- necessário;
- mínimo;
- atual;
- autorizado;
- relevante;
- isolado por usuário;
- compatível com a finalidade;
- limitado por tamanho;
- rastreável.

---

## 11. Montagem de contexto

O contexto deve priorizar:

1. instruções de sistema;
2. políticas de safety;
3. dados atuais confirmados;
4. dados recentes relevantes;
5. preferências autorizadas;
6. memória válida;
7. conhecimento aprovado;
8. hipóteses claramente marcadas.

---

## 12. Contexto proibido

Não incluir sem necessidade:

- dados de outro usuário;
- histórico integral;
- anexos completos;
- dados expirados;
- hipóteses tratadas como fatos;
- dados contestados;
- informações não relacionadas;
- segredos;
- credenciais;
- conteúdo não autorizado.

---

## 13. Memória de curto prazo

Usada durante uma sessão ou fluxo limitado.

Características:

- duração curta;
- finalidade definida;
- baixo acoplamento;
- expiração automática;
- sem reutilização permanente por padrão.

---

## 14. Memória de longo prazo

Somente deve armazenar informações com utilidade futura clara.

Exemplos possíveis:

- preferências;
- restrições;
- objetivos;
- padrões confirmados;
- dados estáveis autorizados;
- contexto longitudinal relevante.

---

## 15. Critérios para memorizar

Memorizar somente quando:

- houver finalidade;
- houver benefício;
- o dado for necessário;
- a informação estiver suficientemente clara;
- o usuário puder corrigir;
- a retenção for definida;
- o risco for aceitável.

---

## 16. O que não memorizar

Evitar memorizar:

- conteúdo transitório;
- emoção momentânea sem necessidade;
- hipótese não confirmada;
- dado excessivamente íntimo;
- detalhe irrelevante;
- dado de terceiro;
- segredo;
- credencial;
- informação proibida;
- conteúdo sem consentimento ou base adequada.

---

## 17. Memória explícita versus implícita

### EXPLICIT

Usuário ou profissional autoriza diretamente.

### IMPLICIT

Sistema decide guardar com base em regra.

Para dados de saúde sensíveis, priorizar memória explícita e transparência.

---

## 18. Registro de memória

Cada memória deve conter:

- memory_id;
- subject_id pseudonimizado;
- category;
- value;
- source;
- created_at;
- updated_at;
- confidence;
- sensitivity;
- purpose;
- expires_at;
- status;
- correction history;
- deletion status.

---

## 19. Estados da memória

- proposed;
- active;
- confirmed;
- disputed;
- expired;
- superseded;
- blocked;
- deletion_pending;
- deleted.

---

## 20. Correção

O usuário deve poder:

- visualizar memória relevante;
- corrigir;
- contestar;
- solicitar exclusão;
- informar que está desatualizada.

A correção deve preservar trilha de auditoria sem manter conteúdo indevido além do necessário.

---

## 21. Contradições

Quando dois dados conflitarem:

- não escolher arbitrariamente;
- marcar conflito;
- reduzir confiança;
- pedir confirmação quando apropriado;
- priorizar fonte mais confiável;
- registrar decisão;
- evitar recomendação forte.

---

## 22. Atualidade

Dados sensíveis ao tempo devem possuir validade.

Exemplos:

- peso;
- medicação;
- sintomas;
- exames;
- gestação;
- condição clínica;
- metas;
- rotina.

---

## 23. Expiração

Toda categoria de memória deve ter regra de expiração.

Possíveis ações:

- renovar;
- confirmar;
- reduzir confiança;
- arquivar;
- excluir;
- manter somente histórico autorizado.

---

## 24. Dados derivados

Exemplos:

- resumos;
- tendências;
- classificações;
- scores;
- perfis;
- hipóteses;
- riscos;
- recomendações;
- embeddings.

Dados derivados não substituem o dado original.

---

## 25. Hipóteses

Toda hipótese deve registrar:

- hypothesis_id;
- fonte;
- evidência;
- confiança;
- data;
- modelo;
- versão;
- status;
- confirmação;
- contestação;
- expiração.

---

## 26. Perfil de Inteligência

O Perfil de Inteligência deverá:

- usar dados autorizados;
- diferenciar fatos e hipóteses;
- citar origem interna;
- indicar lacunas;
- registrar versão;
- permitir correção;
- expirar componentes temporais;
- não assumir diagnóstico.

---

## 27. Embeddings

Embeddings são dados derivados e podem preservar relações sensíveis.

Regras:

- isolar por tenant e usuário;
- não compartilhar índice;
- controlar namespace;
- limitar metadados;
- definir retenção;
- permitir exclusão;
- rastrear origem;
- validar filtros;
- testar vazamento cruzado.

---

## 28. Vector database

A base vetorial deve possuir:

- segregação;
- controle de acesso;
- filtros obrigatórios;
- versionamento;
- logs;
- exclusão;
- backup;
- monitoramento;
- teste de isolamento;
- plano de migração.

---

## 29. Documentos carregados

Cada documento deve registrar:

- document_id;
- owner;
- origem;
- tipo;
- data;
- checksum;
- sensibilidade;
- finalidade;
- status;
- retenção;
- processamento;
- extrações;
- embeddings;
- exclusão.

---

## 30. Processamento documental

Etapas possíveis:

1. upload;
2. validação;
3. antivírus;
4. classificação;
5. extração;
6. redaction;
7. normalização;
8. fragmentação;
9. embedding;
10. indexação;
11. uso;
12. expiração;
13. exclusão.

---

## 31. Conhecimento clínico

O conhecimento clínico deve:

- vir de fontes aprovadas;
- possuir versão;
- possuir data;
- possuir owner;
- possuir revisão;
- indicar escopo;
- indicar limitações;
- possuir política de atualização.

---

## 32. Fontes de conhecimento

Classificar fontes como:

- authoritative;
- professional_guideline;
- peer_reviewed;
- institutional;
- educational;
- internal_reviewed;
- unverified;
- prohibited.

Fontes `unverified` não devem sustentar comportamento clínico de alto risco.

---

## 33. Registro de fontes

Cada fonte deve conter:

- source_id;
- título;
- instituição;
- autor;
- data;
- versão;
- URL ou localização;
- licença;
- domínio;
- validade;
- revisão;
- status;
- última verificação.

---

## 34. Conhecimento desatualizado

Quando uma fonte expirar ou for substituída:

- marcar como superseded;
- remover do uso ativo;
- identificar fluxos afetados;
- reavaliar prompts;
- reavaliar datasets;
- registrar mudança.

---

## 35. Retrieval-Augmented Generation

RAG deve possuir:

- coleção aprovada;
- filtros;
- ranking;
- threshold;
- citações;
- fallback;
- validação;
- versionamento;
- avaliação;
- monitoramento.

---

## 36. Groundedness

A resposta deve distinguir:

- conteúdo sustentado pela fonte;
- inferência;
- opinião geral;
- ausência de evidência.

A IA não deve inventar referência.

---

## 37. Citações

Quando houver citação:

- a fonte deve existir;
- o trecho deve sustentar a afirmação;
- a versão deve ser rastreável;
- a fonte deve estar ativa;
- o usuário deve poder entender sua origem.

---

## 38. Isolamento entre usuários

Controles obrigatórios:

- tenant_id;
- subject_id;
- filtros no servidor;
- autorização;
- namespace;
- testes negativos;
- logs;
- monitoramento;
- proibição de filtro apenas no cliente.

---

## 39. Testes de isolamento

Testar:

- usuário A não recupera dado de B;
- busca vetorial respeita escopo;
- cache não mistura usuários;
- logs não expõem conteúdo;
- exportação respeita titular;
- exclusão remove derivados;
- fallback não perde filtros.

---

## 40. Cache

Cache deve considerar:

- chave por usuário;
- sensibilidade;
- TTL;
- invalidação;
- criptografia;
- isolamento;
- exclusão;
- observabilidade.

Não usar cache compartilhado para conteúdo sensível sem segregação adequada.

---

## 41. Exclusão

Ao excluir dado original, avaliar e excluir:

- memória;
- resumo;
- embeddings;
- cache;
- hipóteses;
- índices;
- arquivos;
- derivados;
- cópias temporárias;
- fornecedor.

---

## 42. Direito de correção

Correções devem propagar para:

- perfil;
- memória;
- resumos;
- embeddings;
- recomendações futuras;
- datasets, se aplicável;
- relatórios.

---

## 43. Dados de terceiros

Dados sobre terceiros devem ser:

- minimizados;
- evitados;
- classificados;
- protegidos;
- excluídos quando não necessários;
- não memorizados por padrão.

---

## 44. Dados para treinamento interno

Antes de reutilizar dados reais:

- definir finalidade;
- avaliar base;
- minimizar;
- anonimizar quando possível;
- obter aprovação;
- controlar acesso;
- registrar dataset;
- permitir exclusão quando aplicável;
- impedir exportação não autorizada.

---

## 45. Dados sintéticos

Preferir dados sintéticos para:

- desenvolvimento;
- testes;
- demos;
- avaliação;
- treinamento inicial;
- documentação.

Dados sintéticos devem ser testados para evitar reidentificação ou cópia indevida.

---

## 46. Dataset governance

Cada dataset deve possuir:

- dataset_id;
- finalidade;
- owner;
- versão;
- origem;
- licença;
- sensibilidade;
- composição;
- limitações;
- retenção;
- aprovação;
- status.

---

## 47. Qualidade de dados

Dimensões:

- completude;
- consistência;
- atualidade;
- validade;
- unicidade;
- precisão;
- proveniência;
- representatividade.

---

## 48. Data quality flags

Exemplos:

- missing;
- stale;
- conflicting;
- unverified;
- malformed;
- duplicated;
- outlier;
- disputed;
- source_unknown.

---

## 49. Governança de schema

Schemas devem ser:

- versionados;
- validados;
- documentados;
- compatíveis;
- migráveis;
- testados;
- rastreáveis.

---

## 50. Auditoria

Deve ser possível responder:

- qual dado foi usado;
- de onde veio;
- qual memória entrou;
- qual fonte sustentou;
- qual versão estava ativa;
- qual transformação ocorreu;
- qual correção foi aplicada;
- qual exclusão foi executada.

---

## 51. Acesso

Acesso a memória e conhecimento deve ser:

- mínimo;
- baseado em função;
- auditado;
- separado por ambiente;
- revogado;
- revisado.

---

## 52. Incidentes

Incidentes incluem:

- vazamento cruzado;
- memória indevida;
- dado desatualizado com impacto;
- exclusão incompleta;
- fonte falsa;
- embedding não excluído;
- contexto excessivo;
- dado de terceiro;
- conhecimento desatualizado em produção.

---

## 53. Métricas

Monitorar:

- memory creation rate;
- memory correction rate;
- memory deletion rate;
- stale memory rate;
- conflict rate;
- retrieval accuracy;
- groundedness;
- citation failure;
- cross-user retrieval;
- embedding deletion success;
- source freshness;
- dataset incidents.

---

## 54. Gates antes do Alpha

- [ ] categorias definidas;
- [ ] memória de curto e longo prazo separadas;
- [ ] schema de memória aprovado;
- [ ] proveniência implementada;
- [ ] expiração definida;
- [ ] correção disponível;
- [ ] exclusão propagada;
- [ ] embeddings isolados;
- [ ] teste cross-user aprovado;
- [ ] fontes registradas;
- [ ] conhecimento versionado;
- [ ] RAG avaliado;
- [ ] cache segregado;
- [ ] logs minimizados;
- [ ] datasets registrados.

---

## 55. Responsabilidades

### Product

Define utilidade e transparência.

### AI Owner

Define contexto, memória e retrieval.

### Engineering

Implementa isolamento, schemas e exclusão.

### Data Owner

Mantém qualidade e proveniência.

### Privacy

Valida finalidade, retenção e direitos.

### Safety

Valida impacto de hipóteses e memórias.

### Clinical Reviewer

Valida conhecimento clínico.

### Security

Valida acesso, segregação e proteção.

---

## 56. Questões abertas

1. Quais memórias entram no MVP?
2. Qual banco vetorial?
3. Qual TTL por categoria?
4. Como mostrar memória ao usuário?
5. Como tratar histórico?
6. Como versionar perfil?
7. Quais fontes clínicas?
8. Qual processo de atualização?
9. Como excluir embeddings?
10. Como tratar dados de terceiros?
11. Qual política de dataset?
12. Como medir groundedness?

---

## 57. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de dados, memória e conhecimento. |
