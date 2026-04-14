# Graph Report - /Users/chimzy/Documents/workspace/xpert  (2026-04-10)

## Corpus Check
- 224 files · ~111,031 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 505 nodes · 615 edges · 66 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `AdminController` - 13 edges
2. `FileProcessorService` - 12 edges
3. `User` - 11 edges
4. `AuthController` - 9 edges
5. `apiCall()` - 7 edges
6. `AiAgent` - 7 edges
7. `AgentController` - 7 edges
8. `PromptEngineService` - 6 edges
9. `UserFactory` - 6 edges
10. `ChatbotKnowledgeController` - 5 edges

## Surprising Connections (you probably didn't know these)
- `apiCall()` --calls--> `toast()`  [EXTRACTED]
  /Users/chimzy/Documents/workspace/xpert/xpert-admin-dashboard/src/lib/apiClient.js → /Users/chimzy/Documents/workspace/xpert/xpert-app/src/lib/apiClient.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (12): AgentWorkspace(), readSession(), apiCall(), del(), get(), patch(), post(), put() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (12): AdminController, AiTimeout, Controller, LibraryController, MfaController, PromptLibrary, PromptLibraryFactory, PromptLog (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (3): getSystemTheme(), resolveTheme(), ThemeProvider()

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (6): DatabaseSeeder, PromptLogFactory, QuotaExceededException, QuotaService, UploadedFileFactory, User

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (3): FileProcessorService, FileUploadController, UploadedFile

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (5): AiTimeoutException, AiUnavailableException, HuggingFaceService, InvalidApiKeyException, RateLimitException

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (2): assignDefaultAgents(), getUserAgents()

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (3): PromptEngineService, PromptTooLongException, TemplateNotFoundException

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (2): Notification, NotificationController

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (3): ChatbotKnowledge, ChatbotKnowledgeController, ChatbotKnowledgeSeeder

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (2): CacheService, PromptCache

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (2): Feedback, FeedbackController

### Community 14 - "Community 14"
Cohesion: 0.36
Nodes (1): AuthController

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (2): AiAgentSeeder, PromptTemplate

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (1): AiAgent

### Community 17 - "Community 17"
Cohesion: 0.38
Nodes (1): AgentController

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (1): UserFactory

### Community 19 - "Community 19"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (1): AiAgentFactory

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (1): FileParseException

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (1): ValidateOrigin

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (1): SecurityHeaders

### Community 24 - "Community 24"
Cohesion: 0.67
Nodes (1): CheckBanStatus

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **2 isolated node(s):** `ChatbotKnowledge`, `Controller`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 43`** (2 nodes): `responses.js`, `getMockResponse()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `templates.js`, `getTemplateByAgentId()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `Tooltip.jsx`, `Tooltip()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `Footer.jsx`, `Footer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (2 nodes): `StatsCard.jsx`, `StatsCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `sanctum.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `logs.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `stats.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `ai_models.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `mail.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `services.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `database.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `session.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `queue.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `cors.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `logging.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `filesystems.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `console.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `web.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `ChatbotKnowledge`, `Controller` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._