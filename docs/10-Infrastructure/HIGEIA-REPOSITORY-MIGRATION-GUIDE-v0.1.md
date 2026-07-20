# Higeia — Repository Migration Execution Guide

**Documento:** Higeia Repository Migration Execution Guide  
**Versão:** 0.1  
**Status:** Guia operacional oficial  
**Data:** 14 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Orientar, passo a passo, a reorganização segura do repositório `eros-platform`.

Este guia foi escrito para execução por uma pessoa sem experiência avançada em Git ou programação.

A reorganização terá quatro objetivos:

1. criar uma pasta central `docs`;
2. mover a documentação para dentro dela;
3. eliminar duplicidades de numeração e finalidade;
4. preparar a raiz do repositório para o código da aplicação.

---

## 2. Resultado final esperado

Ao término da migração, a raiz deverá se aproximar desta estrutura:

```text
eros-platform/
├── apps/
├── packages/
├── docs/
│   ├── 01-Constitution/
│   ├── 02-Business/
│   ├── 03-Product/
│   ├── 04-UX-Design/
│   ├── 05-Architecture/
│   ├── 06-Engineering/
│   ├── 07-Artificial-Intelligence/
│   ├── 08-Data-Model/
│   ├── 09-Brand-Identity/
│   ├── 10-Infrastructure/
│   ├── 11-Security/
│   ├── 12-Roadmap/
│   ├── 13-Investors/
│   ├── 14-Research/
│   ├── 15-Meeting-Notes/
│   └── 16-Decisions/
├── README.md
├── LICENSE
└── arquivos técnicos futuros
```

---

## 3. Regras de segurança

Antes de começar:

- não apague nenhuma pasta;
- não mova tudo de uma só vez;
- não use comandos que você não compreende;
- faça um commit após cada pequeno bloco;
- confira sempre o GitHub Desktop;
- pare se aparecer uma exclusão inesperada;
- nunca faça reorganização e instalação de código no mesmo commit.

---

## 4. Preparação

### 4.1 Confirmar sincronização

No GitHub Desktop:

1. abra o repositório;
2. clique em `Fetch origin`;
3. confirme que não há alterações pendentes;
4. confirme que o último commit foi enviado.

### 4.2 Criar uma branch

No GitHub Desktop:

1. clique em `Current branch`;
2. clique em `New branch`;
3. use o nome:

```text
chore/reorganize-repository
```

4. clique em `Create branch`.

### Critério de aceite

O topo do GitHub Desktop deve mostrar:

```text
Current branch: chore/reorganize-repository
```

---

## 5. Criar a pasta docs

No VS Code:

1. clique com o botão direito na raiz `EROS-PLATFORM`;
2. clique em `New Folder`;
3. digite:

```text
docs
```

### Critério de aceite

A pasta `docs` aparece na raiz.

---

## 6. Criar o índice mestre

Copie o conteúdo do arquivo:

```text
docs-README-template.md
```

para:

```text
docs/README.md
```

### Não fazer

Não deixe dois arquivos com a mesma função.

Após copiar, o arquivo temporário poderá ser apagado somente depois de confirmar o novo `docs/README.md`.

---

## 7. Bloco 1 — Fundação e negócio

Mover:

```text
01-Constitution
02-Business
```

para dentro de:

```text
docs/
```

Resultado:

```text
docs/01-Constitution
docs/02-Business
```

### Como mover no VS Code

1. clique e segure a pasta;
2. arraste para `docs`;
3. aguarde;
4. abra a pasta movida;
5. confirme os arquivos.

### Conferência no GitHub Desktop

Os arquivos devem aparecer como movidos ou renomeados.

### Commit

**Summary:**

```text
chore: move foundation and business documentation
```

### Critério de aceite

- nenhuma pasta ficou vazia na raiz;
- os arquivos continuam acessíveis;
- não há exclusões inesperadas.

---

## 8. Bloco 2 — Produto e UX

Mover:

```text
03-Product
04-UX-Design
```

para:

```text
docs/
```

### Commit

```text
chore: move product and UX documentation
```

---

## 9. Bloco 3 — Arquitetura e engenharia

Mover:

```text
05-Architecture
```

para:

```text
docs/05-Architecture
```

Criar:

```text
docs/06-Engineering
```

Mover o conteúdo técnico correspondente para essa pasta.

### Atenção

Se existir uma pasta atual com outro nome contendo padrões de engenharia, confira os arquivos antes de mover.

### Commit

```text
chore: move architecture and engineering documentation
```

---

## 10. Bloco 4 — Inteligência artificial e EIF histórico

Mover:

```text
07-Artificial-Intelligence
```

para:

```text
docs/07-Artificial-Intelligence
```

Dentro dela, criar:

```text
Legacy-EIF
```

Mover a antiga pasta:

```text
06-EIF
```

para:

```text
docs/07-Artificial-Intelligence/Legacy-EIF
```

### Criar README histórico

Dentro de `Legacy-EIF`, criar:

```text
README.md
```

Conteúdo recomendado:

```markdown
# Legacy EIF Documentation

Esta pasta preserva documentos históricos produzidos quando o motor de inteligência era chamado EIF.

O nome atual é HIE — Higeia Intelligence Engine.

Estes arquivos permanecem por rastreabilidade e não substituem as especificações atuais do HIE.
```

### Commit

```text
chore: consolidate HIE and legacy EIF documentation
```

---

## 11. Bloco 5 — Dados, marca e infraestrutura

Mover:

```text
08-Data-Model
09-Brand-Identity
09-Infrastructure
```

para:

```text
docs/08-Data-Model
docs/09-Brand-Identity
docs/10-Infrastructure
```

### Atenção

A pasta `09-Infrastructure` muda de número para `10-Infrastructure`.

### Commit

```text
chore: move data, brand and infrastructure documentation
```

---

## 12. Bloco 6 — Segurança

Mover:

```text
10-Security
```

para:

```text
docs/11-Security
```

### Commit

```text
chore: move security documentation
```

---

## 13. Bloco 7 — Consolidar roadmaps

Pastas atuais:

```text
11-Roadmap
14-Roadmap
```

Destino:

```text
docs/12-Roadmap
```

### Processo seguro

1. crie `docs/12-Roadmap`;
2. abra `11-Roadmap`;
3. anote os nomes dos arquivos;
4. abra `14-Roadmap`;
5. compare os nomes;
6. mova arquivos sem conflito;
7. para nomes iguais, abra e compare o conteúdo;
8. renomeie o arquivo histórico quando necessário;
9. somente depois apague pastas vazias.

### Convenção para histórico

```text
LEGACY-<nome-do-arquivo>.md
```

ou:

```text
<nome-do-arquivo>-superseded.md
```

### Commit

```text
chore: consolidate roadmap documentation
```

---

## 14. Bloco 8 — Investidores, pesquisa e reuniões

Mover:

```text
12-Investors
13-Research
14-Meeting-Notes
```

para:

```text
docs/13-Investors
docs/14-Research
docs/15-Meeting-Notes
```

### Commit

```text
chore: move investors, research and meeting documentation
```

---

## 15. Bloco 9 — Decisões

Mover:

```text
15-Decisions
```

para:

```text
docs/16-Decisions
```

### Commit

```text
chore: move decision records
```

---

## 16. Atualizar o README principal

O `README.md` da raiz deverá possuir uma seção:

```markdown
## Documentation

The official project documentation is available in:

[docs/README.md](docs/README.md)
```

### Commit

```text
docs: link master documentation index
```

---

## 17. Conferência final

No VS Code, confirme:

- todas as pastas documentais estão dentro de `docs`;
- existe apenas uma pasta de roadmap;
- não existem duas pastas com o mesmo número;
- o EIF histórico foi preservado;
- os READMEs abrem;
- o índice mestre existe;
- a raiz contém apenas arquivos gerais e futuras áreas de código.

---

## 18. Conferência no GitHub Desktop

Antes de publicar:

1. percorra a lista de alterações;
2. procure arquivos marcados como deletados;
3. confirme que eles aparecem em novo local;
4. verifique se nenhum documento desapareceu;
5. confira cada commit.

---

## 19. Abrir Pull Request

Depois de todos os commits:

1. clique em `Publish branch`;
2. abra o GitHub;
3. clique em `Compare & pull request`;
4. título:

```text
Reorganize repository documentation structure
```

5. descrição:

```text
Moves all official Higeia documentation into a centralized docs directory, consolidates duplicated roadmap folders, preserves legacy EIF documentation, and standardizes folder numbering.
```

6. revise os arquivos;
7. faça o merge somente após conferir.

---

## 20. Plano de rollback

Se algo der errado antes do commit:

- use `Discard changes` apenas no arquivo ou movimento específico;
- não descarte tudo sem revisar.

Se algo der errado depois do commit, mas antes do merge:

- não faça merge;
- corrija na branch;
- faça novo commit.

Se o merge já aconteceu:

- use `Revert` pelo GitHub;
- não tente reconstruir manualmente sem revisar o histórico.

---

## 21. Critérios de conclusão

A migração será considerada concluída quando:

- branch criada;
- documentação centralizada;
- numeração corrigida;
- roadmaps consolidados;
- EIF preservado;
- índice mestre ativo;
- README principal atualizado;
- pull request revisado;
- merge concluído;
- branch principal íntegra.

---

## 22. Próxima etapa

Após a reorganização:

1. abrir o repositório atualizado;
2. confirmar `package.json`;
3. confirmar Node.js;
4. definir estrutura da aplicação;
5. executar a Sprint 0 técnica.

---

## 23. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 14/07/2026 | Primeiro guia operacional de migração do repositório. |
