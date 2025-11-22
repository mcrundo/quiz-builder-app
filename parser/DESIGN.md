## Data Flow

```
┌──────────────┐
│  Input DOCX  │
│  File        │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 1. DocumentParser.parse()                │
│    - Opens DOCX file                     │
│    - Extracts paragraphs                 │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 2. QuestionExtractor.extract_questions() │
│    - Identifies question paragraphs      │
│    - Identifies choice paragraphs        │
│    - Groups into question blocks         │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 3. Model Validation                      │
│    - Creates Choice objects (A, B, C, D) │
│    - Creates Question objects            │
│    - Creates Quiz object                 │
│    - Validates structure                 │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 4. JSON Serialization                    │
│    - Quiz.model_dump_json()              │
│    - Pretty-printed output               │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────┐
│ Output JSON  │
│ File         │
└──────────────┘
```
