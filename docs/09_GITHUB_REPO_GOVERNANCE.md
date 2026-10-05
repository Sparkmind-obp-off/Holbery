# 09 — GITHUB REPOSITORY GOVERNANCE

## Repository
`Sparkmind-obp-off/Holbery`

## Role
This repository is the canonical implementation home for the public HOLBERY parent-brand system and associated shared architecture.

## Recommended top-level structure
```
/
├── README.md
├── docs/
├── apps/
├── packages/
├── infra/
├── scripts/
├── tests/
└── .github/
```

Only create directories when the implementation needs them.

## Branching
Preferred:
- `main` — production / canonical
- feature branches — isolated changes

## Commit language
Use clear, imperative commits such as:
- `docs: establish holbery master brand architecture`
- `feat: add portfolio registry`
- `fix: normalize order state mapping`

## Pull request expectation
Every substantial change should explain:
- what changed
- why
- impact on parent/child architecture
- testing performed
- migration / rollout considerations

## Secrets
Never commit:
- API keys
- payment credentials
- private tokens
- production database passwords
- customer exports
- personal credentials

## Documentation rule
Architecture decisions that affect multiple child brands must be documented before or alongside implementation.

## Source-of-truth rule
A decision is not considered operationally real merely because it exists in chat. Important permanent decisions belong in the repository documentation.
