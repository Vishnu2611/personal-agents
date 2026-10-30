# RS Layer3 — Skill Repository Catalog (Notion source map)

Mirror of the **RS Layer3-(Skills) Master Prompt Repository** so we can resolve any prompt to
its Notion page without re-searching.

- **Database:** RS Layer3-(Skills) Master Prompt Repository
- **Database ID:** `320b19fd-bedb-8005-bb35-e9bba401e95d`
- **Data source:** `collection://320b19fd-bedb-8031-872f-000b92a46cf9`
- Parent layers: RS Layer1 Connectors Registry · RS Layer2 Tools Registry · **RS Layer3 Skills (this)** · RS Layer4 Playbooks/SOPs

## Prompts in scope for this project (the doc-gen chain)

| Prompt | Latest | Status | Notion page ID |
|---|---|---|---|
| Create Opportunity Packet (from transcript + email) | v1 | Done | `c710132937504365a1794e445e9efe74` |
| **BRD Generator v2 (from Opportunity Packet)** | v2 | In Testing | `379b19fd-bedb-816f-94a2-fd2b757a4b97` |
| **PRD Generator v4 (from Approved BRD + Opportunity Packet)** | v4 | In Testing | `374b19fd-bedb-81f7-a191-e51988db5ed5` |
| PRD Generator (from notes/transcripts/client docs) | v2 | In Testing | `13fafada-a12e-4c7d-ba3c-f053dfde2696` |
| Product POV Generator v1 | v1 | In Testing | `374b19fd-bedb-8181-afef-c94c38c2aed3` |
| **Estimation Generation From PRD** | v1.6 | In progress | `341b19fd-bedb-80f6-aae3-fee1cddfd147` |
| Google Estimation Sheet Extractor | v1 | Done | `3c479281314d453986e70cbc4d1694b6` |
| Feature POV Narrative | v1 | Done | `320b19fd-bedb-80d2-b52f-d64d916fd595` |

### Estimation Agent — version history pages (separate Notion pages)

These appear to be the iteration history / batch variants of the estimation agent. Pulled into
`src/plugins/rs-scoping/prompts/04-estimation-agent/versions/`.

| Version page | Notion page ID |
|---|---|
| estimation-agent-prompt-v1.0-batch | `2d87bd48-88a5-467a-8ef8-52d2894a1879` |
| estimation-agent-prompt-v1.1-batch | `709bbc4a-ddd3-48f6-b39d-e69a93f4f8ef` |
| estimation-agent-prompt-v1_5 | `372b19fd-bedb-808a-aa61-f940b36c2c62` |
| estimation-agent-prompt-v1_6 | `373b19fd-bedb-8076-b553-e41bd90e7a1e` |
| estimation-agent-prompt-v1.6-batch | `373b19fd-bedb-801a-ae62-de5916af0b27` |
| Estimation Agent Prompt (dup) | `4cd59360-7418-472d-8f58-fad90dc133bf` |
| Estimation Agent Prompt (dup) | `36db19fd-bedb-812c-a8c2-e3c4dd2bd0a2` |
| Estimation Agent Prompt (dup) | `cf7e36a1-c39b-4844-83cd-1ab7a156f813` |

### Related reference docs (Google Drive / meeting notes)

| Doc | Link |
|---|---|
| Estimation Agent discussion (2026-04-27, Gemini notes) | https://docs.google.com/document/d/1b7CVfPyZ3AS_-7Hlmn2q-UMolm9q9gkkDTRWnOjZ1SU |
| AI Toolchains Agents Backlog (PDF) | https://drive.google.com/file/d/1cBVa-hpcKE3XcY2iwL_owYiNYOEPV6rf/view |

## All other prompts (mirrored under each owning plugin's `prompts/`)

Page IDs for every remaining skill. Local copies live in `src/plugins/<plugin>/prompts/<skill>/current/`. Entries marked "(pending — stub)" have no prompt body in Notion yet and are listed in the plugin's `prompts/PENDING.md`.

### Discovery & Strategy → `src/plugins/rs-research/prompts/`
| Prompt | Notion page ID |
|---|---|
| Problem Statement Analyzer | `349b19fd-bedb-8094-a345-f737d37b866f` |
| Customer Discovery Question Optimizer | `349b19fd-bedb-80ad-b1c6-e5f0115435cc` |
| Company Research | `349b19fd-bedb-80af-92b2-c5324645da23` |
| Market Analayzer | `349b19fd-bedb-80b8-b547-fc239cdcf75b` |
| Competitive and Market Research | `349b19fd-bedb-80da-91a4-d9251059e80b` |

### Brand / Identity → `src/plugins/rs-design/prompts/`
| RightShift Identity | `349b19fd-bedb-80d5-9023-eadeb5e21190` |

### Build (Prototype → MVP) → `src/plugins/rs-prototype/prompts/` (SaaS UI/UX Designer and Design Reference → CSS Spec: `src/plugins/rs-design/prompts/`)
| Prompt | Notion page ID |
|---|---|
| Prototype TO MVP Feature Generation | `348b19fd-bedb-8016-98e1-e4e594467424` |
| RightShift Feature Generator | `349b19fd-bedb-803a-ac34-d4402277692f` |
| RightShift Spark | `349b19fd-bedb-8081-813e-ce56d004c5d1` |
| RightShift Propel | `349b19fd-bedb-80d0-865d-cbcd4a0dcc01` |
| Next.JS Prototype Generator (v4) | `341b19fd-bedb-805b-ba49-ece20f88114a` |
| HTML Prototype Generator | `364b19fd-bedb-812b-8892-c5d02b7bc971` |
| SaaS UI/UX Designer (Phased Figma, v1.1) | `366b19fd-bedb-81d3-9a18-d352f2a75a33` |
| Design Reference → CSS Spec (Meta-Prompt) | `348b19fd-bedb-8019-87d8-d38bda186ca7` |
| Prototype Feature Audit and Ideation | `348b19fd-bedb-804e-afaf-e373ff9183cc` |

### Engineering → `src/plugins/rs-chatbot/prompts/`
| Chatbot Personality Rulebook | `341b19fd-bedb-80d2-baaa-c7b98e3d8deb` |
| Chatbot Behaviour and Fallback Mechanisms | `342b19fd-bedb-8061-9c9a-ecc324d186bc` |

### GTM / Traction → `src/plugins/rs-content/prompts/`
| Prompt | Notion page ID |
|---|---|
| RightShift Traction | `349b19fd-bedb-801d-a461-fca7efe9eccf` |
| LinkedIn Post Machine (pending — stub) | `2d865261-173a-437d-8bc1-daaf18696b5c` |
| Case Study and Testimonial Generator (v2) | `36db19fd-bedb-8153-b938-fc24c2aa9743` |
| AI Adoption at RightShift — Marketing One-Pager (pending — stub) | `350b19fd-bedb-80ef-8a25-ed42827bd7b0` |
| Speaking Engagement — Pre-Event Email Campaign | `36db19fd-bedb-804d-a1f4-d79ae0bec1a9` |
| Speaking Engagement — RSVP/Attendee Enrichment | `36db19fd-bedb-8099-9d97-e9f6585c791c` |
| Speaking Engagement — Pitch Deck Generator (Phase 1) | `36db19fd-bedb-80a8-9af0-f94763a7e666` |
| Speaking Engagement — Post-Event Email Campaign | `36db19fd-bedb-80c6-bd24-c4391c720a99` |

### Sales / Deal → `src/plugins/rs-sales/prompts/`
| Prompt | Notion page ID |
|---|---|
| Gamma Prototype Proposal Deck Generation (v3) | `341b19fd-bedb-80f2-989d-fc1fcc9ce18f` |
| Startup Pitch Deck Generator (v2) | `348b19fd-bedb-80b6-aa49-c5b0f4f87c8d` |
| Gamma Platform Proposal Generation (pending — stub) | `341b19fd-bedb-8055-af15-fd9913a442db` |
| Contract Creator | `349b19fd-bedb-804e-9f85-c2106b873fa6` |
| Outbound Sales Machine (pending — stub) | `5b9f02bd-e5a1-42ea-a194-75879b8832d4` |

### Delivery Ops → `src/plugins/rs-project-management/prompts/`
| PRD → Linear Sprint Mapper (v3) | `978c3737-b62a-48c2-ab3d-a12ad3ade6a3` |
| Hour Reporting / Invoice Reconciliation (idea — pending, no skill) | `354b19fd-bedb-8016-8a7e-c64733e65c40` |

### Quality / Review → `src/plugins/rs-sales/prompts/` (Executive Summary Evaluator, Pitch Deck Analyzer), `src/plugins/rs-design/prompts/` (Page Design Eval ×2, Figma Page Review), `src/plugins/rs-content/prompts/` (Cross-Page Editorial Audit, Client Communication QA)
| Prompt | Notion page ID |
|---|---|
| Executive Summary Evaluator | `349b19fd-bedb-801a-8b78-c8428f602164` |
| Pitch Deck Analyzer | `349b19fd-bedb-80a1-b3d3-e0707d13efa6` |
| Page Design Evaluation — Generic | `330b19fd-bedb-8113-81b4-c33cecf7a0fb` |
| RightShift Site Design Evaluation | `330b19fd-bedb-8115-b458-dd45ac991b6b` |
| Figma Page Review — vs Brief & Goal | `354b19fd-bedb-818d-9fe6-dbced7f5b07e` |
| Cross-Page Editorial & Consistency Audit | `354b19fd-bedb-81ae-9bae-d2caf07bb878` |
| Client Communication QA (pending — stub) | `325b19fd-bedb-800c-b2f9-e94047d3e09d` |

### Internal Enablement → `src/plugins/rs-content/prompts/`
| Deep Voice Guide (Email + LinkedIn + newsletter) | `ac58e7dd-f070-4804-b490-2434d6c02081` |

### Misc / to identify → removed
| (untitled blank "New page" — stub, no content; local copy deleted) | `36db19fd-bedb-80dc-86ab-ec2c2694a433` |

## Conventions and pipeline context

Each local prompt is one `.md` file: YAML frontmatter (name, notion_page_id, notion_url, version,
status, pulled_on) plus the complete page content verbatim. "Not started" prompts are stubs noting
they have no content yet. The Notion database is the source of truth; local copies are a mirror, so
sync improvements back.

The prompts connect to the doc-gen pipeline (see `docs/PIPELINE.md`):

```
Discovery & Strategy ─► Opportunity Packet ─► BRD ─► PRD ─► Estimation ─► Proposal/Deck (Sales)
        │                                                          │
        └─► Build (Prototype→MVP) ◄── Design refs / Feature audit ─┘
GTM / Traction and Quality / Review wrap around the whole flow.
```
