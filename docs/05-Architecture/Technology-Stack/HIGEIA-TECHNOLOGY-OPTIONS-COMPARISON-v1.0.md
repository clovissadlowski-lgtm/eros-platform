# Higeia — Technology Options Comparison

## Backend

| Option | Strength | Weakness | Decision |
|---|---|---|---|
| NestJS/TypeScript | Uma linguagem, modularidade, boa contratação | Disciplina arquitetural necessária | Recommended |
| FastAPI/Python | Ótimo ecossistema de IA, simples | Duas linguagens e maior fragmentação | Alternative |
| Next.js-only backend | Início muito rápido | Risco de acoplar lógica sensível à interface | Not preferred |
| Java/Spring | Maturidade enterprise | Equipe e custo maiores para o Alpha | Deferred |

## Cloud

| Option | Strength | Weakness | Decision |
|---|---|---|---|
| AWS São Paulo | Região local e serviços completos | Complexidade e custo | Recommended |
| Supabase | Velocidade e simplicidade | Dependência de plataforma e análise regional | PoC alternative |
| Vercel + managed DB | Excelente frontend DX | Fragmentação de controles e região | Not primary |
| Self-hosted VPS | Baixo custo aparente | Maior risco operacional | Rejected |

## Authentication

| Option | Strength | Weakness | Decision |
|---|---|---|---|
| Cognito | Integração AWS, serviço gerenciado | UX/configuração pode ser complexa | Recommended |
| Auth0 | Ótima experiência e recursos | Custo e fornecedor adicional | Alternative |
| Custom auth | Controle | Alto risco | Rejected |

## AI

| Option | Strength | Weakness | Decision |
|---|---|---|---|
| OpenAI API via adapter | Capacidade e velocidade de experimentação | Transferência a terceiro e dependência | Initial provider |
| AWS Bedrock via adapter | Integração AWS e variedade de modelos | Disponibilidade/custo por região deve ser validada | Alternative |
| Self-hosted model | Controle | Custo e operação elevados | Deferred |
