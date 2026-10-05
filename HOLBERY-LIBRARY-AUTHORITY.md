# HOLBERY — Master Library Authority System

**Status: CANONICAL AUTHORITY**

## 1. Authority hierarchy

When sources conflict, use this order:

1. Explicit current decision in DECISIONS.md.
2. Canonical parent definition in HOLBERY-MASTER.md.
3. This Library Authority System for registry, classification, and reuse rules.
4. Canonical architecture, governance, roadmap, and manuals.
5. Project, system, and product records.
6. Evidence records and experiment outputs.
7. Historical archive.
8. Drafts or uncommitted ideas.

A lower source cannot silently override a higher source.

## 2. Canonical record types

Every meaningful reusable object receives one stable ID and one primary category: SYSTEMS, PRODUCTS, VENTURES, COMMERCE, KNOWLEDGE, CAPABILITIES, or ASSETS. Lifecycle is separate.

## 3. Required registry fields

id, name, category, lifecycle, maturity_level, owner, visibility, customer_or_user, problem, purpose, repository_or_location, evidence_refs, rights_status, dependencies, status, next_review, retirement_trigger.

Unknown values use explicit UNASSIGNED, UNVERIFIED, UNKNOWN, or NOT_APPLICABLE.

## 4. Source-of-truth rules

- One canonical record per object.
- README is an index, not a competing authority.
- Roadmap records sequencing.
- Manuals define how work is performed.
- Evidence records what actually happened.
- Archive preserves history but cannot redefine current state.
- Public site exposes only approved truthful summaries.
- Private data and Bozq material remain outside the public Library.

## 5. Intake

For every new idea: search for duplicates, identify reusable capability, assign category, owner, visibility, lifecycle, maturity, rights/data boundary, and next decision.

## 6. Reuse and promotion

Reuse existing Library items by reference. Fork only when ownership, lifecycle, deployment, customer boundary, or economic role materially differs.

Promotion requires the relevant lifecycle gate plus evidence. Naming never upgrades maturity.

## 7. Conflict protocol

Identify both claims, trace authority, create/update a decision when substantive, update dependent canonical documents together, archive superseded material, and run link/status/registry checks.

## 8. Authority states

CANONICAL, ACTIVE, EXPERIMENTAL, HISTORICAL, ARCHIVED, EXCLUDED.

EXCLUDED is valid for private systems such as Bozq.

**Principle:** the Library is the memory and registry of HOLBERY, not a dumping ground.
