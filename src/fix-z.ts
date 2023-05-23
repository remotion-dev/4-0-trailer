import {ReducedInstruction} from '@remotion/paths';
import {ThreeDReducedInstruction} from './3d-svg';

export const fixZ = (
	instructions: ReducedInstruction[]
): ThreeDReducedInstruction[] => {
	let lastMove: [number, number, number, number] = [0, 0, 0, 0];
	const newInstructions: ThreeDReducedInstruction[] = [];
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction.type === 'Z') {
			newInstructions.push({
				type: 'L',
				point: lastMove,
			});
		} else if (instruction.type === 'M') {
			lastMove = [instruction.x, instruction.y, 0, 0];
			newInstructions.push({
				point: [instruction.x, instruction.y, 0, 0],
				type: 'M',
			});
		} else if (instruction.type === 'L') {
			newInstructions.push({
				type: 'L',
				point: [instruction.x, instruction.y, 0, 0],
			});
		} else if (instruction.type === 'C') {
			newInstructions.push({
				type: 'C',
				point: [instruction.x, instruction.y, 0, 0],
				cp1: [instruction.cp1x, instruction.cp1y, 0, 0],
				cp2: [instruction.cp2x, instruction.cp2y, 0, 0],
			});
		} else if (instruction.type === 'Q') {
			newInstructions.push({
				type: 'Q',
				cp: [instruction.cpx, instruction.cpy, 0, 0],
				point: [instruction.x, instruction.y, 0, 0],
			});
		} else {
			throw new Error('unknown');
		}
	}

	return newInstructions;
};
