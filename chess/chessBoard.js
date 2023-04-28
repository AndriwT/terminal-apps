
const width = 8;
const height = 8;

const topBar = new Array(width + 2).fill("_").join("");

const bottomBar = new Array(height + 2).fill("-").join("");

const board = new Array(height).fill(new Array(width).fill(" "));

const map = {
	0: {
		0: "♜",
		1: "♞",
		2: "♝",
		3: "♚",
		4: "♛",
		5: "♝",
		6: "♞",
		7: "♜",
	},
	1: "♟",
	6: "♙",
	7: {
		0: "♖",
		1: "♘",
		2: "♗",
		3: "♔",
		4: "♕",
		5: "♗",
		6: "♘",
		7: "♖",
	}
	
	
}


function printBoard() {
	process.stdout.write(topBar + "\n");
	for (let i = 0; i < board.length; i++) {
		const row = board[i];
		process.stdout.write("|")

		for (let j = 0; j < row.length; j++) {
			let chessPiece = " ";
			if (map.hasOwnProperty(i)) {
				if (typeof map[i] === "string") {
					chessPiece = map[i];
				} else if (typeof map[i] === "object") {
					chessPiece = map[i][j];
				}
				
			}  else {
				// Do not do nested ternaries
				//chessPiece = i % 2 ? j % 2 ? chessPiece = "x" : chessPiece = " " : j % 2 ? chesPiece = " " : chessPiece = "x";
				if (i % 2) {
					if (j % 2) {
						chessPiece = "x"
					} else {
						chessPiece = " ";
					}
				} else {
					if (j % 2) {
						chessPiece = " "
					} else {
						chessPiece = "x";
					}
				}
				
			}

	

			process.stdout.write(chessPiece);
		}
		process.stdout.write("|");
		process.stdout.write("\n");
	}
	process.stdout.write(bottomBar + "\n");
}




function main() {
	printBoard();
};

main();