import { useMemo, useState } from 'react';
import { Bot, CircleHelp, RotateCcw, RotateCw, Sparkles, Trophy, Users, X, Zap } from 'lucide-react';
import { chooseComputerMove, createGame, emptyScores, playMove, undoMove, type GameMode, type GameState } from './game/engine';

const position = (index: number) => `Row ${Math.floor(index / 3) + 1}, Column ${(index % 3) + 1}`;
export default function App() {
  const [game, setGame] = useState<GameState>(() => createGame('two-player'));
  const [notice, setNotice] = useState('');
  const [showRules, setShowRules] = useState(false);
  const isComputerTurn = game.mode === 'computer' && game.currentPlayer === 'O' && game.status === 'in-progress';
  const progressLabel = game.status === 'won' ? `${game.winner} takes the round!` : game.status === 'draw' ? 'A well-played draw.' : isComputerTurn ? 'Computer is thinking…' : `${game.currentPlayer}'s turn`;
  const progressHint = game.status === 'won' ? 'Victory secured. Start a new round to play again.' : game.status === 'draw' ? 'No spaces left. Ready for a rematch?' : game.mode === 'computer' ? (isComputerTurn ? 'Finding the smartest move' : 'You are X · Computer is O') : 'Two players · One board · Good sportsmanship';
  const scores = game.scores;
  const latestMove = game.history[game.history.length - 1];
  const history = useMemo(() => [...game.history].reverse(), [game.history]);

  function applyHumanMove(index: number) {
    if (game.status !== 'in-progress' || (game.mode === 'computer' && game.currentPlayer !== 'X')) return;
    try {
      let next = playMove(game, index);
      if (next.mode === 'computer' && next.status === 'in-progress') {
        const computerIndex = chooseComputerMove(next.board);
        if (computerIndex >= 0) next = playMove(next, computerIndex, 'O');
      }
      setGame(next); setNotice('');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to make that move.'); }
  }
  function startNewGame(mode: GameMode = game.mode) { setGame(createGame(mode, game.scores)); setNotice(''); }
  function undo() { setGame(undoMove(game)); setNotice(''); }
  function resetScores() { setGame({ ...createGame(game.mode, emptyScores()), scores: emptyScores() }); setNotice('Scoreboard reset for this session.'); }
  const modeChange = (mode: GameMode) => { if (mode !== game.mode) startNewGame(mode); };
  const statusIcon = game.status === 'won' ? <Trophy size={18} /> : game.status === 'draw' ? <Sparkles size={18} /> : game.currentPlayer === 'X' ? <X size={18} /> : <span className="small-o">O</span>;

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top" aria-label="Gridline home"><span className="brand-mark"><span></span><span></span><span></span><span></span></span><span>gridline<span className="brand-dot">.</span></span></a><div className="topbar-right"><span className="live-dot"></span><span>LOCAL SESSION</span><button className="icon-button help-button" onClick={() => setShowRules(v => !v)} aria-label="Toggle game rules"><CircleHelp size={18} /></button></div></header>
    <section className="hero" id="top"><div className="eyebrow"><span className="eyebrow-line"></span> THE CLASSIC, REIMAGINED</div><h1>Think ahead.<br /><span>Make your move.</span></h1><p className="hero-copy">A little strategy goes a long way. Challenge a friend or take on the computer in a game where every square counts.</p></section>
    {showRules && <aside className="rules-panel"><strong>Quick rules</strong><p>Get three marks in a row, column, or diagonal to win. In computer mode, you play X and the computer plays O. Undo is available during an active game only.</p></aside>}
    <section className="mode-switch" aria-label="Game mode"><button className={game.mode === 'two-player' ? 'mode-option selected' : 'mode-option'} onClick={() => modeChange('two-player')}><Users size={17} /> Two players</button><button className={game.mode === 'computer' ? 'mode-option selected' : 'mode-option'} onClick={() => modeChange('computer')}><Bot size={17} /> Play computer <span className="new-tag">SMART AI</span></button></section>
    <div className="game-layout">
      <section className="play-card"><div className="card-topline"><div><span className="section-kicker">CURRENT MATCH</span><h2>{game.mode === 'computer' ? 'Human vs. machine' : 'Friendly face-off'}</h2></div><span className="round-pill"><span className="live-dot"></span> ROUND IN PROGRESS</span></div>
        <div className={`turn-banner ${game.status !== 'in-progress' ? 'finished' : ''}`}><span className="turn-icon">{statusIcon}</span><div className="turn-copy"><strong>{progressLabel}</strong><span>{progressHint}</span></div>{game.status === 'won' && <span className="win-chip">WINNER</span>}</div>
        <div className="board" role="group" aria-label="Tic Tac Toe board">{game.board.map((cell, index) => <button key={index} className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${game.winningCells.includes(index) ? 'winning-cell' : ''} ${latestMove?.index === index ? 'last-move' : ''}`} onClick={() => applyHumanMove(index)} disabled={cell !== null || game.status !== 'in-progress' || isComputerTurn} aria-label={`${position(index)}${cell ? `, ${cell}` : ', empty'}`}><span>{cell}</span>{!cell && game.status === 'in-progress' && !isComputerTurn && <span className="cell-hover" aria-hidden="true">+</span>}</button>)}</div>
        <div className="board-legend"><span><i className="legend-x">X</i> Player X</span><span><i className="legend-o">O</i> {game.mode === 'computer' ? 'Computer' : 'Player O'}</span><span className="move-count">{game.history.length}/9 MOVES</span></div>
        {notice && <div className="notice" role="alert">{notice}</div>}
        {game.status !== 'in-progress' && <div className="result-banner"><span>{game.status === 'won' ? '✦' : '↗'}</span><div><strong>{game.status === 'won' ? `${game.winner} wins this round` : 'It’s a draw'}</strong><p>{game.status === 'won' ? 'Well played. The scoreboard has been updated.' : 'Evenly matched. The scoreboard has been updated.'}</p></div></div>}
        <div className="game-actions"><button className="primary-button" onClick={() => startNewGame()}><RotateCcw size={16} /> New game</button><button className="secondary-button" onClick={undo} disabled={!game.history.length || game.status !== 'in-progress'}><RotateCw size={16} /> Undo {game.mode === 'computer' ? 'turn' : 'move'}</button></div>
        <p className="keyboard-note"><Zap size={13} /> {game.mode === 'computer' ? 'You play as X. The computer prioritises wins, blocks, then strategic spaces.' : 'Take turns with a friend. Every move is recorded below.'}</p>
      </section>
      <aside className="side-column"><section className="score-card"><div className="side-heading"><div><span className="section-kicker">SESSION TOTALS</span><h2>Scoreboard</h2></div><span className="trophy-icon"><Trophy size={18} /></span></div><div className="score-grid"><div className="score-item score-x"><span className="score-symbol">X</span><strong>{scores.xWins}</strong><span>WINS</span></div><div className="score-item score-draw"><span className="score-symbol">＝</span><strong>{scores.draws}</strong><span>DRAWS</span></div><div className="score-item score-o"><span className="score-symbol">O</span><strong>{scores.oWins}</strong><span>WINS</span></div></div><div className="score-footer"><span>{scores.xWins + scores.oWins + scores.draws} completed games</span><button onClick={resetScores}>Reset scores</button></div></section>
        <section className="history-card"><div className="side-heading history-heading"><div><span className="section-kicker">THE PLAY-BY-PLAY</span><h2>Move history <span className="history-count">{game.history.length}</span></h2></div><span className="history-icon"><RotateCw size={17} /></span></div>{history.length ? <div className="history-list">{history.map(move => <div className={`history-row ${move.player === 'X' ? 'history-x' : 'history-o'}`} key={`${move.number}-${move.index}`}><span className="history-number">{String(move.number).padStart(2, '0')}</span><span className="history-player">{move.player}</span><span className="history-position">{position(move.index)}</span><span className="history-check">✓</span></div>)}</div> : <div className="empty-history"><div className="empty-board"><span>X</span><span></span><span>O</span><span></span></div><strong>No moves yet</strong><p>Your game story will appear here, one move at a time.</p></div>}<div className="history-footer"><span className="history-dot"></span> {game.history.length ? 'All moves recorded' : 'Waiting for the first move'}</div></section>
        <div className="tip-card"><span className="tip-spark"><Sparkles size={17} /></span><div><strong>Think two moves ahead</strong><p>Control the centre early, but keep an eye on both diagonals.</p></div></div></aside>
    </div>
    <footer className="footer"><span>GRIDLINE <span className="footer-dot">•</span> TIC TAC TOE</span><span>BUILT WITH REACT + TYPESCRIPT</span><span>GOOD GAMES ARE MADE ONE MOVE AT A TIME.</span></footer>
  </main>;
}
