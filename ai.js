export function aiTurn(board, owner, movePiece, onComplete) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece && piece.owner === owner) {
        const targets = [
          [r + 1, c], [r - 1, c],
          [r, c + 1], [r, c - 1]
        ];
        for (let [tr, tc] of targets) {
          if (
            tr >= 0 && tr < 10 && tc >= 0 && tc < 9 &&
            (!board[tr][tc] || board[tr][tc].owner !== owner)
          ) {
            if (movePiece(r, c, tr, tc)) {
              onComplete();
              return;
            }
          }
        }
      }
    }
  }
  onComplete();
}
