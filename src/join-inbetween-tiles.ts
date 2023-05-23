import {ThreeDReducedInstruction} from './3d-svg';
import {translateSvgInstruction} from './map-face';
import {Vector4D} from './multiply';

export const joinInbetweenTiles = (
	instructions: ThreeDReducedInstruction[],
	depth: number
) => {
	return instructions.map((t, i) => {
		const nextInstruction =
			i === instructions.length - 1 ? instructions[0] : instructions[i + 1];

		const currentPoint = t.point;
		const nextPoint = nextInstruction.point;
		const movingOver: Vector4D = [
			nextPoint[0],
			nextPoint[1],
			nextPoint[2] - depth,
			nextPoint[3],
		];
		const newInstructions: ThreeDReducedInstruction[] = [
			{
				type: 'M',
				point: currentPoint,
			},
			nextInstruction,
			{
				type: 'L',
				point: movingOver,
			},
			translateSvgInstruction(
				inverseInstruction(nextInstruction, currentPoint),
				0,
				0,
				-depth
			),
			{
				type: 'L',
				point: currentPoint,
			},
		];
		return newInstructions;
	});
};

const inverseInstruction = (
	instruction: ThreeDReducedInstruction,
	comingFrom: Vector4D
): ThreeDReducedInstruction => {
	if (instruction.type === 'M') {
		return {
			type: 'M',
			point: comingFrom,
		};
	}
	if (instruction.type === 'L') {
		return {
			type: 'L',
			point: comingFrom,
		};
	}
	if (instruction.type === 'C') {
		return {
			type: 'C',
			point: comingFrom,
			cp1: instruction.cp2,
			cp2: instruction.cp1,
		};
	}
	if (instruction.type === 'Q') {
		return {
			type: 'Q',
			point: comingFrom,
			cp: instruction.cp,
		};
	}
	throw new Error('Unknown instruction type');
};
