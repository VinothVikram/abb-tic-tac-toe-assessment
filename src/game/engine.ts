export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameMode = 'two-player' | 'computer';
export type GameStatus = 'in-progress' | 'won' | 'draw';
export type Move = { number: number; player: Player; index: number };
export type Scoreboard = { xWins: number; oWins: number; draws: number };
export type GameState = { board: Cell[]; currentPlayer: Player; mode: GameMode; status: GameStatus; winner: Player | null; winningCells: number[]; history: Move[]; scores: Scoreboard };
export const WIN_LINES: number[][] = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
export const emptyScores = (): Scoreboard => ({ xWins: 0, oWins: 0, draws: 0 });
export function createGame(mode: GameMode = 'two-player', scores: Scoreboard = emptyScores()): GameState {
  return { board: Array<Cell>(9).fill(null), currentPlayer: 'X', mode, status: 'in-progress', winner: null, winningCells: [], history: [], scores: { ...scores } };
}
export function getWinningCells(board: Cell[]): number[] {
  const line = WIN_LINES.find(([a,b,c]) => board[a] !== null && board[a] === board[b] && board[b] === board[c]);
  return line ? [...line] : [];
}
export function getResult(board: Cell[]): { status: GameStatus; winner: Player | null; winningCells: number[] } {
  const winningCells = getWinningCells(board);
  if (winningCells.length) return { status: 'won', winner: board[winningCells[0]] as Player, winningCells };
  if (board.every(cell => cell !== null)) return { status: 'draw', winner: null, winningCells: [] };
  return { status: 'in-progress', winner: null, winningCells: [] };
}
export function playMove(state: GameState, index: number, player: Player = state.currentPlayer): GameState {
  if (!Number.isInteger(index) || index < 0 || index > 8) throw new Error('Choose a cell inside the board.');
  if (state.status !== 'in-progress') throw new Error('This game is already complete. Start a new game to continue.');
  if (player !== state.currentPlayer) throw new Error(`It is ${state.currentPlayer}'s turn.`);
  if (state.board[index] !== null) throw new Error('That cell is already occupied. Choose an empty cell.');
  const board = [...state.board]; board[index] = player;
  const result = getResult(board);
  const history = [...state.history, { number: state.history.length + 1, player, index }];
  const scores = { ...state.scores };
  if (result.status === 'won') { if (result.winner === 'X') scores.xWins += 1; else scores.oWins += 1; }
  if (result.status === 'draw') scores.draws += 1;
  return { ...state, board, history, status: result.status, winner: result.winner, winningCells: result.winningCells, currentPlayer: result.status === 'in-progress' ? (player === 'X' ? 'O' : 'X') : player, scores };
}
export function chooseComputerMove(board: Cell[]): number {
  const available = board.map((cell, index) => cell === null ? index : -1).filter(index => index >= 0);
  if (!available.length) return -1;
  const findWinningMove = (player: Player) => available.find(index => { const copy = [...board]; copy[index] = player; return getWinningCells(copy).length > 0; });
  const win = findWinningMove('O'); if (win !== undefined) return win;
  const block = findWinningMove('X'); if (block !== undefined) return block;
  if (board[4] === null) return 4;
  const corner = [0,2,6,8].find(index => board[index] === null); if (corner !== undefined) return corner;
  return available[0];
}
export function undoMove(state: GameState): GameState {
  if (state.status !== 'in-progress' || state.history.length === 0) return state;
  const removeCount = state.mode === 'computer' ? Math.min(2, state.history.length) : 1;
  const history = state.history.slice(0, -removeCount);
  const board: Cell[] = Array(9).fill(null);
  history.forEach(move => { board[move.index] = move.player; });
  return { ...state, board, history: history.map((move, index) => ({ ...move, number: index + 1 })), currentPlayer: history.length ? (history[history.length - 1].player === 'X' ? 'O' : 'X') : 'X', status: 'in-progress', winner: null, winningCells: [] };
}
