export function draw({currentShape, gridSquares, currentPosition, currentColor}) {
  currentShape.forEach(squareIndex => {
      gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${currentColor}`);
  })
}

export function undraw({currentShape, gridSquares, currentPosition, currentColor}) {
  currentShape.forEach(squareIndex => {
    gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${currentColor}`);
  });
}