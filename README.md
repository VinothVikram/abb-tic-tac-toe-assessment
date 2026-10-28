# Gridline — Tic Tac Toe

A polished, responsive Tic Tac Toe assessment implementation built with React, TypeScript, Vite, and Vitest. It supports two-player play, a priority-based computer opponent, move history, undo, win/draw detection, and a session scoreboard.

> **Scope clarification:** This submission is intentionally frontend-only because the assessment contact clarified that a backend is not required. The provided brief contains conflicting framework references (Angular in some sections, React.js in the Technology Expectations section); this implementation follows the explicit React.js stack. Game rules and state transitions live in a framework-independent game engine, so they can later be moved behind REST endpoints without rewriting the UI. The scoreboard is session-local and is not server-backed or shared across browser sessions.

## Features

- 3 × 3 board with accessible cell labels and highlighted winning cells.
- Two-player mode and Play Against Computer mode (human X, computer O).
- Turn indicator, win/draw messaging, and prevention of moves after completion.
- Move history with move number, player, and human-readable row/column position.
- Undo removes one move in two-player mode and the last human/computer pair in computer mode.
- Session scoreboard for X wins, O wins, and draws. Score is incremented once when a game first completes.
- Reset Game preserves the scoreboard; Reset Scoreboard clears session totals.
- Computer priority: win if possible → block X's win → take center → take a corner → first available cell.
- Responsive dark UI, focus-visible keyboard styling, reduced-motion support, and no backend dependency.

## Tech stack

- React 18
- TypeScript (strict mode)
- Vite
- Vitest + Testing Library dependencies for automated testing
- Lucide React icons

## Requirements

- Node.js 20 or later recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`). Open it in a browser.

## Build for production

```bash
npm run build
```

The static production bundle is written to `dist/`.

## Run tests

```bash
npm test
```

Tests cover initial state, valid and invalid moves, turn switching, row/column/diagonal wins, draw detection, scoreboard updates, moves after completion, undo in both modes, and computer move selection.

## Architecture

```text
src/
  game/
    engine.ts        # Pure types and game rules/state transitions
    engine.test.ts   # Game-engine unit tests
  test/
    setup.ts         # Testing Library setup
  App.tsx            # UI and user interaction orchestration
  main.tsx           # React entry point
  styles.css         # Responsive visual system
```

The `game/engine.ts` module is deliberately independent of React. Its functions validate moves and return new state rather than mutating the existing state. This makes the core rules straightforward to test and easier to migrate into a backend service if required.

## Design decisions and assumptions

1. **Frontend-only scope:** Per clarification, there is no .NET service, REST transport, or database in this version. Game state is held in React state and resets on page reload.
2. **React over Angular:** The brief lists React.js under Technology Expectations but mentions Angular in some functional sections. React.js is treated as authoritative because it appears in the explicit stack.
3. **Session scoreboard:** Scores live in the current in-memory app session. Starting a new game preserves scores; resetting the scoreboard clears them.
4. **Undo after completion:** Undo is disabled after a win or draw (Clarification 2, Option A), so a recorded result cannot be reversed and counted twice.
5. **Computer mode:** The human plays X and the computer plays O. The computer follows the specified deterministic priority order. It is a basic rule-based opponent, not a minimax-perfect AI.
6. **Computer-mode undo:** Undo removes the last two moves (human and computer) when available. It is disabled after game completion.
7. **No API contract implemented:** REST endpoints are not included because a backend was explicitly ruled out. If backend work is reinstated, the UI can call a game service that mirrors the engine's state contract.

## API / backend note

No API endpoints are implemented in this frontend-only deliverable. If the original backend requirement is later reinstated, a suggested contract is:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/games` | Create a game |
| GET | `/api/games/{id}` | Retrieve game state |
| POST | `/api/games/{id}/moves` | Submit a move |
| POST | `/api/games/{id}/undo` | Undo a move / move pair |
| POST | `/api/games/{id}/reset` | Start a fresh game while retaining scores |
| GET | `/api/scoreboard` | Retrieve scoreboard |
| POST | `/api/scoreboard/reset` | Reset scoreboard |

The backend should own validation, move history, status, computer move selection, and score updates; the frontend should render the returned state.

## AI-assisted development notes

AI assistance was used to help structure the requirements into implementation tasks, draft a pure game engine, scaffold the React interface, and propose tests and documentation. The implementation should be reviewed and understood by the candidate before submission. In particular, be prepared to explain:

- Why game rules are isolated from the UI.
- How win lines are evaluated and how draws are detected.
- Why state updates are immutable.
- How the computer prioritises a win, a block, center, corners, and fallback cells.
- Why scoreboard changes happen only when a move transitions an active game into a completed state.
- Why undo is disabled after completion and how computer-mode undo removes a pair.
- The trade-off of a session-local scoreboard versus backend-owned persistent state.

Example prompts used:

- “Translate this Tic Tac Toe assessment into a feature checklist, state model, edge cases, and test plan.”
- “Implement pure TypeScript functions for move validation, win/draw detection, priority-based computer moves, and undo behavior.”
- “Create a responsive React UI that renders the authoritative game state and move history accessibly.”
- “Write unit tests for the acceptance criteria, including invalid moves and completed-game behavior.”

## Known limitations

- No backend, REST calls, persistent storage, or cross-device scoreboard.
- Reloading the page resets the current game and scoreboard.
- The computer uses the required priority heuristic and can be beaten; it is not an unbeatable solver.
- The UI is designed for local assessment review and has no authentication or multiplayer networking.

## Future improvements

- Add the .NET REST API and backend unit tests if backend scope is reinstated.
- Persist scoreboard/session data using a backend or optional browser storage.
- Add minimax difficulty levels, replay controls, and match statistics.
- Add CI checks and deployment preview.

## Assessment review checklist

- [ ] `npm install` completes successfully.
- [ ] `npm run dev` launches the app.
- [ ] Two-player mode alternates turns and detects all win patterns.
- [ ] Computer mode follows the specified priority rules.
- [ ] Undo, resets, move history, and scoreboard behave as documented.
- [ ] `npm test` and `npm run build` pass.
