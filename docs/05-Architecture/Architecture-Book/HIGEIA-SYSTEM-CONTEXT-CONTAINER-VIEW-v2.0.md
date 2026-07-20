# Higeia — System Context and Container View

## Context

External actors:

- Nutritionist
- Patient
- Operations
- Governance
- AI Provider
- Email Provider
- Monitoring Provider

## Containers

### Web Application

Interfaces para profissional e paciente.

### Application API

Regras de negócio, autorização e orchestration.

### Relational Database

Dados estruturados.

### Object Storage

Fotos e arquivos.

### Background Worker

Tarefas assíncronas.

### AI Provider Adapter

Abstração dos provedores de IA.

### Observability Stack

Logs, métricas, traces e alertas.

## Main rule

No external provider should receive more data than necessary.
