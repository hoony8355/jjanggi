/* ===========================================================
   JJanggi – Minimal Single‑File Implementation (game.js)
   -----------------------------------------------------------
   전통 장기 9×10 규칙을 간소화해 싱글 PVE(MVP) 구현
   구조: 상수 → 클래스 → 규칙 유틸 → UI/게임루프 → AI
   ===========================================================*/

/* ========== ① 상수 ========== */
const RED = "red";
const BLUE = "blue";

// Board is 9 columns (x 0‑8) and 10 rows (y 0‑9)
// 궁(宮) 좌표 체크용
const PALACE = {
  red: { x1: 3, x2: 5, y1: 0, y2: 2 },
  blue: { x1: 3, x2: 5, y1: 7, y2: 9 }
};

// 기물 초기 배열 [y][x] (null ➔ 빈칸, 문자열 ➔ "rK", "bP" 등)
const INITIAL_POSITIONS = [
  ["bR", "bN", "bB", "bA", "bK", "bA", "bB", "bN", "bR"], // y=0 (Blue back rank)
  [null,  null,  null,  null,  null,  null,  null,  null,  null ], // y=1
  [null,  "bC", null,  null,  null,  null,  null,  "bC", null ], // Cannons
  ["bP", null,  "bP", null,  "bP", null,  "bP", null,  "bP"], // Soldiers
  [null,  null,  null,  null,  null,  null,  null,  null,  null ], // River (y=4)
  [null,  null,  null,  null,  null,  null,  null,  null,  null ], // y=5
  ["rP", null,  "rP", null,  "rP", null,  "rP", null,  "rP"],
  [null,  "rC", null,  null,  null,  null,  null,  "rC", null ],
  [null,  null,  null,  null,  null,  null,  null,  null,  null ],
  ["rR", "rN", "rB", "rA", "rK", "rA", "rB", "rN", "rR"]  // y=9 (Red back rank)
];

// 문자 렌더용, 단촐하게 유니코드 중화 장기말 (간략화)
const PIECE_CHARS = {
  rK: "帥", bK: "將",
  rA: "仕", bA: "士",
  rB: "相", bB: "象",
  rN: "馬", bN: "馬",
  rR: "車", bR: "車",
  rC: "包", bC: "砲",
  rP: "兵", bP: "卒"
};

/* ========== ② 기물 & 보드 클래스 ========== */
class Piece {
  constructor(color, type, x, y) {
    this.color = color;   // red | blue
    this.type = type;     // K, A, B, N, R, C, P
    this.x = x;
    this.y = y;
  }

  // Returns array of {x,y} legal destinations (capture allowed)
  getMoves(board) {
    switch (this.type) {
      case "R": return this.rookMoves(board);
      case "N": return this.horseMoves(board);
      case "C": return this.cannonMoves(board);
      case "P": return this.soldierMoves(board);
      case "K": return this.generalMoves(board);
      case "A": return this.guardMoves(board);
      case "B": return this.elephantMoves(board);
      default: return [];
    }
  }

  rookMoves(board) {
    return this.straightMoves(board, false);
  }

  // Straight‑line helper (rook/cannon plain move)
  straightMoves(board, stopBeforeOwn) {
    const moves = [];
    const dirs = [ [1,0], [-1,0], [0,1], [0,-1] ];
    for (const [dx,dy] of dirs) {
      let nx = this.x+dx, ny = this.y+dy;
      while (board.inBounds(nx,ny)) {
        const target = board.grid[ny][nx];
        if (target) {
          if (target.color !== this.color) moves.push({x:nx,y:ny});
          break; // blocked
        }
        moves.push({x:nx,y:ny});
        nx += dx; ny += dy;
      }
    }
    return moves;
  }

  horseMoves(board) {
    const moves = [];
    const horseSteps = [
      [1,0,  1,1],[ -1,0, -1,1],[1,0, 1,-1],[ -1,0,-1,-1],
      [0,1,  1,1],[ 0,1, -1,1],[0,-1, 1,-1],[ 0,-1,-1,-1]
    ];
    for (const [bDx,bDy,mDx,mDy] of horseSteps) {
      const blockX = this.x + bDx, blockY = this.y + bDy;
      if (!board.inBounds(blockX,blockY) || board.grid[blockY][blockX]) continue;
      const nx = this.x + mDx, ny = this.y + mDy;
      if (!board.inBounds(nx,ny)) continue;
      const target = board.grid[ny][nx];
      if (!target || target.color !== this.color) moves.push({x:nx,y:ny});
    }
    return moves;
  }

  cannonMoves(board) {
    const moves = [];
    const dirs = [ [1,0], [-1,0], [0,1], [0,-1] ];
    for (const [dx,dy] of dirs) {
      let nx = this.x+dx, ny = this.y+dy;
      let jumped = false;
      while (board.inBounds(nx,ny)) {
        const target = board.grid[ny][nx];
        if (!jumped) {
          // 이동 가능한 빈칸
          if (!target) moves.push({x:nx,y:ny});
          else {
            jumped = true; // 첫 말 넘기기
          }
        } else {
          // 한 번 점프 후, 첫 만난 말이 상대면 캡처 가능
          if (target) {
            if (target.color !== this.color) moves.push({x:nx,y:ny});
            break;
          }
        }
        nx += dx; ny += dy;
      }
    }
    return moves;
  }

  soldierMoves(board) {
    const moves = [];
    const forward = this.color === RED ? -1 : 1;
    const nx = this.x, ny = this.y + forward;
    if (board.inBounds(nx,ny) && (!board.grid[ny][nx] || board.grid[ny][nx].color!==this.color)) moves.push({x:nx,y:ny});
    // 강 건넌 뒤
    const riverCrossed = this.color===RED ? this.y<=4 : this.y>=5;
    if (riverCrossed) {
      for (const dir of [-1,1]) {
        const tx = this.x+dir, ty = this.y;
        if (board.inBounds(tx,ty) && (!board.grid[ty][tx] || board.grid[ty][tx].color!==this.color)) moves.push({x:tx,y:ty});
      }
    }
    return moves;
  }

  generalMoves(board) {
    const moves = [];
    const box = this.color===RED?PALACE.red:PALACE.blue;
    const deltas = [ [1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1] ];
    for (const [dx,dy] of deltas) {
      const nx=this.x+dx, ny=this.y+dy;
      if (nx<box.x1||nx>box.x2||ny<box.y1||ny>box.y2) continue;
      const target = board.grid[ny][nx];
      if (!target||target.color!==this.color) moves.push({x:nx,y:ny});
    }
    // 장군 마주보기 이동(기물 없을 시) 제한은 Board 차원에서 필터
    return moves;
  }

  guardMoves(board) {
    return this.generalMoves(board); // 사와 장은 동일 이동 (궁 안 8 방향)
  }

  elephantMoves(board) {
    const moves = [];
    const patterns = [
      [ 1,1, 2,2, 3,1], [ -1,1,-2,2,-3,1],
      [ 1,-1, 2,-2, 3,-1],[-1,-1,-2,-2,-3,-1]
    ];
    for (const [d1x,d1y,d2x,d2y,tx,ty] of patterns) {
      const b1x=this.x+d1x,b1y=this.y+d1y;
      const b2x=this.x+d2x,b2y=this.y+d2y;
      const nx=this.x+tx, ny=this.y+ty;
      if(!board.inBounds(nx,ny)||board.grid[b1y][b1x]||board.grid[b2y][b2x]) continue;
      const t=board.grid[ny][nx];
      if(!t||t.color!==this.color) moves.push({x:nx,y:ny});
    }
    return moves;
  }
}

class Board {
  constructor() {
    // 2D grid [y][x] with Piece objects
    this.grid = Array.from({length:10}, (_,y)=>Array.from({length:9},(_,x)=>{
      const code = INITIAL_POSITIONS[y][x];
      if (!code) return null;
      const color = code[0]==="r"?RED:BLUE;
      const type = code[1];
      return new Piece(color,type,x,y);
    }));
    this.turn = RED; // Red first
    this.selected = null; // currently selected piece
  }

  inBounds(x,y){return x>=0&&x<9&&y>=0&&y<10;}

  /** Return Piece or null */
  pieceAt(x,y){return this.grid[y][x];}

  movePiece(piece, dest){
    const {x,y} = dest;
    const captured = this.grid[y][x];
    // update grid
    this.grid[piece.y][piece.x] = null;
    piece.x = x; piece.y = y;
    this.grid[y][x] = piece;
    // Turn switch
    this.turn = this.turn===RED?BLUE:RED;
    console.debug('[Board] moved', piece.type, 'to', x,y);
    // Check general capture
    if (captured && captured.type==='K') alert(`${piece.color==='red'?'RED':'BLUE'} wins!`);
  }

  // Utility to filter moves that leave generals facing
  legalMoves(piece){
    return piece.getMoves(this).filter(m=> !this.generalsFaceAfter(piece,m));
  }

  generalsFaceAfter(piece,dest){
    // simulate minimal: check if generals on same file without blocking piece
    const clone = JSON.parse(JSON.stringify(this)); // shallow clone grid for check (lightweight since 9x10)
    // remove original piece
    clone.grid[piece.y][piece.x]=null;
    clone.grid[dest.y][dest.x]={color:piece.color,type:piece.type};
    let redGen = null, blueGen=null;
    for(let yy=0;yy<10;yy++){
      for(let xx=0;xx<9;xx++){
        const p=clone.grid[yy][xx];
        if(!p||p.type!=='K')continue;
        if(p.color===RED) redGen={x:xx,y:yy}; else blueGen={x:xx,y:yy};
      }
    }
    if(redGen&&blueGen&& redGen.x===blueGen.x){
      // scan between
      const minY=Math.min(redGen.y,blueGen.y)+1;
      const maxY=Math.max(redGen.y,blueGen.y);
      for(let y=minY;y<maxY;y++) if(clone.grid[y][redGen.x]) return false; // blocked
      return true; // facing each other
    }
    return false;
  }

  generateAllMoves(color){
    const moves=[];
    for(let y=0;y<10;y++) for(let x=0;x<9;x++){
      const p=this.grid[y][x];
      if(p&&p.color===color){
        for(const m of this.legalMoves(p)) moves.push({piece:p,dest:m});
      }
    }
    return moves;
  }
}

/* ========== ③ UI & 게임 루프 ========== */
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
let board;

function initBoardUI(){
  boardEl.innerHTML='';
  for(let y=0;y<10;y++){
    for(let x=0;x<9;x++){
      const cell=document.createElement('div');
      cell.className='cell';
      cell.dataset.x=x; cell.dataset.y=y;
      cell.addEventListener('click',onCellClick);
      boardEl.appendChild(cell);
    }
  }
}

function render(){
  for(const cell of boardEl.children){
    const x=+cell.dataset.x, y=+cell.dataset.y;
    const piece=board.pieceAt(x,y);
    cell.textContent=piece?PIECE_CHARS[piece.color[0]+piece.type]:'';
    cell.classList.toggle('selected', board.selected && board.selected.x===x && board.selected.y===y);
  }
  statusEl.textContent=`Turn: ${board.turn.toUpperCase()}`;
}

function onCellClick(e){
  const x=+this.dataset.x, y=+this.dataset.y;
  const piece=board.pieceAt(x,y);
  if(board.selected){
    // second click: attempt move
    const moves=board.legalMoves(board.selected);
    if(moves.some(m=>m.x===x&&m.y===y)){
      board.movePiece(board.selected,{x,y});
      board.selected=null;
      render();
      if(board.turn===BLUE) setTimeout(aiMove,200); // AI turn
      return;
    }
  }
  if(piece && piece.color===board.turn){
    board.selected=piece;
  }
  render();
}

function aiMove(){
  const moves=board.generateAllMoves(BLUE);
  if(!moves.length){alert('RED wins!');return;}
  const choice=moves[Math.floor(Math.random()*moves.length)];
  board.movePiece(choice.piece,choice.dest);
  render();
}

/* Init */
document.addEventListener('DOMContentLoaded',()=>{
  board=new Board();
  initBoardUI();
  render();
});

/* ========== ④ CSS(임베디드) 빠른 셋업 ========== */
// 아래 CSS를 style.css에 작성하세요 (예시)
/*
#board{display:grid;grid-template-columns:repeat(9,40px);grid-auto-rows:40px;gap:2px;font-size:26px;text-align:center;user-select:none}
.cell{border:1px solid #333;line-height:40px}
.cell.selected{background:#ffeb3b}
#status{margin-top:8px;font-weight:bold}
*/
