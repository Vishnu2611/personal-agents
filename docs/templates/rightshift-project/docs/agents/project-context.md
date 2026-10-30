# Project context

Where this project's shared context lives. Agents read the pages below through the Notion MCP before
planning, specifying or designing work. They are the source of truth: link to them, don't copy their
content into this repo. Fill this in once when the repo is created; keep it identical across the
project's repos except for "This repo".

| What | Notion page |
|---|---|
| Project home | <https://www.notion.so/...> |
| Opportunity Packet | <https://www.notion.so/...> |
| PRD (approved) | <https://www.notion.so/...> |
| Technical Design | <https://www.notion.so/...> |
| Glossary (project-wide) | <https://www.notion.so/...> |
| Decisions / ADRs (project-wide) | <https://www.notion.so/...> |

- **Tracker:** Linear project "<name>", ticket prefix `<PREFIX>` (see `issue-tracker.md`).
- **This repo:** `<client>-<fe|be|infra>`, role `<fe|be|infra>` (as in `.rs-harness.json`).
- **Sibling repos:** `<client>-fe`, `<client>-be`, `<client>-infra`.
- **API contract:** `<client>-be/api/openapi.yaml`.

Delete rows that don't apply. If this project keeps no context in Notion, delete this file: the
skills then work from the repo alone.
