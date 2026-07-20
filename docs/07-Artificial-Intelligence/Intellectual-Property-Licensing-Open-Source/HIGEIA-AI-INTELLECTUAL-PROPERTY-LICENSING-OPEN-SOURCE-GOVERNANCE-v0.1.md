# Higeia — AI Intellectual Property, Licensing and Open Source Governance

**Documento:** Higeia AI Intellectual Property, Licensing and Open Source Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia identificará, avaliará, aprovará, utilizará, protegerá e encerrará o uso de ativos de propriedade intelectual próprios e de terceiros.

Este framework estabelece requisitos para:

- código aberto;
- bibliotecas;
- modelos;
- datasets;
- prompts;
- documentação;
- imagens;
- conteúdos;
- marcas;
- nomes;
- fontes clínicas;
- APIs;
- contribuições externas;
- licenças;
- atribuições;
- restrições;
- direitos comerciais;
- propriedade de entregáveis;
- prevenção de uso indevido.

---

## 2. Princípio central

Nenhum ativo deve ser incorporado ao Higeia sem que seja possível responder:

- quem é o titular;
- qual licença se aplica;
- qual uso é permitido;
- quais restrições existem;
- se uso comercial é permitido;
- se modificação é permitida;
- se redistribuição é permitida;
- se atribuição é obrigatória;
- se há obrigação de compartilhar código;
- se há limitação para dados de saúde;
- quem aprovou;
- onde está a evidência.

---

## 3. Escopo

Aplica-se a:

- código-fonte;
- dependências;
- frameworks;
- SDKs;
- APIs;
- modelos fundacionais;
- modelos locais;
- pesos;
- adapters;
- embeddings;
- datasets;
- corpus;
- bases clínicas;
- imagens;
- textos;
- documentos;
- prompts;
- templates;
- schemas;
- marcas;
- domínios;
- nomes;
- materiais de marketing;
- documentação;
- outputs gerados;
- contribuições de terceiros.

---

## 4. Categorias de ativo

### PROPRIETARY

Ativo próprio do Higeia.

### OPEN_SOURCE

Ativo sob licença aberta.

### COMMERCIAL

Ativo licenciado comercialmente.

### PUBLIC_DOMAIN

Ativo em domínio público.

### PARTNER_OWNED

Ativo de parceiro.

### USER_PROVIDED

Ativo fornecido por usuário.

### THIRD_PARTY_UNVERIFIED

Ativo de terceiro sem licença verificada.

### RESTRICTED

Ativo com restrições especiais.

---

## 5. Inventário obrigatório

Cada ativo relevante deve possuir:

- asset_id;
- name;
- category;
- owner;
- source;
- version;
- license;
- commercial_use;
- modification;
- redistribution;
- attribution;
- restrictions;
- approval;
- evidence;
- status.

---

## 6. Tipos de licença

Exemplos de categorias:

- permissive;
- weak_copyleft;
- strong_copyleft;
- source_available;
- proprietary;
- research_only;
- noncommercial;
- custom;
- unknown.

A classificação deve ser validada conforme o texto real da licença.

---

## 7. Licenças permissivas

Podem permitir amplo uso, mas podem exigir:

- manutenção de aviso;
- inclusão de copyright;
- inclusão da licença;
- atribuição;
- disclaimer.

---

## 8. Copyleft

Pode exigir compartilhamento de código ou obras derivadas em determinadas condições.

Antes de usar:

- avaliar forma de distribuição;
- avaliar linking;
- avaliar modificações;
- avaliar SaaS;
- avaliar obrigações de publicação;
- obter revisão jurídica quando necessário.

---

## 9. Licenças não comerciais

Não devem ser usadas em produto comercial sem autorização específica.

---

## 10. Research-only

Ativos limitados a pesquisa não devem ser incorporados ao produto comercial sem autorização.

---

## 11. Source-available

Código visível não significa open source.

Avaliar:

- uso comercial;
- hospedagem;
- concorrência;
- redistribuição;
- modificação;
- limite de usuários;
- limite de receita.

---

## 12. Modelos de IA

Para cada modelo, registrar:

- provider;
- model;
- version;
- license or terms;
- input rights;
- output rights;
- training use;
- retention;
- restrictions;
- prohibited uses;
- region;
- termination;
- portability.

---

## 13. Outputs de modelos

Não presumir exclusividade automática.

Avaliar:

- termos do provedor;
- similaridade;
- conteúdo de terceiros;
- marcas;
- direitos autorais;
- dados pessoais;
- revisão humana;
- uso comercial.

---

## 14. Prompts

Prompts desenvolvidos internamente devem ser:

- versionados;
- classificados;
- protegidos;
- atribuídos ao Higeia por contrato;
- limitados por acesso;
- auditáveis.

---

## 15. Datasets

Para cada dataset, registrar:

- origem;
- licença;
- consentimento;
- finalidade;
- sensibilidade;
- uso permitido;
- treinamento permitido;
- redistribuição;
- retenção;
- exclusão;
- proveniência;
- limitações.

---

## 16. Conteúdo clínico

Fontes clínicas devem possuir:

- origem;
- direitos de uso;
- permissão de citação;
- permissão de indexação;
- permissão de embedding;
- atribuição;
- validade;
- owner;
- revisão clínica.

---

## 17. RAG

Antes de indexar conteúdo:

- verificar licença;
- verificar copyright;
- verificar uso comercial;
- verificar reprodução;
- verificar armazenamento;
- verificar embeddings;
- verificar citação;
- verificar restrições contratuais.

---

## 18. Web content

Conteúdo público na internet não deve ser considerado livre para copiar, armazenar ou reutilizar.

---

## 19. Documentos de usuários

O usuário pode fornecer documentos sem ser titular de todos os direitos.

Definir:

- finalidade;
- licença limitada;
- acesso;
- retenção;
- compartilhamento;
- exclusão;
- responsabilidade;
- uso em treinamento.

---

## 20. Código gerado por IA

Código gerado deve passar por:

- revisão;
- teste;
- scan de licença;
- scan de segredo;
- scan de vulnerabilidade;
- comparação quando necessário;
- documentação de origem.

---

## 21. Copilot e assistentes

Definir:

- ferramentas aprovadas;
- repositórios permitidos;
- dados que podem ser enviados;
- uso de código privado;
- retenção;
- treinamento do fornecedor;
- revisão obrigatória.

---

## 22. Dependências

Toda dependência deve possuir:

- nome;
- versão;
- licença;
- source;
- owner;
- criticidade;
- vulnerabilidades;
- aprovação;
- atualização;
- substituição;
- remoção.

---

## 23. SBOM

Manter Software Bill of Materials quando aplicável.

Ela deve listar:

- componentes;
- versões;
- licenças;
- origem;
- dependências;
- hashes;
- vulnerabilidades;
- status.

---

## 24. License scanning

Automatizar quando possível:

- identificação de licença;
- dependência transitiva;
- licença desconhecida;
- copyleft;
- arquivo sem cabeçalho;
- pacote abandonado;
- mudança de licença.

---

## 25. Aprovação de dependência

Antes de adicionar:

- necessidade;
- licença;
- segurança;
- manutenção;
- comunidade;
- lock-in;
- substituição;
- custo;
- compatibilidade;
- owner.

---

## 26. Lista permitida

Criar:

- approved licenses;
- restricted licenses;
- prohibited licenses;
- legal review required.

---

## 27. Atribuições

Manter arquivo ou pacote com:

- notices;
- copyrights;
- licenses;
- acknowledgements;
- third-party terms.

---

## 28. Marcas

Controlar:

- Higeia;
- Projeto Eros;
- logos;
- slogans;
- domínios;
- handles;
- nomes de módulos;
- co-branding.

---

## 29. Registro de marca

A estratégia deve considerar:

- disponibilidade;
- classes;
- territórios;
- conflito;
- oposição;
- uso;
- renovação.

---

## 30. Domínios e handles

Registrar:

- titular;
- conta;
- renovação;
- acesso;
- MFA;
- recuperação;
- uso;
- variações críticas.

---

## 31. Contratos de trabalho e prestação

Devem tratar:

- cessão de direitos;
- confidencialidade;
- invenções;
- código;
- documentação;
- prompts;
- datasets;
- materiais;
- obrigação de informar terceiros;
- retorno ou exclusão.

---

## 32. Contribuições externas

Antes de aceitar contribuição:

- identificar autor;
- confirmar direitos;
- verificar licença;
- obter declaração;
- revisar código;
- revisar dados;
- registrar aprovação.

---

## 33. CLA

Contributor License Agreement pode ser usado quando apropriado.

---

## 34. DCO

Developer Certificate of Origin pode ser usado para confirmar origem da contribuição.

---

## 35. Contratados

Entregáveis de contratados devem ter titularidade e licença claramente definidas.

Pagamento não garante automaticamente cessão de direitos.

---

## 36. Parceiros

Definir:

- propriedade pré-existente;
- propriedade criada em conjunto;
- uso;
- licença;
- confidencialidade;
- publicação;
- melhorias;
- saída;
- dados;
- modelos;
- outputs.

---

## 37. Propriedade pré-existente

Separar:

- background IP;
- foreground IP;
- jointly developed IP;
- licensed IP.

---

## 38. Segredo comercial

Podem ser protegidos como segredo:

- prompts;
- arquiteturas;
- avaliações;
- métodos;
- datasets internos;
- regras;
- estratégias;
- documentação.

Exigem medidas reais de confidencialidade.

---

## 39. Controle de acesso

Aplicar need-to-know para ativos sensíveis.

---

## 40. Publicação

Antes de publicar:

- código;
- artigo;
- dataset;
- prompt;
- benchmark;
- apresentação;
- documentação;

verificar direitos, segredos, dados pessoais e estratégia.

---

## 41. Open sourcing

Antes de abrir código:

- definir objetivo;
- revisar segredos;
- revisar direitos;
- escolher licença;
- remover dados;
- documentar suporte;
- definir governance;
- aprovar.

---

## 42. Uso de ativos de concorrentes

Proibido incorporar:

- código proprietário;
- documentação confidencial;
- dados obtidos indevidamente;
- material de ex-empregador;
- segredos comerciais;
- conteúdo copiado sem licença.

---

## 43. Takedown

Criar processo para:

- denúncia;
- análise;
- contenção;
- remoção;
- preservação de evidência;
- comunicação;
- correção;
- prevenção.

---

## 44. Disputa de propriedade

Registrar:

- claim;
- asset;
- claimant;
- evidence;
- use;
- impact;
- containment;
- legal review;
- decision.

---

## 45. Mudança de licença

Monitorar quando:

- biblioteca muda;
- modelo muda termos;
- fornecedor altera política;
- dataset muda acesso;
- API muda direitos;
- contrato é atualizado.

---

## 46. Encerramento de ativo

Ao remover:

- identificar dependências;
- substituir;
- remover código;
- remover dados;
- atualizar notices;
- atualizar SBOM;
- arquivar evidência;
- revisar contrato.

---

## 47. Licença desconhecida

Ativo com licença desconhecida deve ser bloqueado até análise.

---

## 48. Evidência

Guardar:

- licença;
- termos;
- data;
- versão;
- screenshot ou arquivo;
- aprovação;
- contrato;
- atribuição;
- scan;
- decisão.

---

## 49. Métricas

Monitorar:

- assets inventoried;
- unknown licenses;
- prohibited licenses;
- overdue reviews;
- unapproved dependencies;
- missing attributions;
- license changes;
- open IP claims;
- contractor assignments;
- SBOM coverage;
- takedown time.

---

## 50. Auditoria

Deve ser possível responder:

- qual ativo;
- de quem;
- sob qual licença;
- qual versão;
- quem aprovou;
- onde é usado;
- quais restrições;
- qual atribuição;
- qual evidência;
- como remover.

---

## 51. Gates antes do Alpha

- [ ] inventário inicial criado;
- [ ] dependências principais mapeadas;
- [ ] licenças desconhecidas eliminadas;
- [ ] modelos e fornecedores revisados;
- [ ] datasets revisados;
- [ ] fontes clínicas revisadas;
- [ ] prompts internos classificados;
- [ ] contratos de cessão definidos;
- [ ] notices preparados;
- [ ] política de código gerado definida;
- [ ] scan de licença configurado;
- [ ] SBOM inicial disponível;
- [ ] claims de marca revisados;
- [ ] processo de takedown definido.

---

## 52. Responsabilidades

### IP Owner

Mantém o programa.

### Engineering

Controla dependências e código.

### AI Owner

Controla modelos, prompts e datasets.

### Legal

Avalia licenças e contratos.

### Product/Brand

Controla marcas e conteúdo.

### Security

Protege segredos e ferramentas.

### Procurement

Controla contratos e fornecedores.

### Founder

Aprova estratégia e riscos.

---

## 53. Questões abertas

1. Qual estratégia de proteção?
2. Quais marcas registrar?
3. Quais licenças serão permitidas?
4. Qual ferramenta de scan?
5. Qual SBOM?
6. Qual política para código gerado?
7. Quais fontes clínicas podem ser indexadas?
8. Quem será titular dos prompts?
9. Como tratar contribuições externas?
10. Qual processo de takedown?
11. Quais ativos serão segredo?
12. Quais componentes poderão ser open source?

---

## 54. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de propriedade intelectual, licenciamento e open source. |
