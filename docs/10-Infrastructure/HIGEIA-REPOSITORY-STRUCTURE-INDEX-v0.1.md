# Higeia — Repository Structure and Documentation Index

**Documento:** Higeia Repository Structure and Documentation Index  
**Versão:** 0.1  
**Status:** Plano estrutural oficial  
**Data:** 14 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Padronizar a estrutura do repositório `eros-platform` antes do início da implementação.

Este documento existe para:

- eliminar pastas duplicadas;
- corrigir numeração conflitante;
- separar documentação de código;
- criar um índice mestre;
- facilitar navegação;
- preparar o repositório para aplicação, banco, testes e automações;
- preservar o histórico já criado.

---

## 2. Situação atual observada

A estrutura atual contém documentação bem organizada, porém apresenta:

- duas pastas de roadmap;
- duas pastas iniciadas por `09`;
- documentação diretamente na raiz;
- uma pasta histórica chamada `06-EIF`;
- ausência de separação formal entre documentação e futuro código.

Esses pontos não impedem o projeto de funcionar, mas devem ser corrigidos antes de o repositório crescer.

---

## 3. Decisão estrutural

A documentação passará a ficar dentro de:

```text
docs/
```

O código e os arquivos operacionais permanecerão na raiz.

Estrutura final recomendada:

```text
eros-platform/
├── apps/
│   └── web/
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   └── hie/
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
├── prisma/
├── scripts/
├── tests/
├── .github/
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

---

## 4. Mapeamento da estrutura atual

| Pasta atual | Pasta recomendada |
|---|---|
| `01-Constitution` | `docs/01-Constitution` |
| `02-Business` | `docs/02-Business` |
| `03-Product` | `docs/03-Product` |
| `04-UX-Design` | `docs/04-UX-Design` |
| `05-Architecture` | `docs/05-Architecture` |
| `06-EIF` | `docs/07-Artificial-Intelligence/Legacy-EIF` |
| `07-Artificial-Intelligence` | `docs/07-Artificial-Intelligence` |
| `08-Data-Model` | `docs/08-Data-Model` |
| `09-Brand-Identity` | `docs/09-Brand-Identity` |
| `09-Infrastructure` | `docs/10-Infrastructure` |
| `10-Security` | `docs/11-Security` |
| `11-Roadmap` | revisar e mesclar em `docs/12-Roadmap` |
| `12-Investors` | `docs/13-Investors` |
| `13-Research` | `docs/14-Research` |
| `14-Meeting-Notes` | `docs/15-Meeting-Notes` |
| `14-Roadmap` | `docs/12-Roadmap` |
| `15-Decisions` | `docs/16-Decisions` |

---

## 5. Regra para a pasta 06-EIF

A pasta `06-EIF` representa uma fase histórica anterior à adoção do nome HIE.

Ela não deve ser apagada.

Recomendação:

```text
docs/07-Artificial-Intelligence/Legacy-EIF/
```

Adicionar um `README.md` explicando:

- EIF foi o nome inicial;
- HIE é o nome atual;
- documentos antigos permanecem para rastreabilidade;
- novas especificações devem usar HIE.

---

## 6. Regra para Roadmap duplicado

Existem duas pastas:

```text
11-Roadmap
14-Roadmap
```

Antes de apagar qualquer uma:

1. comparar os arquivos;
2. mover todos para `docs/12-Roadmap`;
3. renomear arquivos duplicados;
4. conferir no GitHub Desktop;
5. excluir apenas pastas vazias.

Nunca substituir arquivos sem conferir conteúdo.

---

## 7. Índice mestre da documentação

Criar:

```text
docs/README.md
```

Esse arquivo será a porta de entrada da documentação.

Ele deverá conter:

- visão geral;
- mapa de pastas;
- documentos principais;
- ordem recomendada de leitura;
- status dos documentos;
- convenções de versão;
- links relativos.

---

## 8. Ordem recomendada de leitura

### Fundadores e investidores

1. Vision.
2. Founder Decisions.
3. Business Model.
4. Brand Foundations.
5. Roadmap.

### Produto

1. PRD.
2. User Journey.
3. Screen Map.
4. Assessment Specification.
5. Personal Profile Specification.

### Engenharia

1. Technical Architecture.
2. Data Model.
3. Engineering Standards.
4. Sprint 0.
5. ADRs.

### Inteligência artificial

1. Knowledge Model.
2. HIE Architecture.
3. Memory Model.
4. AI Safety and Evaluation.

---

## 9. Convenção de nomes

Formato:

```text
HIGEIA-<DOCUMENT-NAME>-v<MAJOR>.<MINOR>.md
```

Exemplo:

```text
HIGEIA-MVP-PRD-v0.1.md
```

### Estados

- `v0.x`: rascunho em evolução;
- `v1.0`: versão aprovada;
- `v1.x`: ajustes compatíveis;
- `v2.0`: mudança estrutural.

---

## 10. README de cada pasta

Cada pasta deverá possuir um `README.md` com:

- finalidade;
- documentos atuais;
- próximos documentos;
- regras de manutenção;
- links internos.

---

## 11. Documentos ativos e históricos

### Ativo

Documento que orienta decisões atuais.

### Histórico

Documento preservado por rastreabilidade, mas que não orienta mais o projeto.

Documentos históricos devem conter no topo:

```text
Status: Histórico / Substituído
Substituído por: <arquivo>
```

---

## 12. Arquivos que não devem ser movidos para docs

Permanecem na raiz:

- `README.md`;
- `LICENSE`;
- `.gitignore`;
- `.env.example`;
- `package.json`;
- arquivos de configuração;
- código;
- migrations;
- scripts;
- workflows.

---

## 13. README principal do repositório

O `README.md` da raiz deverá explicar:

1. o que é o Higeia;
2. estado atual;
3. estrutura do repositório;
4. requisitos;
5. como rodar;
6. onde está a documentação;
7. como contribuir;
8. segurança;
9. licença.

---

## 14. Plano seguro de migração

### Etapa 1 — Criar branch

```bash
git checkout -b chore/reorganize-repository
```

### Etapa 2 — Criar `docs`

```bash
mkdir docs
```

No Windows, também pode criar a pasta pelo Explorer do VS Code.

### Etapa 3 — Mover uma pasta por vez

Começar por:

```text
01-Constitution
```

Mover para:

```text
docs/01-Constitution
```

### Etapa 4 — Conferir GitHub Desktop

Verificar se os arquivos aparecem como renomeados ou movidos.

### Etapa 5 — Commit por bloco

Exemplo:

```text
chore: move foundation docs into docs directory
```

### Etapa 6 — Repetir

Mover pequenos grupos, sem fazer tudo de uma vez.

### Etapa 7 — Ajustar links

Corrigir links relativos nos READMEs.

### Etapa 8 — Mesclar roadmaps

Somente depois de comparar conteúdos.

### Etapa 9 — Abrir pull request

Revisar antes de mesclar para `main`.

---

## 15. O que não fazer

- não apagar pastas antes de comparar;
- não mover tudo em uma única ação;
- não sobrescrever arquivos com o mesmo nome;
- não reorganizar diretamente sem commit intermediário;
- não usar comandos destrutivos;
- não perder histórico do EIF;
- não misturar reorganização com instalação do Next.js no mesmo commit.

---

## 16. Commits sugeridos

```text
chore: create documentation root directory
chore: move foundation and business docs
chore: move product and UX docs
chore: move architecture and engineering docs
chore: consolidate AI and legacy EIF docs
chore: move data, brand and infrastructure docs
chore: consolidate roadmap documentation
chore: move research, meetings and decisions
docs: add master documentation index
```

---

## 17. Critérios de aceite

A reorganização estará concluída quando:

- todas as pastas documentais estiverem dentro de `docs`;
- não houver numeração duplicada;
- existir apenas uma pasta de roadmap;
- EIF estiver preservado como histórico;
- `docs/README.md` estiver criado;
- links principais funcionarem;
- nenhum arquivo estiver perdido;
- GitHub Desktop não mostrar exclusões inesperadas;
- `main` permanecer íntegra.

---

## 18. Próxima etapa após reorganização

Depois da reorganização:

1. confirmar Node.js;
2. verificar se já existe `package.json`;
3. decidir onde a aplicação ficará;
4. criar `apps/web` ou usar raiz temporariamente;
5. iniciar Sprint 0;
6. configurar Next.js, banco e CI.

---

## 19. Decisão recomendada

Para reduzir risco, a recomendação atual é:

> Reorganizar a documentação primeiro e iniciar a aplicação somente após um commit limpo da nova estrutura.

---

## 20. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 14/07/2026 | Primeira padronização da estrutura do repositório e índice documental. |
