
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function sleep(timeout) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, timeout)
	})
}


let height = 20;
let width = 20;

let currentScene = "GRASSLAND";
let shouldCheckForSpawn = true;


let player = {
	name: "Andriw",
	icon: "@",
	position: { x: width / 2 , y: height / 2 },
	health: 100,
	maxHealth: 100,
	experience: 0
}

let menuOptions = ["(a)ttack", "(r)un"];
let attackOptions = [
	{	
		id: "SWORD",
		name: "(s)word",
		damage: 5,
	},
	{
		id: "BSLAP",
		name: "(b)slap",
		damage: 15,
	}
]


let enemy = {
	name: "Alvin",
	icon: "D",
	position: { x: width / 2, y: 5 },
	spawnRate: 0.05,
	health: 15,
	maxHealth: 15,
	attacks: [
		{
			name: "BARK",
			damage: 1,
			flavorText: "Bark..You cringed.."
		},
		{
			name: "Whip",
			damage: 10,
			flavorText: "You got whipped"
		}
	]
}





const BATTLE_ARENA_MENU = "MENU";
const BATTLE_ARENA_ATTACK_MENU = "ATTACK_MENU";

let currentArenaMenu = BATTLE_ARENA_MENU;
let currentFlavorText = "";

async function performEnemyAttack() {
	const enemyAttackIdx = getRandomInt(0, enemy.attacks.length)
	const attack = enemy.attacks[enemyAttackIdx];

	player.health -= attack.damage;

	await setFlavorText(attack.flavorText)

}




function performAttack(attackId) {
	const attack = attackOptions.find(attack => attack.id === attackId);
	if (!attack) return;

	enemy.health -= attack.damage;
	
	

}

async function setFlavorText(flavorText) {
	for (let i = 0; i < flavorText.length; i++) {
		
		currentFlavorText += flavorText[i]
		await sleep(50);
	}
}


function buildBattleArena() {

	const tiles = new Array(height).fill(JSON.stringify(new Array(width).fill(" ")))
		.map(item => JSON.parse(item));

	for (let i = 0; i < tiles.length; i++) {
		const row = tiles[i];

		for (let j = 0; j < row.length; j++) {
			
			if (enemy.position.x === j && enemy.position.y === i) {
				tiles[i][j] = enemy.icon;
				tiles[i][j + 2] = enemy.health;
				tiles[i][j + 3] = "/";
				tiles[i][j + 4] = enemy.maxHealth;
			}

			

			if (i === 15) {
				tiles[i][j] = "-";
			}

			if (i === 13 && j === 11) {
				for (let k = 0; k < 3; k++) {
					tiles[i][j] = "HP:"
					
				}
			}

			if (i === 13 && j === 12) {
				for (let k = 0; k < String(player.health).length; k++) {
					tiles[i][j + k] = String(player.health)[k]
				}
		
			}
			if (i === 13 && j === 1) {
				for (let k = 0; k < 3; k++) {
					tiles[i][j] = "XP:"
					
				}
			}
			if (i === 13 && j === 3) {
				
				for (let k = 0; k < String(player.experience).length; k++) {
					tiles[i][j + k] = String(player.experience)[k]
					
				}
		
			}

			
			if (currentFlavorText.length > 0) {
				if (i === 17 && j === 1) {
					for (let k = 0; k < currentFlavorText.length; k++) {
						tiles[i][j + k] = currentFlavorText[k];				
					}
				}
					
			} else {
			
			
				if (i === 17 && currentArenaMenu === BATTLE_ARENA_MENU) {
					for (const menuOption of menuOptions) {
						if (menuOption[j] && tiles[i][j] === " ") {
							tiles[i][j] = menuOption[j]
						}
					}
				}
				
				if (i === 18 && currentArenaMenu === BATTLE_ARENA_MENU) {
					for (const menuOption of menuOptions) {
						if (menuOption[j]  && tiles[i][j] === " ") {
							tiles[i][j] = menuOptions[j+1]
						}
					}
				}

				if (i === 17 && currentArenaMenu === BATTLE_ARENA_ATTACK_MENU) {
		
					for (let k = 0; k < attackOptions.length; k++) {
						tiles[i + k][j] = attackOptions[k].name[j]
					}
					
				} 	
			}
		}
	}

	return tiles;
}


function buildGrassLand() {
	const tiles = new Array(height).fill(JSON.stringify(new Array(width).fill(" ")))
		.map(item => JSON.parse(item));

	for (let i = 0; i < tiles.length; i++) {
		const row = tiles[i];

		for (let j = 0; j < row.length; j++) {
			if (i < height / 2) {
				tiles[i][j] = "x";
			}
			
		}
	}

	return tiles;
}

function shouldEnemySpawn(tiles) {
	shouldCheckForSpawn = false;
	if (tiles[player.position.y][player.position.x] === "x") {
		const diceRoll = Math.random();
		console.log("diceRoll: ", diceRoll, enemy.spawnRate);
		if (diceRoll <= enemy.spawnRate) {
			return true;
		}
	}

	return false;
}

async function main() {
	
	let running = true;

	
	while (running) {

		if (currentScene === "GRASSLAND") {
			const tiles = buildGrassLand();
			if (shouldCheckForSpawn === true) {
				const shouldSpawn = shouldEnemySpawn(tiles);
				if (shouldSpawn) {
					enemy.health = enemy.maxHealth;
					currentArenaMenu = BATTLE_ARENA_MENU;
					currentScene = "BATTLE_ARENA";
					setTimeout(async () => {
						await setFlavorText("wild " + enemy.name + " appeared");
						await sleep(1000);
						currentFlavorText = "";
					}, 0);
				}
			}
		
			tiles[player.position.y][player.position.x] = "@";
			process.stdout.write("\x1Bc" + tiles.map(item => item.join("")).join("\n"));
		} else if (currentScene === "BATTLE_ARENA") {
			const tiles = buildBattleArena();
			
			process.stdout.write("\x1Bc" + tiles.map(item => item.join("")).join("\n"));
		}
		await sleep(100);
	}	

}



function checkIfEnemyIsDead() {
	if (enemy.health < 1) {
		return true;
	}

	return false;
}

async function runAway() {
	//setTimeout(async () => {
		//await setFlavorText("You ran way...");
		//await sleep(1000);
		//currentFlavorText = "";
	//}, 0);
	currentArenaMenu = BATTLE_ARENA_MENU;
	currentScene = "GRASSLAND";
	
}

let keypressed = "yay";

process.stdin.on('keypress', async (str, key) => {
	if (key.ctrl && key.name === 'c') {
	    process.exit();
	} else if (keypressed){
		switch(key.name) {
			case "up":
keypressed = "";
				player.position.y--;
				shouldCheckForSpawn = true;
keypressed = "yay";
				break;
			case "right":
keypressed = "";
				player.position.x++;
				shouldCheckForSpawn = true;
keypressed = "yay";
				break;
			case "down":
keypressed = "";
				player.position.y++;
				shouldCheckForSpawn = true;
keypressed = "yay";
				break;
			case "left":
keypressed = "";
				player.position.x--;
				shouldCheckForSpawn = true;
keypressed = "yay";
				break;
			case "a":
keypressed = "";
				if (currentScene === "BATTLE_ARENA") {
				  currentArenaMenu = BATTLE_ARENA_ATTACK_MENU;
				};
keypressed = "yay";
				break;
			case "r":
keypressed = "";
				if (currentScene === "BATTLE_ARENA") {
					await setFlavorText("You ran way...");
					await sleep(1000);
					runAway();
					currentFlavorText = "";
				};
keypressed = "yay";
				break;
			case "s":
keypressed = "";
				if (currentScene === "BATTLE_ARENA" && currentArenaMenu === BATTLE_ARENA_ATTACK_MENU) {
					performAttack("SWORD");
					const isEnemyDead = checkIfEnemyIsDead();
					if (isEnemyDead) {
						player.experience += 10;
						await setFlavorText("Victory!");
						await sleep(1000);
						currentFlavorText = "";
						currentScene = "GRASSLAND";
keypressed = "yay";
						return;
					}
					await performEnemyAttack();
					await sleep(2000);
					currentFlavorText = "";
				}
keypressed = "yay";
				break;
			case "b":
keypressed = "";
				if (currentScene === "BATTLE_ARENA" && currentArenaMenu === BATTLE_ARENA_ATTACK_MENU) {
					performAttack("BSLAP");
					const isEnemyDead = checkIfEnemyIsDead();
					if (isEnemyDead) {
						player.experience += 5;
						await setFlavorText("Vitory!");
						await sleep(500);
						currentFlavorText = "";
						currentScene = "GRASSLAND";
keypressed = "yay";
						return;
					}
					await performEnemyAttack();
					await sleep(2000);
					currentFlavorText = "";
				}
keypressed = "yay";
				break;
			default:
keypressed = "yay";
			// DO NOTHING
		}
	}
});

// HW
// One more Attack for Player - DONE
// Fix flavor text bug - DONE
// Run command - DONE

main()



