# Higeia — AI Decision Authority Matrix

**Versão:** 0.1

| Decision | Low | Medium | High | Critical |
|---|---|---|---|---|
| Prompt change | AI Owner | AI + Product | AI + Product + Safety | AI + Safety + Clinical/Privacy + Founder when applicable |
| Model change | AI Owner | AI + Engineering | AI + Engineering + Safety | AI + Engineering + Safety + Privacy + Founder |
| Production release | Engineering | Engineering + Product | Product + AI + Engineering | Product + AI + Engineering + domain owner + Founder when applicable |
| Rollback | Engineering | Engineering/Operations | Engineering + Operations | Immediate containment by Engineering/Operations; post-review mandatory |
| Vendor approval | Owner | Owner + Security | Security + Privacy + Finance | Security + Privacy + Legal + Founder |
| Clinical content | Clinical | Clinical + Product | Clinical + Safety | Clinical + Safety + Founder when strategic |
| Exception | Domain Owner | Domain + Product | Domain + Founder | Founder + affected domain owners |

## Regras

- A matriz é inicial.
- Sempre prevalecem safety, segurança, privacidade e obrigação legal.
- Contenção urgente não deve aguardar reunião.
