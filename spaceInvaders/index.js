const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const MAGIC_CHARACTER = "\x1Bc";

let score = 0;

const HEIGHT = 24;
const WIDTH = 24;
const PADDING = 6;
const V_PADDING = 4;

let ENEMY_SPEED = 1;
let enemyXDirection = ENEMY_SPEED;

let ENEMY_TICK_SPEED = 800;
let ENEMY_SHOOT_PROB = 0.1;

 
function createBoard() {
	return new Array(HEIGHT).fill(JSON.stringify(new Array(WIDTH).fill(" "))).map(item => JSON.parse(item));

}

let board = createBoard();

function sleep(time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, time)
	}) 
	
}

class Player {
	maxLives = 3;
	lives = ["♁","♁","♁"];
	icon = "♁";
	y = HEIGHT - 2;
	x = WIDTH / 2;
}

const player = new Player();


class Projectile {
	icon = "⚬";
	x = 0;
	y = 0;

	constructor(x, y, icon) {
		this.x = x;
		this.y = y;
		this.icon = icon;
	}
}
const projectiles = [];
const enemyProjectiles = [];

class Enemy {
	icon = "☿";
	x = 0;
	y = 0;
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const enemies = [];

function createEnemies() {
	
	for (let i = 0; i < 4; i++) {
		const arr = [];
		for (let j = 0; j < WIDTH; j++) {
			if (j >= PADDING && j < WIDTH - PADDING) {
				arr.push(new Enemy(j, i + V_PADDING));
			}
		}
		enemies.push(arr);
	}
}

function printBoard() {
	const str = board.map(row => row.join("")).join("\n");
	process.stdout.write(MAGIC_CHARACTER + str);
}

function checkProjectileCollision() {
	for (let i = 0; i < projectiles.length; i++) {
		const projectile = projectiles[i];
		
		for (let j = 0; j < enemies.length; j++) {
			for (let k = 0; k < enemies[j].length; k++) {
				const enemy = enemies[j][k];
				
				if (enemy.x === projectile.x && enemy.y === projectile.y) {
 					enemies[j].splice(k, 1);
					k--;
					projectiles.splice(i, 1);
					i--;
					
					score++;
				}
			}
		}
	}
}


let shouldMoveDown = false;

function updateEnemyPosition() {


	
	
	for (let i = 0; i < enemies.length; i++) {
		let shouldBreak = false;
		for (let j = 0; j < enemies[i].length; j++) {
			if (enemies[i][j].x >= WIDTH - 1) {
				if (shouldMoveDown) {
					enemyXDirection = -1 * ENEMY_SPEED;
					shouldMoveDown = false;
				} else {
					shouldMoveDown = true;
				}

				shouldBreak = true;
				break;	
			}

			if (enemies[i][j].x <= 0) {
				if (shouldMoveDown) {
					enemyXDirection = ENEMY_SPEED;
					shouldMoveDown = false;
				} else {
					shouldMoveDown = true;
				}
				shouldBreak = true;
				break;
			}
		}

		if (shouldBreak) {
			break;
		}
	}

	
	
	for (let i = 0; i < enemies.length; i++) {
		for (let j = 0; j < enemies[i].length; j++) {
			const enemy = enemies[i][j];
		
			if (shouldMoveDown) {
				enemy.y += 1;
			} else {
				enemy.x += enemyXDirection;
			}
			
		}
	}
}

function spawnEnemyProjectile(enemy) {
	enemyProjectiles.push(new Projectile(enemy.x, enemy.y + 1, "⚱︎"))
}

function enemyShootProtocol() {
	
	for (let i = 0; i < enemies.length; i++) {
		for (let j = 0; j < enemies[i].length; j++) {
			let canShoot = false;
			if (i === enemies.length - 1) {
				canShoot = true;
			} else {
				canShoot = true;
				for (let k = 0; k < enemies[i + 1].length; k++) {
					if (enemies[i + 1][k].x === enemies[i][j].x) {
						canShoot = false;
					}
				}
			}

			if (canShoot) {
				if (Math.random() < ENEMY_SHOOT_PROB) {
					// SHOOT
					spawnEnemyProjectile(enemies[i][j]);
				}
			}
		}
	}
}

function statsHeader() {

	let scoreDisplay = board[0][0] = "Score: " + score;
	board[0][7] = "Lives: "
	for (let i = 0; i < player.lives.length; i++){
		board[0][i+8] = player.lives[i];
	}
}
			


async function main() {
	let running = true;
	
	createEnemies();
	console.log(enemies);

	let lastEnemyTick = 0;
	
	while (running) {
		board = createBoard();
		board[player.y][player.x] = player.icon;
		
		statsHeader()
		
		checkProjectileCollision();

		if (Date.now() - lastEnemyTick >= ENEMY_TICK_SPEED) {
			updateEnemyPosition();
			enemyShootProtocol();
			lastEnemyTick = Date.now();
		}



		if (enemies.length < 1) {
			console.log("GAME OVER-You win!");
			process.exit(0);
		}
		
	
		
		for (let i = 0; i < projectiles.length; i++) {
			const projectile = projectiles[i];
			
			if (!board[projectile.y]) {
				projectiles.splice(i, 1);
				i--;
				continue;
			}


			board[projectile.y][projectile.x] = projectile.icon;
			projectile.y--;
		}

			
		for (let i = 0; i < enemyProjectiles.length; i++) {
			
			const enemyProjectile = enemyProjectiles[i];
			if (enemyProjectile.x === player.x && enemyProjectile.y === player.y) {
				player.lives.splice(i, 1)
				if (player.lives.length < 1) {
					console.log("GAME OVER-You lost")
					process.exit(0);
				}
				

			}

			if (!board[enemyProjectile.y]) {
				enemyProjectiles.splice(i, 1);
				i--;
				continue;
			}


			board[enemyProjectile.y][enemyProjectile.x] = enemyProjectile.icon;
			enemyProjectile.y++;
			
		}

	

		for (let i = 0; i < enemies.length; i++) {
			const row = enemies[i];
			for (let j = 0; j < row.length; j++) {
				const enemy = row[j];
				board[enemy.y][enemy.x] = enemy.icon;
			}
				
		}




		printBoard();
		await sleep(100);
	}
	

}

function spawnProjectile() {
	projectiles.push(new Projectile(player.x, player.y - 1, "⚬"))
}

process.stdin.on('keypress', (str, key) => {
if (key.ctrl && key.name === 'c') {
    process.exit();
} else {

	switch(key.name) {
		case "space":
			spawnProjectile();
			break;
		case "right":
			player.x++;
				break;
		case "left":
			player.x--;
				break;
		default:
			// DO NOTHING
	}
}
});

// HW
// Add Score - DONE
// Add lives - DONE
// Change enemy shoot icon - DONE
// Delay Player Shooting rate
// End game when no more enemies - print you won - Why is my solution not working??


main();