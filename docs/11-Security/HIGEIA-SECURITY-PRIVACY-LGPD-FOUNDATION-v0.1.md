# Higeia — Security, Privacy and LGPD Foundation

**Documento:** Higeia Security, Privacy and LGPD Foundation  
**Versão:** 0.1  
**Status:** Fundação preliminar para revisão jurídica e técnica  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Estabelecer a base inicial de segurança, privacidade e proteção de dados pessoais do Higeia.

Este documento orienta:

- produto;
- arquitetura;
- banco de dados;
- inteligência artificial;
- contratos;
- consentimentos;
- atendimento aos titulares;
- fornecedores;
- resposta a incidentes;
- testes com usuários;
- desenvolvimento da política de privacidade;
- preparação para conformidade com a LGPD.

Este documento não substitui revisão jurídica especializada.

---

## 2. Contexto

O Higeia poderá tratar informações relacionadas a:

- identidade;
- rotina;
- alimentação;
- sono;
- atividade física;
- medidas corporais;
- medicações declaradas;
- condições de saúde declaradas;
- sintomas;
- comportamento;
- histórico;
- interações com inteligência artificial.

Informações referentes à saúde são dados pessoais sensíveis e exigem tratamento proporcional ao risco.

---

## 3. Princípios fundamentais

O Higeia deverá aplicar, desde a concepção:

1. finalidade;
2. adequação;
3. necessidade;
4. livre acesso;
5. qualidade dos dados;
6. transparência;
7. segurança;
8. prevenção;
9. não discriminação;
10. responsabilização e prestação de contas.

### Regra prática

Nenhum dado será coletado apenas porque “pode ser útil no futuro”.

---

## 4. Papéis de tratamento

## Controlador

Pessoa jurídica que tomará as decisões principais sobre o tratamento dos dados pessoais.

Na fase atual, o controlador definitivo deverá ser identificado após a constituição jurídica da empresa responsável pelo Higeia.

## Operador

Fornecedor que tratar dados em nome do controlador.

Exemplos possíveis:

- hospedagem;
- banco de dados;
- autenticação;
- provedor de IA;
- e-mail;
- monitoramento;
- suporte.

## Encarregado

Canal entre controlador, titulares e ANPD, conforme aplicabilidade e estrutura jurídica futura.

## Titular

Pessoa natural a quem os dados se referem.

---

## 5. Categorias de dados

### Dados cadastrais

- nome;
- e-mail;
- data de nascimento;
- credenciais;
- preferências de comunicação.

### Dados de contexto

- profissão;
- rotina;
- ambiente doméstico;
- disponibilidade;
- objetivos.

### Dados de saúde e bem-estar

- peso;
- altura;
- medidas;
- sono;
- fome;
- atividade física;
- sintomas declarados;
- condições declaradas;
- medicamentos;
- alergias;
- gravidez;
- documentos futuros.

### Dados comportamentais

- respostas;
- check-ins;
- padrões;
- interações;
- feedback;
- uso da plataforma.

### Dados técnicos

- endereço IP;
- dispositivo;
- sessão;
- logs;
- correlation IDs;
- eventos de segurança.

### Dados derivados

- estados;
- hipóteses;
- barreiras;
- trajetórias;
- perfis;
- classificações;
- sinais de segurança.

---

## 6. Classificação de sensibilidade

### Nível 1 — Público ou institucional

Exemplo:

- conteúdo público;
- documentação sem dados pessoais.

### Nível 2 — Interno

Exemplo:

- métricas agregadas;
- configuração não secreta.

### Nível 3 — Pessoal

Exemplo:

- nome;
- e-mail;
- rotina.

### Nível 4 — Sensível

Exemplo:

- dados de saúde;
- sintomas;
- medicamentos;
- hipóteses individuais.

### Nível 5 — Altamente restrito

Exemplo:

- informações de crise;
- possível transtorno alimentar;
- autoagressão;
- documentos médicos;
- credenciais e chaves.

---

## 7. Inventário de tratamento

Antes do Alpha fechado, deve existir um registro contendo, para cada operação:

- dado;
- finalidade;
- titular;
- origem;
- hipótese legal a ser validada;
- sistema;
- fornecedor;
- retenção;
- acesso;
- compartilhamento;
- risco;
- medida de segurança;
- procedimento de exclusão.

---

## 8. Hipóteses legais

A base legal não deve ser escolhida automaticamente nem de maneira genérica.

Para cada finalidade, a empresa deverá documentar:

- qual hipótese legal se aplica;
- por que ela se aplica;
- se envolve dado sensível;
- se exige consentimento;
- como o titular será informado;
- como ocorrerá revogação quando aplicável;
- quais riscos existem.

### Regra

Consentimento não deve ser tratado como solução universal.

A definição final das bases legais requer revisão jurídica.

---

## 9. Consentimento

Quando utilizado, o consentimento deve ser:

- livre;
- informado;
- inequívoco;
- específico;
- destacado quando envolver dados sensíveis;
- registrado;
- versionado;
- revogável;
- separado por finalidade.

### Consentimentos inicialmente previstos

- aceite dos Termos de Uso;
- ciência da Política de Privacidade;
- análise personalizada;
- armazenamento longitudinal;
- notificações;
- compartilhamento futuro com profissional;
- uso anonimizado ou agregado futuro, se juridicamente adequado.

### Proibido

- caixas pré-marcadas;
- consentimento agrupado sem necessidade;
- linguagem obscura;
- impedir o uso básico por recusa de finalidade não essencial;
- reutilizar dados para nova finalidade sem análise.

---

## 10. Direitos do titular

O Higeia deverá preparar processos para:

- confirmação da existência de tratamento;
- acesso;
- correção;
- informação sobre compartilhamento;
- anonimização, bloqueio ou eliminação quando aplicável;
- portabilidade quando regulamentada e aplicável;
- revogação do consentimento;
- oposição quando aplicável;
- revisão de decisões automatizadas, conforme aplicação;
- informação sobre critérios relevantes utilizados.

### Regra

Os pedidos devem possuir:

- canal;
- autenticação;
- protocolo;
- prazo;
- responsável;
- registro de conclusão.

---

## 11. Transparência

A Política de Privacidade deverá explicar, em linguagem acessível:

- quem trata os dados;
- quais dados são coletados;
- por que são coletados;
- como são usados;
- com quem são compartilhados;
- onde são armazenados;
- quais decisões ou inferências são produzidas;
- quais fornecedores participam;
- quais são os direitos do titular;
- como exercer esses direitos;
- como solicitar exclusão;
- como contatar o encarregado ou canal responsável.

---

## 12. Minimização

Antes de criar qualquer campo, perguntar:

1. Este dado é necessário para a finalidade atual?
2. Pode ser opcional?
3. Pode ser coletado mais tarde?
4. Pode ser armazenado de maneira menos detalhada?
5. Pode ser eliminado após uso?
6. Pode ser processado sem enviar ao provedor externo?

---

## 13. Privacy by Design

Toda funcionalidade deve considerar privacidade desde a especificação.

Checklist:

- finalidade;
- minimização;
- acesso;
- retenção;
- consentimento;
- transparência;
- segurança;
- exclusão;
- fornecedores;
- dados derivados;
- auditoria;
- risco ao titular.

---

## 14. Security by Design

Controles mínimos previstos:

- criptografia em trânsito;
- criptografia em repouso, quando oferecida;
- autenticação segura;
- autorização por função;
- privilégio mínimo;
- segregação de ambientes;
- gestão de segredos;
- logs protegidos;
- backups;
- rate limiting;
- validação de entradas;
- proteção de sessões;
- revisão de dependências;
- monitoramento;
- resposta a incidentes.

---

## 15. Controle de acesso

Papéis iniciais:

- user;
- admin;
- reviewer;
- system.

Princípios:

- negar por padrão;
- mínimo privilégio;
- acessos administrativos registrados;
- revisão periódica;
- remoção imediata de acesso indevido;
- dados sensíveis disponíveis somente por necessidade.

---

## 16. Autenticação

Requisitos mínimos:

- senha protegida por serviço adequado;
- verificação de e-mail;
- recuperação segura;
- expiração e revogação de sessão;
- proteção contra força bruta;
- MFA para administradores antes do Alpha externo;
- registro de eventos críticos.

---

## 17. Gestão de segredos

Segredos incluem:

- chaves de API;
- connection strings;
- service role keys;
- tokens;
- signing secrets;
- credenciais administrativas.

Nunca devem aparecer em:

- Git;
- Markdown;
- screenshots;
- prompts;
- issues;
- logs;
- mensagens de suporte.

---

## 18. Ambientes

Devem existir ambientes separados:

- local;
- development;
- staging;
- production.

### Regra

Dados reais não devem ser copiados para desenvolvimento.

Testes devem usar dados fictícios.

---

## 19. Fornecedores

Antes de contratar um fornecedor, avaliar:

- finalidade;
- dados enviados;
- localização;
- retenção;
- treinamento de modelos;
- suboperadores;
- segurança;
- certificações;
- exclusão;
- portabilidade;
- resposta a incidentes;
- transferência internacional;
- contrato;
- possibilidade de troca.

---

## 20. Provedores de inteligência artificial

O Higeia deverá:

- enviar somente o contexto necessário;
- remover identificadores quando possível;
- impedir uso indevido para treinamento quando contratualmente disponível;
- registrar provedor, modelo e finalidade;
- controlar retenção;
- avaliar transferência internacional;
- revisar contratos;
- validar saídas;
- preservar auditoria sem armazenar conteúdo excessivo.

### Proibido

Enviar toda a memória do usuário ao modelo sem necessidade.

---

## 21. Decisões automatizadas

Quando análises automatizadas influenciarem significativamente a experiência, o Higeia deverá:

- informar que houve processamento automatizado;
- explicar os principais fatores usados;
- permitir contestação;
- permitir correção;
- preservar histórico;
- disponibilizar revisão adequada quando aplicável;
- não apresentar inferência como fato.

---

## 22. Retenção

Cada categoria deve possuir prazo ou critério de retenção.

Possíveis estados:

- ativo;
- necessário;
- arquivado;
- bloqueado;
- anonimizado;
- eliminado;
- retenção legal.

### Regra

“Guardar para sempre” não é uma política aceitável.

---

## 23. Exclusão

O processo deve considerar:

- conta;
- perfil;
- respostas;
- arquivos;
- memórias;
- hipóteses;
- embeddings futuros;
- logs;
- backups;
- fornecedores;
- dados derivados.

### Fluxo

1. autenticar solicitante;
2. registrar pedido;
3. suspender tratamentos incompatíveis;
4. localizar dados;
5. excluir, bloquear ou anonimizar conforme aplicável;
6. comunicar operadores;
7. revisar derivados;
8. registrar conclusão;
9. informar o titular.

---

## 24. Anonimização e agregação

Dados só serão tratados como anônimos quando não puderem ser relacionados ao titular por meios razoáveis disponíveis.

Pseudonimização não deve ser confundida com anonimização.

Aprendizado coletivo futuro dependerá de:

- avaliação jurídica;
- avaliação técnica;
- risco de reidentificação;
- finalidade;
- transparência;
- governança;
- segurança.

---

## 25. Logs

Logs devem registrar o necessário para segurança e auditoria sem reproduzir desnecessariamente dados sensíveis.

### Registrar

- evento;
- data;
- ator;
- alvo;
- resultado;
- correlation ID;
- classificação;
- versão.

### Evitar

- texto integral de conversas;
- dados médicos completos;
- chaves;
- tokens;
- senhas;
- respostas brutas sem necessidade.

---

## 26. Backups

Backups devem possuir:

- criptografia;
- acesso restrito;
- retenção;
- testes de restauração;
- inventário;
- processo de exclusão compatível;
- segregação.

---

## 27. Incidente de segurança

Incidente é evento confirmado relacionado à violação de confidencialidade, integridade, disponibilidade ou autenticidade de dados pessoais.

Exemplos:

- acesso indevido;
- exposição;
- vazamento;
- perda;
- alteração;
- indisponibilidade relevante;
- envio ao destinatário errado;
- credencial comprometida.

---

## 28. Resposta a incidentes

Fluxo inicial:

1. detectar;
2. conter;
3. preservar evidências;
4. classificar;
5. identificar dados e titulares afetados;
6. avaliar risco ou dano relevante;
7. acionar responsáveis;
8. corrigir;
9. decidir comunicações aplicáveis;
10. documentar;
11. revisar controles.

### Regra regulatória

Quando o incidente puder acarretar risco ou dano relevante aos titulares, o controlador deverá avaliar a comunicação à ANPD e aos titulares conforme o regulamento vigente.

A Resolução CD/ANPD nº 15/2024 estabelece prazo de três dias úteis para a comunicação à ANPD, contado do conhecimento pelo controlador, ressalvadas regras específicas aplicáveis.

---

## 29. Registro de incidentes

Cada incidente deve conter:

- identificador;
- data;
- detecção;
- categoria;
- severidade;
- sistemas;
- dados;
- quantidade estimada;
- titulares;
- causa;
- contenção;
- risco;
- comunicação;
- resolução;
- aprendizados;
- responsável.

---

## 30. Relatório de Impacto

O Higeia deverá se preparar para produzir Relatório de Impacto à Proteção de Dados Pessoais quando necessário ou solicitado.

Conteúdo esperado:

- operações;
- finalidades;
- necessidade;
- proporcionalidade;
- dados;
- titulares;
- agentes;
- compartilhamentos;
- riscos;
- controles;
- risco residual;
- aprovação;
- revisão.

---

## 31. Menores de idade

O MVP inicial não deve aceitar menores até que exista:

- decisão formal;
- avaliação jurídica;
- mecanismo de idade;
- fluxo de responsável;
- política específica;
- segurança reforçada;
- UX adequada.

---

## 32. Dados para pesquisa

Qualquer pesquisa com dados ou participação humana deve ser avaliada separadamente quanto a:

- finalidade;
- base legal;
- ética;
- consentimento;
- anonimização;
- publicação;
- compartilhamento;
- revisão institucional quando aplicável.

---

## 33. Proibições

O Higeia não deve:

- comercializar dados pessoais;
- usar dados de saúde para publicidade comportamental invasiva;
- criar perfis discriminatórios;
- inferir atributos sensíveis sem finalidade válida;
- coletar dados excessivos;
- esconder compartilhamentos;
- dificultar exclusão;
- reutilizar dados silenciosamente;
- expor dados a colaboradores sem necessidade;
- enviar dados desnecessários à IA.

---

## 34. Responsabilização

Devem existir evidências de conformidade:

- inventário;
- decisões;
- políticas;
- consentimentos;
- contratos;
- treinamentos;
- testes;
- logs;
- avaliações;
- incidentes;
- correções;
- revisões.

---

## 35. Gates antes de usuários reais

Antes do Alpha fechado:

- [ ] entidade controladora definida;
- [ ] política de privacidade revisada;
- [ ] termos revisados;
- [ ] bases legais documentadas;
- [ ] inventário de dados criado;
- [ ] fornecedores avaliados;
- [ ] consentimentos implementados;
- [ ] exclusão testada;
- [ ] direitos do titular testados;
- [ ] incident response definido;
- [ ] canal de privacidade definido;
- [ ] controles de acesso testados;
- [ ] MFA administrativo ativo;
- [ ] logs revisados;
- [ ] backup e restauração testados;
- [ ] revisão jurídica concluída.

---

## 36. Responsabilidades no estágio atual

### Fundador

- aprovar finalidades;
- evitar coleta prematura;
- contratar revisão jurídica;
- exigir segurança;
- registrar decisões.

### Engenharia

- implementar controles;
- documentar dados;
- proteger segredos;
- testar exclusão;
- produzir auditoria.

### Produto

- justificar campos;
- garantir transparência;
- evitar dark patterns;
- incorporar direitos.

### IA

- minimizar contexto;
- separar fato e hipótese;
- limitar memória;
- validar saídas;
- registrar versões.

---

## 37. Documentos derivados

A partir desta fundação deverão ser criados:

1. Política de Privacidade.
2. Termos de Uso.
3. Data Processing Inventory.
4. Data Retention and Deletion Policy.
5. Incident Response Plan.
6. Vendor Security Assessment.
7. Access Control Policy.
8. Data Subject Request Procedure.
9. Relatório de Impacto, quando aplicável.
10. Security Architecture.

---

## 38. Referências normativas principais

- Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais.
- Regulamentações vigentes da Autoridade Nacional de Proteção de Dados.
- Resolução CD/ANPD nº 15/2024 — Comunicação de Incidente de Segurança.
- Resolução CD/ANPD nº 18/2024 — Atuação do encarregado.
- Normas setoriais e profissionais que venham a ser aplicáveis.

### Regra

Antes do lançamento, as referências deverão ser revisadas para identificar alterações regulatórias.

---

## 39. Limitações

Este documento:

- não constitui parecer jurídico;
- não define sozinho a base legal;
- não garante conformidade;
- não substitui advogado, DPO ou especialista;
- não cobre todas as normas setoriais;
- deverá evoluir com o produto.

---

## 40. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da fundação inicial de segurança, privacidade e LGPD. |
