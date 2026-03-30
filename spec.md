# MeFit – Accurate AI Food Recognition Pipeline

## Current State
FoodSnap.tsx and VoiceFoodLogger.tsx both use random/simulated data. No real AI or nutrition API is called. Food detection is entirely fake (random seed from a list). Voice detection uses basic keyword matching without proper speech recognition flow.

## Requested Changes (Diff)

### Add
- `src/frontend/src/services/foodAI.ts` — multi-step AI pipeline service:
  1. Clarifai Food Model (REST API, user-configurable API key stored in localStorage `clarifai_api_key`)
  2. USDA FoodData Central nutrition lookup (public DEMO_KEY, no user setup needed)
  3. Comprehensive Indian + global food fallback database (400+ items) for offline/no-key scenarios
- Confidence score (0–1) returned on every detection; if < 0.80 → show amber warning
- User correction system: corrections stored in localStorage `foodCorrections` map for future lookups
- API key configuration UI in Settings/Profile (Clarifai key field, optional)
- Multi-food detection: return array of detected foods from one image

### Modify
- `FoodSnap.tsx`: replace random seeds with real `analyzeFoodImage(file)` call from foodAI service; show per-item confidence; show multi-food results; manual override fields; retry button
- `VoiceFoodLogger.tsx`: use Web Speech API properly; extract food items from transcript; call `lookupNutrition(foodName)` from the same service; show recognized text before saving; manual fallback
- `userDataStore.ts`: add `getFoodCorrections()` / `saveFoodCorrection()` helpers

### Remove
- `FOOD_SEEDS` random array and all simulated `setTimeout` fake AI from FoodSnap
- Any fake voice keyword-only matching without real speech recognition flow

## Implementation Plan
1. Build `src/frontend/src/services/foodAI.ts` with:
   - `analyzeFoodImage(file: File, clarifaiKey?: string): Promise<FoodDetectionResult[]>` — calls Clarifai, parses labels, maps to USDA nutrition; falls back to local DB
   - `lookupNutrition(foodName: string): Promise<NutritionData>` — calls USDA FoodData Central or local DB
   - `normalizeFoodLabel(label: string): string` — clean Clarifai labels to common names
   - `getLocalNutrition(name: string): NutritionData | null` — Indian + global food DB lookup
2. Rewrite FoodSnap.tsx with real pipeline: upload → loading → Clarifai → USDA → show editable results → save
3. Fix VoiceFoodLogger.tsx: mic permission → SpeechRecognition → extract food names → USDA lookup → show result card → user confirms/edits → save
4. Add API key settings field in ProfileTab.tsx settings section
5. Store user corrections, apply them on future lookups
