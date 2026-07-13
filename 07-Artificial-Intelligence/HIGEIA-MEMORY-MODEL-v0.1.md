# Higeia — Higeia Memory Model Specification

**Documento:** Higeia Memory Model Specification  
**Versão:** 0.1  
**Status:** Rascunho arquitetural oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia registra, atualiza, prioriza, arquiva, corrige e exclui informações ao longo da jornada do usuário.

A memória do Higeia deverá permitir continuidade sem produzir a falsa impressão de memória humana, consciência ou compreensão total.

Este documento especifica:

- tipos de memória;
- ciclo de vida;
- critérios de relevância;
- atualização;
- conflito;
- correção;
- esquecimento;
- privacidade;
- exclusão;
- auditoria;
- integração com o HIE;
- integração com o Digital Twin.

---

## 2. Princípios

1. Nem tudo deve ser lembrado.
2. Toda memória deve preservar origem.
3. Toda memória deve preservar temporalidade.
4. Informação antiga não deve ser confundida com estado atual.
5. Correções não devem apagar o histórico sem registro.
6. Memória deve ser proporcional à finalidade.
7. Dados sensíveis exigem maior proteção.
8. O usuário deve poder visualizar e corrigir informações relevantes.
9. Exclusão deve alcançar derivados quando tecnicamente e juridicamente aplicável.
10. Memória não deve ser usada para inferir atributos sensíveis indevidos.
11. Informações conflitantes devem coexistir até resolução.
12. A ausência de atualização pode reduzir relevância.

---

## 3. Visão geral

```text
Health Signals
    ↓
Memory Candidate
    ↓
Relevance Evaluation
    ↓
Memory Classification
    ↓
Storage
    ↓
Update / Conflict / Correction
    ↓
Use by HIE
    ↓
Archive / Forget / Delete
```

---

## 4. Tipos de memória

O Higeia utilizará sete tipos principais:

1. Factual Memory.
2. Contextual Memory.
3. Behavioral Memory.
4. Evolution Memory.
5. Preference Memory.
6. Strategy Memory.
7. Safety Memory.

Tipos auxiliares:

- Session Memory.
- Working Memory.
- Audit Memory.
- Knowledge Memory.

---

# 5. Factual Memory

## Definição

Armazena fatos declarados, observados ou importados.

## Exemplos

- altura;
- data de nascimento;
- peso registrado;
- profissão;
- medicação declarada;
- treino concluído;
- consulta registrada.

## Regras

- preservar fonte;
- preservar data;
- diferenciar declarado de verificado;
- não sobrescrever histórico temporal;
- permitir correção.

## Persistência

Longa, enquanto necessária à finalidade.

---

# 6. Contextual Memory

## Definição

Armazena informações sobre ambiente, rotina e circunstâncias.

## Exemplos

- trabalho em turnos;
- pouco tempo para cozinhar;
- viagem frequente;
- responsabilidade com filhos;
- acesso limitado a cozinha;
- rotina instável.

## Regras

- contexto pode expirar;
- deve possuir validade;
- deve ser revisado periodicamente;
- não deve ser tratado como identidade permanente.

## Exemplo

“Trabalha em turno noturno” pode ser válido por período específico e depois deixar de ser.

---

# 7. Behavioral Memory

## Definição

Armazena padrões comportamentais observados ao longo do tempo.

## Exemplos

- maior dificuldade aos finais de semana;
- melhor consistência com planejamento prévio;
- abandono após estratégias muito restritivas;
- oscilação de motivação.

## Requisitos

- múltiplos sinais;
- repetição;
- temporalidade;
- evidência;
- linguagem probabilística.

## Limite

Não deve gerar rótulos de personalidade ou diagnóstico psicológico.

---

# 8. Evolution Memory

## Definição

Armazena estados e trajetórias ao longo do tempo.

## Exemplos

- peso;
- sono;
- energia;
- adesão;
- frequência de treino;
- estresse percebido;
- evolução de barreiras.

## Regra

O estado atual não substitui o histórico.

## Uso

- comparação;
- tendência;
- linha do tempo;
- atualização de hipótese;
- Perfil de Inteligência.

---

# 9. Preference Memory

## Definição

Armazena preferências, rejeições e escolhas relevantes.

## Exemplos

- alimentos preferidos;
- alimentos evitados;
- preferência por metas simples;
- formato de lembrete;
- horário preferido;
- grau de detalhamento.

## Regras

- preferências podem mudar;
- devem ser confirmadas quando antigas;
- não devem ser generalizadas além do contexto.

---

# 10. Strategy Memory

## Definição

Armazena estratégias, intervenções e resultados.

## Exemplos

- preparação antecipada;
- ajuste de horário;
- meta semanal;
- redução de notificações;
- consulta profissional.

## Estrutura

```text
strategy_id
description
started_at
ended_at
adherence
observed_outcome
user_feedback
status
```

## Uso

Permitir que o sistema reconheça o que foi tentado, o que pareceu funcionar e o que falhou.

## Limite

Resultado observado não prova causalidade.

---

# 11. Safety Memory

## Definição

Armazena sinais relevantes para segurança.

## Exemplos

- possível transtorno alimentar;
- gravidez;
- uso de medicação;
- sintoma grave;
- ideação de autoagressão;
- menor de idade;
- limitação física importante.

## Regras

- acesso restrito;
- prioridade alta;
- retenção definida por política;
- redirecionamento obrigatório;
- auditoria;
- proibição de uso para personalização comercial.

---

# 12. Session Memory

## Definição

Informação mantida apenas durante uma sessão.

## Exemplos

- pergunta atual;
- contexto temporário da conversa;
- estado de formulário;
- etapa do fluxo.

## Persistência

Curta.

## Regra

Não deve ser promovida automaticamente para memória longitudinal.

---

# 13. Working Memory

## Definição

Conjunto temporário de dados usados pelo HIE durante um processamento.

## Exemplos

- contexto da geração do perfil;
- hipóteses candidatas;
- evidências em análise;
- resultados intermediários.

## Persistência

Temporária ou auditável conforme necessidade.

---

# 14. Audit Memory

## Definição

Registros necessários para rastreabilidade.

## Exemplos

- versão do prompt;
- modelo usado;
- entrada;
- saída;
- safety flags;
- correção;
- feedback;
- incidente.

## Regras

- acesso restrito;
- minimização;
- retenção definida;
- proteção contra alteração;
- mascaramento quando possível.

---

# 15. Knowledge Memory

## Definição

Conhecimento não individual usado pelo HIE.

## Exemplos

- ontologia;
- HKG;
- regras;
- políticas;
- glossário;
- referências.

## Regra

Deve ser separado da memória individual.

---

# 16. Estrutura de uma memória

```text
memory_id
user_id
memory_type
content
source_id
source_type
created_at
observed_at
valid_from
valid_to
status
confidence
quality
sensitivity
consent_scope
supersedes
superseded_by
version
```

---

# 17. Estados da memória

- active;
- uncertain;
- conflicting;
- outdated;
- superseded;
- archived;
- deleted;
- blocked.

---

# 18. Relevância

Uma informação pode ser promovida para memória quando:

- influencia objetivo;
- influencia segurança;
- reaparece;
- altera contexto;
- explica padrão;
- afeta decisão;
- possui valor longitudinal;
- foi explicitamente marcada pelo usuário.

## Critérios

- importância;
- frequência;
- recência;
- estabilidade;
- qualidade;
- impacto;
- sensibilidade;
- finalidade.

---

# 19. Priorização

## Alta prioridade

- segurança;
- consentimento;
- objetivo;
- condição declarada;
- medicação;
- evento relevante;
- correção do usuário;
- mudança estrutural de rotina.

## Média prioridade

- preferências;
- barreiras;
- estratégias;
- padrões recorrentes.

## Baixa prioridade

- detalhes ocasionais;
- conversa sem impacto;
- informação transitória sem repetição.

---

# 20. Atualização

## Tipos

### Append
Adicionar novo registro.

### Revise
Atualizar interpretação.

### Supersede
Substituir estado atual preservando histórico.

### Correct
Corrigir erro.

### Confirm
Revalidar informação.

### Expire
Encerrar validade.

### Archive
Remover do contexto ativo.

### Delete
Remover conforme política.

---

# 21. Conflitos

## Exemplo

Usuário informa:

- “Durmo bem.”
- “Durmo 5 horas e acordo cansado.”

## Ação

- registrar ambos;
- marcar conflito;
- reduzir confiança;
- perguntar;
- não escolher automaticamente;
- preservar resolução.

---

# 22. Correção pelo usuário

## Fluxo

1. usuário identifica erro;
2. solicita correção;
3. informa valor correto;
4. sistema registra motivo;
5. memória anterior é marcada;
6. nova versão é criada;
7. derivados são reavaliados.

## Regra

Correção deve influenciar hipóteses e perfis futuros.

---

# 23. Obsolescência

Uma memória pode ficar obsoleta quando:

- contexto mudou;
- informação expirou;
- usuário corrigiu;
- novo dado contradiz;
- finalidade terminou;
- ausência de atualização reduz validade.

## Exemplo

“Trabalha presencialmente” pode ficar desatualizado após mudança para trabalho remoto.

---

# 24. Esquecimento controlado

## Objetivo

Evitar acúmulo desnecessário.

## Estratégias

- expiração;
- resumo;
- arquivamento;
- redução de prioridade;
- exclusão;
- agregação;
- desidentificação.

## Regra

Esquecimento não pode comprometer segurança ou obrigações legais.

---

# 25. Resumo de memória

Memórias repetidas podem ser consolidadas.

## Exemplo

Vários relatos:
- “dificuldade no domingo”;
- “comi fora no domingo”;
- “fim de semana ruim”.

Resumo:
> Dificuldade alimentar recorrente aos finais de semana.

## Requisitos

- preservar evidências;
- preservar período;
- permitir abrir origem;
- não apagar registros brutos automaticamente.

---

# 26. Temporalidade

Toda memória deve registrar:

- quando foi observada;
- quando foi registrada;
- desde quando é válida;
- até quando é válida;
- quando foi revisada.

---

# 27. Confiança

## Modelo inicial

- low;
- moderate;
- high;
- insufficient_data.

## Influências

- origem;
- repetição;
- consistência;
- recência;
- confirmação;
- conflito;
- qualidade.

---

# 28. Sensibilidade

## Níveis

- standard;
- personal;
- sensitive;
- highly_sensitive.

## Exemplos

### Standard
Preferência de horário.

### Personal
Rotina de trabalho.

### Sensitive
Saúde declarada.

### Highly Sensitive
Transtorno alimentar, autoagressão, sexualidade, genética.

## Regra

Quanto maior a sensibilidade, menor o acesso e maior a proteção.

---

# 29. Consentimento

Cada memória deve estar vinculada a um escopo de consentimento.

## Exemplos

- personal_analysis;
- longitudinal_storage;
- notifications;
- professional_sharing;
- anonymized_learning.

## Regra

Revogação deve impedir novos usos incompatíveis.

---

# 30. Exclusão

## Tipos

- soft delete;
- hard delete;
- anonymization;
- legal hold;
- derived data review.

## Fluxo

1. receber solicitação;
2. confirmar identidade;
3. localizar dados;
4. interromper processamento;
5. excluir ou anonimizar;
6. revisar derivados;
7. registrar conclusão.

## Questão crítica

Dados derivados devem ser avaliados para exclusão quando puderem ser vinculados ao usuário.

---

# 31. Uso pelo HIE

O HIE deve consultar memória de forma seletiva.

## Critérios

- relevância para a pergunta;
- recência;
- segurança;
- objetivo;
- domínio;
- limite de contexto;
- permissões.

## Regra

Nunca enviar toda a memória ao modelo externo sem necessidade.

---

# 32. Retrieval

## Estratégia

Combinação de:

- filtros estruturados;
- busca temporal;
- busca semântica;
- prioridade;
- domínio;
- safety constraints.

## Saída

Memory Context Package.

---

# 33. Memory Context Package

```text
current_facts
active_context
recent_events
active_hypotheses
relevant_barriers
relevant_strengths
active_safety_flags
data_gaps
consent_scope
```

---

# 34. Digital Twin

A memória alimenta o Digital Twin.

## Relação

- Factual Memory → identidade e dados.
- Contextual Memory → contexto.
- Behavioral Memory → padrões.
- Evolution Memory → trajetória.
- Preference Memory → personalização.
- Strategy Memory → aprendizado.
- Safety Memory → limites.

---

# 35. Perfil de Inteligência

O perfil deve usar apenas memórias:

- ativas;
- relevantes;
- consentidas;
- suficientemente confiáveis;
- não bloqueadas.

---

# 36. Check-ins

Check-ins podem:

- criar memória;
- confirmar;
- contradizer;
- atualizar;
- expirar;
- fortalecer hipótese;
- enfraquecer hipótese.

---

# 37. Conversação

Mensagens do assistente não devem virar memória automaticamente.

## Promoção para memória

Somente quando:

- usuário declara fato relevante;
- usuário confirma;
- sistema identifica utilidade;
- segurança exige;
- regra explícita autoriza.

---

# 38. Proteção contra falsas memórias

## Riscos

- extração incorreta;
- resumo inadequado;
- inferência armazenada como fato;
- atribuição errada;
- contexto perdido.

## Mitigações

- saídas estruturadas;
- classificação;
- confirmação;
- origem;
- versionamento;
- feedback;
- revisão.

---

# 39. Auditoria

Registrar:

- criação;
- alteração;
- leitura sensível;
- correção;
- arquivamento;
- exclusão;
- uso em perfil;
- uso em resposta;
- acesso administrativo.

---

# 40. Métricas

- memórias criadas;
- memórias corrigidas;
- conflitos;
- memórias expiradas;
- memórias arquivadas;
- exclusões;
- taxa de contestação;
- taxa de uso;
- custo de retrieval;
- incidentes.

---

# 41. Critérios de aceite

O Memory Model v0.1 estará pronto quando:

- tipos de memória estiverem definidos;
- estrutura estiver definida;
- estados estiverem definidos;
- atualização estiver definida;
- conflitos estiverem tratados;
- correção estiver prevista;
- esquecimento estiver previsto;
- consentimento estiver integrado;
- exclusão estiver definida;
- retrieval estiver documentado;
- integração com HIE e Digital Twin estiver clara.

---

# 42. Riscos

1. Acúmulo excessivo.
2. Vazamento.
3. Uso indevido.
4. Memória incorreta.
5. Inferência armazenada como fato.
6. Exclusão incompleta.
7. Dependência excessiva de busca semântica.
8. Contexto antigo influenciando resposta atual.
9. Sensibilidade mal classificada.
10. Logs excessivos.

---

# 43. Mitigações

- minimização;
- classificação;
- expiração;
- revisão;
- correção;
- segregação;
- criptografia;
- acesso restrito;
- auditoria;
- testes.

---

# 44. Questões abertas

1. Qual banco de memória?
2. Como implementar busca semântica?
3. Qual política de retenção?
4. Qual expiração por tipo?
5. Como excluir embeddings?
6. Como anonimizar derivados?
7. Como resumir memória?
8. Como confirmar memória?
9. Qual limite de contexto?
10. Como lidar com dados importados?
11. Como definir relevância?
12. Como validar padrões?

---

# 45. Próximo documento

O próximo documento será:

> Higeia AI Safety and Evaluation Specification v0.1.

Ele definirá:

- riscos;
- políticas;
- testes;
- cenários;
- red teaming;
- métricas;
- incidentes;
- critérios de liberação.

---

# 46. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira especificação do modelo de memória longitudinal. |
