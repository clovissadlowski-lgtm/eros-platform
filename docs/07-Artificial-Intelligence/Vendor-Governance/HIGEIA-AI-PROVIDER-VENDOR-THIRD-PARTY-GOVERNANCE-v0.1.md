# Higeia — AI Provider, Vendor and Third-Party Governance

**Documento:** Higeia AI Provider, Vendor and Third-Party Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia selecionará, avaliará, aprovará, contratará, monitorará e substituirá fornecedores e terceiros.

Este framework se aplica a fornecedores de:

- modelos de inteligência artificial;
- APIs;
- nuvem;
- hospedagem;
- banco de dados;
- autenticação;
- armazenamento;
- observabilidade;
- mensageria;
- pagamentos;
- e-mail;
- notificações;
- analytics;
- segurança;
- suporte;
- serviços profissionais;
- processamento de dados.

---

## 2. Princípio central

Nenhum fornecedor deve ser utilizado apenas porque sua integração é simples ou seu preço inicial é baixo.

A decisão deve considerar:

- segurança;
- privacidade;
- finalidade;
- dados tratados;
- retenção;
- localização;
- disponibilidade;
- custo total;
- capacidade de auditoria;
- dependência;
- compatibilidade técnica;
- risco regulatório;
- plano de saída.

---

## 3. Escopo

Este documento cobre:

- seleção;
- due diligence;
- classificação de criticidade;
- aprovação;
- contrato;
- proteção de dados;
- subprocessadores;
- segurança;
- continuidade;
- observabilidade;
- custo;
- performance;
- incidentes;
- mudanças do fornecedor;
- renovação;
- substituição;
- encerramento;
- exclusão de dados;
- evidências.

---

## 4. Categorias de fornecedores

### AI-PROVIDER

Modelos, embeddings, moderação, speech e visão.

### CLOUD

Compute, containers, serverless, redes e infraestrutura.

### DATA

Banco, cache, warehouse, analytics e storage.

### IDENTITY

Autenticação, autorização e identidade.

### SECURITY

Scanning, SIEM, secrets, WAF e resposta.

### OBSERVABILITY

Logs, métricas, tracing e alertas.

### COMMUNICATION

E-mail, SMS, push e mensagens.

### PAYMENT

Cobrança, assinatura e antifraude.

### PROFESSIONAL

Jurídico, clínico, regulatório, segurança e consultoria.

### OTHER

Demais terceiros com acesso ou impacto relevante.

---

## 5. Criticidade

### VENDOR-LOW

Baixo impacto, sem dados sensíveis e facilmente substituível.

### VENDOR-MEDIUM

Impacto operacional moderado ou acesso limitado a dados.

### VENDOR-HIGH

Serviço central, dados pessoais ou dependência relevante.

### VENDOR-CRITICAL

Dados de saúde, autenticação, produção, IA central, pagamento ou indisponibilidade com impacto grave.

---

## 6. Critérios de criticidade

Considerar:

- sensibilidade dos dados;
- volume;
- privilégio;
- acesso à produção;
- indisponibilidade;
- substituibilidade;
- concentração;
- impacto financeiro;
- impacto clínico;
- impacto de privacidade;
- impacto regulatório;
- dependência técnica;
- tempo de recuperação.

---

## 7. Princípio de minimização

Enviar ao fornecedor apenas os dados necessários para a finalidade aprovada.

Evitar:

- perfil completo quando basta um resumo;
- identificadores diretos;
- histórico integral;
- anexos não necessários;
- dados de terceiros;
- segredos;
- excesso de contexto;
- informação não relacionada.

---

## 8. Inventário de fornecedores

Cada fornecedor deve possuir registro com:

- vendor_id;
- nome;
- categoria;
- serviço;
- owner;
- criticidade;
- finalidade;
- dados tratados;
- ambientes;
- localização;
- subprocessadores;
- contrato;
- custo;
- SLA;
- status;
- última revisão;
- próxima revisão;
- plano de saída.

---

## 9. Estados do fornecedor

- identified;
- evaluating;
- approved;
- approved_with_restrictions;
- contracting;
- active;
- under_review;
- suspended;
- exit_planned;
- terminated;
- blocked.

---

## 10. Due diligence inicial

Antes da contratação, avaliar:

- reputação;
- maturidade;
- segurança;
- privacidade;
- termos;
- retenção;
- uso dos dados;
- treinamento de modelos;
- subprocessadores;
- localização;
- disponibilidade;
- histórico de incidentes;
- suporte;
- auditorias;
- certificações;
- custo;
- lock-in;
- exportação;
- exclusão;
- viabilidade de saída.

---

## 11. Questionário de segurança

Verificar:

- criptografia em trânsito;
- criptografia em repouso;
- controle de acesso;
- MFA;
- segregação;
- logs;
- incident response;
- backup;
- disaster recovery;
- vulnerability management;
- penetration testing;
- SDLC;
- secrets management;
- employee access;
- audit trail;
- data deletion.

---

## 12. Questionário de privacidade

Verificar:

- papel no tratamento;
- finalidade;
- instruções do controlador;
- retenção;
- exclusão;
- portabilidade;
- subprocessadores;
- transferência internacional;
- região;
- treinamento;
- uso secundário;
- resposta a titulares;
- suporte a incidentes;
- documentação.

---

## 13. Fornecedores de IA

Para cada provedor de IA, avaliar:

- modelos disponíveis;
- versões;
- contexto;
- segurança;
- retenção;
- uso dos dados;
- treinamento;
- região;
- logs;
- isolamento;
- disponibilidade;
- custo;
- limites;
- rate limits;
- incidentes;
- mudança silenciosa;
- depreciação;
- fallback;
- portabilidade de prompts;
- compatibilidade de schema.

---

## 14. Uso de dados para treinamento

Não enviar dados pessoais ou de saúde a fornecedor que utilize essas entradas para treinamento não autorizado.

A decisão deve ser:

- contratualmente documentada;
- tecnicamente configurada;
- periodicamente verificada;
- ligada à versão do serviço.

---

## 15. Retenção do fornecedor

Registrar:

- retenção padrão;
- retenção configurável;
- retenção de abuso;
- retenção de logs;
- retenção de backups;
- prazo de exclusão;
- exceções;
- evidência de configuração.

---

## 16. Transferência internacional

Antes de usar fornecedor fora do Brasil, avaliar:

- países;
- data centers;
- subprocessadores;
- base aplicável;
- cláusulas;
- garantias;
- riscos;
- transparência ao usuário;
- capacidade de exclusão.

---

## 17. Subprocessadores

O fornecedor deve informar, quando aplicável:

- identidade;
- função;
- localização;
- dados acessados;
- alterações;
- mecanismo de notificação;
- possibilidade de objeção;
- fluxo de exclusão.

---

## 18. Contratos

Cláusulas relevantes:

- finalidade;
- confidencialidade;
- proteção de dados;
- segurança;
- incidentes;
- prazo de notificação;
- subprocessadores;
- auditoria;
- retenção;
- exclusão;
- portabilidade;
- disponibilidade;
- suporte;
- limitação de responsabilidade;
- continuidade;
- encerramento;
- lei aplicável;
- propriedade intelectual.

---

## 19. Acordo de tratamento de dados

Fornecedores que tratam dados pessoais devem possuir documento contratual adequado ao papel exercido.

O acordo deve esclarecer:

- instruções;
- finalidade;
- categorias;
- titulares;
- segurança;
- subprocessadores;
- incidentes;
- exclusão;
- devolução;
- auditoria;
- cooperação.

---

## 20. SLA e SLO

Registrar:

- disponibilidade;
- suporte;
- resposta;
- resolução;
- recuperação;
- perda de dados;
- manutenção;
- créditos;
- exclusões;
- dependências.

---

## 21. Continuidade

Fornecedores críticos devem possuir:

- plano de continuidade;
- backup;
- recuperação;
- redundância;
- status page;
- suporte;
- contatos de crise;
- histórico de testes;
- objetivos de recuperação.

---

## 22. RTO e RPO

### RTO

Tempo máximo aceitável para restaurar o serviço.

### RPO

Perda máxima aceitável de dados.

Cada fornecedor crítico deve ter RTO e RPO avaliados contra as necessidades do Higeia.

---

## 23. Dependência e lock-in

Avaliar:

- APIs proprietárias;
- formato de dados;
- funcionalidades exclusivas;
- código acoplado;
- contratos longos;
- custos de saída;
- conhecimento concentrado;
- migração;
- compatibilidade.

---

## 24. Estratégia de abstração

Quando apropriado:

- separar domínio de integração;
- criar adapters;
- evitar chamadas espalhadas;
- versionar contratos internos;
- padronizar schemas;
- permitir mocks;
- permitir fallback;
- manter exportação.

---

## 25. Plano de saída

Todo fornecedor High ou Critical deve possuir plano de saída com:

- motivo de saída;
- alternativa;
- dados a exportar;
- formato;
- prazo;
- dependências;
- responsáveis;
- custos;
- testes;
- exclusão;
- evidência de encerramento.

---

## 26. Portabilidade

Verificar se é possível exportar:

- dados;
- configurações;
- logs;
- embeddings;
- arquivos;
- usuários;
- métricas;
- histórico;
- chaves;
- regras;
- prompts;
- modelos derivados.

---

## 27. Exclusão no encerramento

Ao encerrar:

- revogar credenciais;
- bloquear acesso;
- exportar o necessário;
- solicitar exclusão;
- confirmar backups;
- confirmar subprocessadores;
- registrar evidência;
- atualizar inventário;
- monitorar cobranças.

---

## 28. Custo total

Avaliar:

- consumo;
- armazenamento;
- tráfego;
- suporte;
- observabilidade;
- egress;
- impostos;
- câmbio;
- excedentes;
- setup;
- migração;
- encerramento;
- treinamento da equipe;
- custo operacional.

---

## 29. Risco cambial

Para fornecedores cobrados em moeda estrangeira:

- registrar moeda;
- taxa;
- impostos;
- spread;
- projeção;
- margem;
- limite;
- alerta;
- alternativa.

---

## 30. Concentração

Evitar dependência excessiva de:

- um único provedor;
- uma única região;
- uma única conta;
- uma única credencial;
- um único especialista;
- uma única integração crítica.

---

## 31. Aprovação

Fornecedores críticos exigem aprovação de:

- owner;
- engenharia;
- segurança;
- privacidade;
- jurídico;
- financeiro;
- fundador;
- clínico/regulatório quando aplicável.

---

## 32. Restrições

Uma aprovação pode limitar:

- tipo de dado;
- ambiente;
- volume;
- região;
- finalidade;
- prazo;
- usuários;
- funcionalidades;
- subcontratação;
- uso de produção.

---

## 33. Monitoramento contínuo

Acompanhar:

- disponibilidade;
- incidentes;
- performance;
- custo;
- alterações;
- termos;
- preços;
- subprocessadores;
- região;
- segurança;
- compliance;
- suporte;
- roadmap;
- depreciações.

---

## 34. Revisão periódica

Proposta inicial:

- Low: a cada 24 meses;
- Medium: anual;
- High: semestral;
- Critical: trimestral ou por evento relevante.

Os prazos finais deverão ser aprovados.

---

## 35. Gatilhos de reavaliação

Reavaliar quando houver:

- incidente;
- mudança contratual;
- mudança de preço;
- novo subprocessador;
- nova região;
- nova finalidade;
- novo dado;
- mudança de modelo;
- aquisição;
- queda de serviço;
- alerta regulatório;
- mudança de segurança;
- depreciação.

---

## 36. Incidentes de fornecedor

Quando o fornecedor reportar incidente:

1. registrar;
2. avaliar escopo;
3. identificar dados;
4. conter integração;
5. acionar fallback;
6. preservar evidência;
7. envolver jurídico e privacidade;
8. avaliar comunicação;
9. monitorar correção;
10. revisar continuidade.

---

## 37. Responsabilidade compartilhada

Documentar claramente o que é responsabilidade:

- do Higeia;
- do fornecedor;
- do usuário;
- do parceiro;
- do profissional.

Não presumir que o fornecedor cobre controles que são responsabilidade do Higeia.

---

## 38. Acesso do fornecedor

Acesso a ambientes deve ser:

- temporário;
- aprovado;
- auditado;
- mínimo;
- revogável;
- acompanhado;
- protegido por MFA;
- limitado por ambiente.

---

## 39. Credenciais

Para cada integração:

- usar conta organizacional;
- evitar credencial pessoal;
- separar ambientes;
- rotacionar;
- restringir escopo;
- armazenar em secrets manager;
- monitorar uso;
- revogar no encerramento.

---

## 40. Shadow IT

É proibido usar fornecedor não aprovado para:

- dados reais;
- saúde;
- produção;
- prompts internos;
- incidentes;
- documentos confidenciais;
- testes com dados pessoais.

---

## 41. Provas e evidências

Manter:

- avaliação;
- contrato;
- DPA;
- termos;
- configurações;
- screenshots essenciais;
- relatórios;
- certificados;
- contatos;
- aprovações;
- incidentes;
- revisões;
- plano de saída.

Documentos sensíveis não devem ficar em repositório público.

---

## 42. Vendor score

Dimensões:

- segurança;
- privacidade;
- disponibilidade;
- performance;
- custo;
- suporte;
- portabilidade;
- compliance;
- maturidade;
- dependência.

---

## 43. Critérios bloqueadores

Bloquear fornecedor quando houver:

- uso não autorizado de dados;
- impossibilidade de exclusão;
- ausência de segurança mínima;
- risco crítico sem mitigação;
- contrato incompatível;
- falta de transparência;
- transferência inaceitável;
- histórico grave não tratado;
- ausência de owner;
- ausência de plano de saída para serviço crítico.

---

## 44. Exceções

Exceções devem possuir:

- justificativa;
- risco;
- mitigação;
- owner;
- prazo;
- aprovação;
- revisão;
- plano de encerramento.

---

## 45. Gates antes do Alpha

- [ ] inventário inicial criado;
- [ ] fornecedores críticos classificados;
- [ ] due diligence concluída;
- [ ] contratos revisados;
- [ ] DPA avaliado;
- [ ] retenção conhecida;
- [ ] treinamento com dados verificado;
- [ ] subprocessadores conhecidos;
- [ ] regiões conhecidas;
- [ ] credenciais segregadas;
- [ ] monitoramento ativo;
- [ ] plano de saída definido;
- [ ] fallback dos críticos testado;
- [ ] exclusão testada;
- [ ] owners definidos.

---

## 46. Responsabilidades

### Founder

Aprovar risco e orçamento dos críticos.

### Engineering

Avaliar integração, disponibilidade e portabilidade.

### Security

Avaliar controles técnicos.

### Privacy

Avaliar dados, retenção e transferência.

### Legal

Avaliar contratos e obrigações.

### Finance

Avaliar custo total e risco cambial.

### AI Owner

Avaliar modelos e compatibilidade.

### Product

Avaliar impacto funcional.

---

## 47. Questões abertas

1. Fornecedores iniciais.
2. Regiões aprovadas.
3. Critérios de score.
4. Threshold mínimo.
5. Ferramenta de inventário.
6. Política multi-cloud.
7. Política multi-model.
8. DPA padrão.
9. Revisão de subprocessadores.
10. Frequência final.
11. Custo máximo de lock-in.
12. Processo de auditoria.

---

## 48. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de fornecedores e terceiros. |
