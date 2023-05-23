import {ReducedInstruction} from '@remotion/paths';

export const fixZ = (
	instructions: ReducedInstruction[]
): ReducedInstruction[] => {
	let lastMove: [number, number] = [0, 0];
	const newInstructions: ReducedInstruction[] = [];
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction.type === 'Z') {
			newInstructions.push({
				type: 'L',
				x: lastMove[0],
				y: lastMove[1],
			});
			continue;
		}
		if (instruction.type === 'M') {
			lastMove = [instruction.x, instruction.y];
		}
		newInstructions.push(instruction);
	}

	return newInstructions;
};
