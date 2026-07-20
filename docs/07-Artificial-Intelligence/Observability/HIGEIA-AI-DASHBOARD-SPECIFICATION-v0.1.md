# Higeia — AI Dashboard Specification

**Versão:** 0.1

## 1. Executive Dashboard

### Cards

- Active AI users
- AI executions
- Total AI cost
- Cost per active user
- Safety events
- Open incidents
- Availability
- P95 latency

### Trends

- weekly executions
- weekly cost
- quality score
- safety trend
- incident trend

## 2. Operations Dashboard

- executions by flow
- error rate
- timeout rate
- retry rate
- fallback rate
- provider latency
- queue depth
- version distribution

## 3. Quality Dashboard

- schema pass rate
- evaluation score
- user feedback
- regression failures
- top failure categories

## 4. Safety Dashboard

- events by level
- emergency escalation
- blocked responses
- critical failures
- incidents by version

## 5. Cost Dashboard

- budget vs actual
- forecast
- cost by model
- cost by flow
- cost per user
- retry cost
- anomaly detection

## Regras

- Todos os dashboards devem indicar período.
- Toda métrica deve informar fonte.
- Versões devem ser filtráveis.
- Dados sensíveis não devem aparecer.
