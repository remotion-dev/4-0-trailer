import {Instruction, reduceInstructions} from '@remotion/paths';
import {ThreeDReducedInstruction} from './3d-svg';
import {Vector4D} from './matrix';

export const turnInto3D = (
	instructions: Instruction[]
): ThreeDReducedInstruction[] => {
	let lastMove: Vector4D = [0, 0, 0, 1];
	const newInstructions: ThreeDReducedInstruction[] = [];
	const reduced = reduceInstructions(instructions);

	for (let i = 0; i < reduced.length; i++) {
		const instruction = reduced[i];
		const lastInstruction = newInstructions[i - 1];

		const startPoint: Vector4D = lastInstruction
			? lastInstruction.point
			: [0, 0, 0, 1];

		if (instruction.type === 'Z') {
			newInstructions.push({
				type: 'L',
				point: lastMove,
				_startPoint: startPoint,
			});
		} else if (instruction.type === 'M') {
			lastMove = [instruction.x, instruction.y, 0, 1];
			newInstructions.push({
				point: [instruction.x, instruction.y, 0, 1],
				type: 'M',
				_startPoint: startPoint,
			});
		} else if (instruction.type === 'L') {
			newInstructions.push({
				type: 'L',
				point: [instruction.x, instruction.y, 0, 1],
				_startPoint: startPoint,
			});
		} else if (instruction.type === 'C') {
			newInstructions.push({
				type: 'C',
				point: [instruction.x, instruction.y, 0, 1],
				cp1: [instruction.cp1x, instruction.cp1y, 0, 1],
				cp2: [instruction.cp2x, instruction.cp2y, 0, 1],
				_startPoint: startPoint,
			});
		} else if (instruction.type === 'Q') {
			newInstructions.push({
				type: 'Q',
				cp: [instruction.cpx, instruction.cpy, 0, 1],
				point: [instruction.x, instruction.y, 0, 1],
				_startPoint: startPoint,
			});
		} else {
			throw new Error('unknown');
		}
	}

	return newInstructions;
};
