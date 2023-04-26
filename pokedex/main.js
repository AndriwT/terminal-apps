// Take an input of number or name of pokemon
// Check api for pokemon info
// Print out pokemon info
// Say with say command the info of the pokemon

const { spawn } = require('child_process');

const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs');

console.log("National Pokedex")


async function getPokemonInfo(pokemon) {
	
	const url = "https://pokeapi.glitch.me/v1/pokemon/" + pokemon;
	
	const response = await fetch(url);
	const body = await response.json();
	return body[0];
}

function say(text) {
	return new Promise((resolve, reject) => {
		const say = spawn('say', ["-v", "Samantha", text]);
		say.on('close', (code) => {
			resolve();
		});
	})
}

async function main() {
	
let running = true;

say("National pokedex... please enter a pokemon")

while(running) {
	const pokemon = prompt("Please enter a pokemon name or number");
			
	const pokemonInfo =  await getPokemonInfo(pokemon);

	if (pokemonInfo === undefined) {
		say("No pokemon found, please try again")
		continue;
	}

	await say("Number, " + pokemonInfo.number);
	console.log(pokemonInfo.number)
	await say(pokemonInfo.name);
	console.log(pokemonInfo.name);
	await say(pokemonInfo.types[0] + " type pokemon");
	console.log(pokemonInfo.types[0]);
	if (pokemonInfo.types[1]) {
		await say("It's second type is " + pokemonInfo.types[1]);
		console.log(pokemonInfo.types[1]);
	}

	await say(pokemonInfo.description);
	console.log(pokemonInfo.description);
	if (pokemonInfo.family.evolutionStage > 1) {
		await say("It evolves from " + pokemonInfo.family.evolutionLine[pokemonInfo.family.evolutionStage - 2]);
		console.log("It evolves from " + pokemonInfo.family.evolutionLine[pokemonInfo.family.evolutionStage - 2]);
	} 
	if (pokemonInfo.family.evolutionLine[pokemonInfo.family.evolutionStage]) {
		await say("It evolves to " + pokemonInfo.family.evolutionLine[pokemonInfo.family.evolutionStage]);
		console.log("It evolves to " + pokemonInfo.family.evolutionLine[pokemonInfo.family.evolutionStage]);
	}
	//await say("Weight," + pokemonInfo.weight);
	//await say("Height," + pokemonInfo.height);
	say("Please enter a pokemon")
	}
}



//if (process.argv.length < 3) {
//	console.log("You didn't pass a pokemon");
//	process.exit(0);
//}

//const pokemon = process.argv[2];

main();


// HW say if there is an evolution after or before the pokemon
// Added types 
// Added console logs after speech
// Implemented prompt-sync
// Looped main function execution
// Failsafe if pokemon is not found
