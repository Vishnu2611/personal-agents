# Changelog

All notable changes to the RightShift rs-* plugins, versioned from Conventional Commits.
This version is the single source of truth for both the plugin and the npm package (see docs/SOP.md).

## [4.0.0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v3.0.0...v4.0.0) (2026-10-13)

### ⚠ BREAKING CHANGES

* **rs-delivery:** ship with gstack /ship and Matt's pr, drop superpowers

### Features

* **rs-content:** add follower-ignition skill ([#5](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/issues/5)) ([87c8108](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/87c8108616350918a209e73dccccdbd782825de9))
* **rs-delivery:** add PreToolUse guards for dangerous git and verify receipts ([27a27c9](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/27a27c965091301326dbe717cd96327ab53974c6))
* **rs-delivery:** add rs-doctor dependency check and pins ([8811068](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/881106854df5ad3f7d66c56873c3bd8ee71a6f4b))
* **rs-delivery:** add the review stage and debugging rule ([7d204f8](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/7d204f88d5171179e80f377c8b27ad578632d157))
* **rs-delivery:** build with /implement or /to-tickets + /implement-spec ([5c1eb26](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/5c1eb263a0168d5bf740960bf5c9a5f33f0d7ac2))
* **rs-delivery:** gate ticket-branch PRs on prototype approval and QA receipt ([4070ae4](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/4070ae4c75acbe31431336c87d801391b67a893f))
* **rs-delivery:** implement with mattpocock-skills:tdd at agreed seams ([1ad867c](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/1ad867c8f8a40df95a82b1f5b768f3dec1080fb8))
* **rs-delivery:** make /grill-with-docs the single-feature front door ([259e59a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/259e59a6b03a88400a7496ab998ac3872ca7cf56))
* **rs-delivery:** ship with gstack /ship and Matt's pr, drop superpowers ([1a6889b](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/1a6889b0b50542e8f64430996782392bd69cbf72))
* **rs-guard:** add rs-doctor --install and npx rightshift-skills doctor ([d792a2c](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d792a2cb8c7d656b1ee9bd35ace9f7a3971c49c3))
* **rs-guard:** move the enforcement hooks into a dependency-free plugin ([ff2852a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ff2852a50dd25d1bea781a86d12d54262178b1ca))
* **rs-guard:** require a clean gstack /review on the current code before a PR ([34d5574](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/34d5574e36607652f198b80f11648ff8c7116422))
* **rs-guard:** show the gstack /review verdict in rs-receipt status ([a038526](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/a038526ace1f6646cc427dcecbcbf3279f34b88f))

### Bug Fixes

* **rs-guard:** gate `gh pr ready` like a non-draft `gh pr create` ([adf7b3e](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/adf7b3ec470b83d351ecc11d7b7df101554821e7))
* **rs-guard:** make rs-doctor --install wait for the answer and use the Claude config dir ([8003ba6](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/8003ba6440a905a47b0d5e98585c187d75f57cbb))

### Prompt / Skill changes

* **rs-delivery:** spec-generator tasks are RED -> GREEN at agreed test seams ([afdef8d](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/afdef8d55f52adbbde2323646028c9f6493b60da))
* **rs-delivery:** spec-generator v3 reads the /to-spec spec in single-feature mode ([f1a48eb](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/f1a48eb261cbc8e2a09c06992a2f101d172503e6))

### Documentation

* **rs-delivery:** document the enforced gates and required tools ([923337c](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/923337c8220aacfd9ad1bf2c3daa92f09d46e2db))
* **template:** ship Matt Pocock's skills setup pre-filled ([6a91afe](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/6a91afe7c8bba08d0cc879296df3e4901deb9697))

### Build / Tooling

* **tools:** ship plugin hooks/ and verify hooks.json ([7d8f9be](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/7d8f9be81a531e1736ee009fe967d1244faf18a7))
## [3.0.0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v2.4.0...v3.0.0) (2026-10-01)

### ⚠ BREAKING CHANGES

* rightshift-doc-gen, chatbot-forge and delivery-agent no longer exist;
  install rs-scoping, rs-qa, rs-delivery, rs-chatbot, rs-common, rs-product instead.

### Features

* add product-management skills area with product-thinking-course ([8b9375b](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/8b9375b05da549fdedb05fb7b420129ba4a9c240))
* **rs-content:** add rs-content plugin with 5 skills ([751bb44](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/751bb448e89974bcfe2004261a45800a1ceed361))
* **rs-design:** add rs-design plugin with 6 skills ([f58b777](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/f58b7776714e65dff642b800cf0756ffed7cc747))
* **rs-project-management:** add plugin; wrap chatbot prompts and formatting standard ([27f4031](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/27f403128d494077e060ae709c0d0e136458be03))
* **rs-prototype:** add rs-prototype plugin with 7 skills ([4b4b728](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/4b4b728f017caec64d2f3b4fb1b5516b72cca1bf))
* **rs-research:** add rs-research plugin with 5 skills ([a47268d](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/a47268dda6df2e4653cb6ddfa08f6c6c42e4b2ec))
* **rs-sales:** add rs-sales plugin with 5 skills ([fc53db8](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/fc53db8905bc18d53055d74be24d2a82c42cae5f))
* **rs-scoping:** wrap opportunity-packet, feature-pov-narrative, google-estimation-sheet-extractor ([8039cad](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/8039cad980c78c053c06a2fc43ee0d6cb3711705))

### Bug Fixes

* harden verify_plugins.py (rs- prefix, block-scalar frontmatter, malformed JSON) ([0dac35f](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/0dac35f301d9865cac5071ceaabc7896bd753452))
* **orchestrator:** run SDK pipeline from repo root ([837f95b](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/837f95bbe679474176194693b6c412b26bf0e887))
* repoint installer, orchestrator, delivery skills and project template at rs-* plugins ([af7db1a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/af7db1a5fccc0d49f3f1ab3ef081514738bfcd7a))
* **rs-delivery:** rename delivery-agent namespace and install ids to rs-delivery ([6d08c44](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/6d08c441391e37162ff95a9ad36ecbf2c7da9b8d))
* **rs-delivery:** sync generated README capitalisation ([18330fc](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/18330fc7874ad60d2cdc8789bfa35bdb219bfcfc))
* **rs-design:** usage notes in rightshift-site-design-evaluation are operating rules ([0faba27](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/0faba2714f431ff230453978dcaaf5d7faf7fb5e))
* **rs-research:** stop problem-statement-analyzer before appended pitch-deck prompt ([012c740](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/012c740d76d4685162dd451a0b8bf5eeb8867761))
* **rs-scoping:** depend on rs-common for d2-diagrams ([ea588c5](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ea588c57f669a2270353d9d308c7c4364c46bf9f))
* **spec-generator:** rename delivery-agent references to rs-delivery in prompt ([bcc7fd6](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/bcc7fd662bb74e75e05773eef5a36acd5e020680))
* **sync:** treat staged and untracked plugins/ changes as dirty ([d55f6cd](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d55f6cd50fc7012b1bd5ec8c680fd63c2b12e830))

### Prompt / Skill changes

* add consolidated reading list to product-thinking-course ([d1a05fb](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d1a05fbf72e43b62c1a1fba857bd6345483a8570))
* deliver course reading as spoken content, not evaluator notes ([828a26c](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/828a26cdc31580a0ad944352a642b4722663f7f5))

### Documentation

* add AGENTS.md/CLAUDE.md/.gitignore to rightshift-project template, enable delivery-agent ([ec80751](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ec807516338b5e90b040ffe49ef44c48e4a9ed30))
* design doc for rightshift-project template agent-orientation files ([d679630](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d679630ff15d74c895229eb777fd95cd7f4f0ff4))
* design spec for rs-* plugin taxonomy migration ([463e2a1](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/463e2a157dd000b150531385abeea24871595c64))
* document rs-* plugin taxonomy, install and update flow ([c72fc4f](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/c72fc4fb7a971765ebebb939dd4b55d49367489e))
* fix SOP/DEPLOYMENT nits and note unpinned marketplaces ([5de2dcd](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/5de2dcdb3166e75fe61224d49fe01084c3d20ce7))
* implementation plan for rs-* plugin taxonomy migration ([89c6ed6](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/89c6ed691b862c1ce0bcd2e002872743ef286b83))
* pin rightshift marketplace to v3 for the rs-* plugins ([d9c6f3d](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d9c6f3dc32f2136a94efda0476d2e9065adbc8c3))
* **rs-chatbot:** fix install command ([9786976](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/978697606200bff52f386756b0e85978eb3fd4e9))

### Refactors

* split rightshift-doc-gen, chatbot-forge and delivery-agent into rs-* plugins ([2d51c17](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/2d51c17c52d21608516a42a43b88d34384c44220))

### Build / Tooling

* accept the prompt commit type in commitlint ([b6379d9](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/b6379d9ee230474c8d26c0d7dd5d93421190e2c5))
* add sync_plugins.py generator for src/plugins -> plugins ([ff132fe](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ff132fe71ada86c73c087e4ffdec7265900725a8))
* add verify_plugins.py for the rs-* plugin tree ([2558c4a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/2558c4a7816bf89acef85f31d54f20b17e3be2b8))
## [2.4.0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v2.3.0...v2.4.0) (2026-08-06)

### Features

* add delivery-agent kickoff skill — branch router ([26d3c0e](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/26d3c0e909f7e41d86867c03125df9b4abac26b0))
* add hard prototype-approval gate to delivery-agent ([4c46c53](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/4c46c53965114ceb80c259f4754b2e1ff36ad2d9))
* delivery-agent depends on rightshift-doc-gen, add kickoff skill entry ([7edfd4a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/7edfd4ac674555c37a324f30ffdc77186769a664))
* make BRD optional in the PRD generator (v7) ([b0a33f2](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/b0a33f264907de281cf805d25b26935736cd6ce6))
* promote Spec Generator v2 — Kiro-independent, TDD-driven tasks ([791f964](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/791f964c0cbe9082dc660ff480ada163cb271c8a))

### Bug Fixes

* final-review findings — cross-branch consistency + svg gitignore ([f178466](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/f178466ee0706bbd1037df66a5f9659d940ca3a2))
* plan's Task 4 wrongly committed gitignored diagram renders ([d8497d4](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d8497d4722ca8510909d398062edff15eee0b87b))

### Documentation

* design doc for TDD-driven, Kiro-independent specs + branched delivery-agent ([a6f66b6](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/a6f66b6b618328573e7fe2f2129d9f0b232082c3))
* drop remaining Kiro references, re-render pipeline-workflow diagram ([ad56471](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ad56471fb63b637017e5c90b55ab6142ca62197c))
* implementation plan for TDD-driven, Kiro-independent specs + branched delivery-agent ([6e86ab3](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/6e86ab36fe1938dbaedd33449ed244335885fcd7))
* rewrite delivery-agent README for the New application / Single ([91ae96a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/91ae96a697211991a2eb6382ebe34121517dfd30))
* update spec-generator README for v2 (Kiro-independent, TDD tasks) ([0691d5d](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/0691d5d4194e891a1730483f414491431882d85c))

### Build / Tooling

* point SPEC_SRC at spec-generator v2, sync + update SKILL.md ([98de10a](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/98de10a9871ceafd29713b51ce6495a8e022bd9b))
## [2.3.0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v2.2.0...v2.3.0) (2026-08-05)

### Features

* add design-guidelines and feature-design-brief skills to delivery-agent ([a261cf0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/a261cf0cee2b4e059c3e47138f2afb2f1828d594))
## [2.2.0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v2.1.0...v2.2.0) (2026-07-31)

### Features

* add delivery-agent ticket-to-PR pipeline plugin ([ca34ae3](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ca34ae3a800362589a902b44c34853198b0fb62f))
## [2.1.0](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v2.0.1...v2.1.0) (2026-07-24)

### Features

* ship chatbot-forge dev-server/proxy templates and richer branding config ([5ed3cd1](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/5ed3cd17c5e7ac0735f9ab862c90bd29cba44790))

### Documentation

* bump template marketplace pin to v2.0.1 ([2608fe2](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/2608fe2080dc5e9bd4c5efd4edeaa4146bf2a996))
* pin consumers to the v2 moving major tag ([ce7383f](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/ce7383ff935b9148e8b190e5e69c8928a1065f7a))
* rewrite template README as an end-user add/update guide ([323e987](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/323e9877d02d2c7f3804f51370212f3078e8a272))
## [2.0.1](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/compare/v2.0.0...v2.0.1) (2026-07-24)

### Bug Fixes

* chatbot-forge plugin manifest author must be an object ([9165765](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/9165765df92e9434aa669e10da8d0b72077687e8))
## 2.0.0 (2026-07-24)

### Features

* add chatbot-forge plugin to the marketplace ([b8dc1f5](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/b8dc1f54d2b42862443d9ab3b15384bba8b9a3d7))
* add plugin and npm distribution layer ([9b3aed3](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/9b3aed34dfdf0d7c61e06ae7e58af94241370c20))
* add spec-generator skill and related resources ([336268b](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/336268b59cdb63f1279dd77ab8275cd7270eb7b0))

### Documentation

* add pinned project-template config for the marketplace ([c3c5f9e](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/c3c5f9ef365386ad6061baba0307fb346e88253e))
* relocate pipeline and workflow docs into docs/ ([97b67cf](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/97b67cfa074bc013a0552e05ba7fdb4781620f15))

### Refactors

* move dev sources under src/ and renumber pipeline agents ([89d7d60](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/89d7d60a21e8f2dd4d32d80a30761912e7cc3b95))
* source chatbot-forge under src/, generate its plugin dir via make sync ([d425ce3](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/d425ce37b0d1d391219fb82a768604ad9c7f6f11))
* update diagram standards and rendering instructions in prompt.md ([9846664](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/9846664bf81d83350cfa696745f4a637984fb736))

### Build / Tooling

* enforce conventional commits via commitlint, husky, commit-and-tag-version ([33b6ec5](https://github.com/IntuitioLabsLLC/rightshift-managed-agents/commit/33b6ec53f1239c9241aeebb7882e3b2e62f03de2))
