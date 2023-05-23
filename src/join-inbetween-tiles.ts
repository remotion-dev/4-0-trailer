import {ThreeDReducedInstruction} from './3d-svg';
import {translateSvgInstruction} from './map-face';
import {Vector4D} from './multiply';

function dotProduct(a: Vector4D, b: Vector4D): number {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

function magnitude(v: Vector4D): number {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
}

function angleBetweenVectors(a: Vector4D, b: Vector4D): number {
	const dotProd = dotProduct(a, b);
	const magnitudes = magnitude(a) * magnitude(b);
	const angleInRadians = Math.acos(dotProd / magnitudes);

	// Convert the angle to degrees
	const angleInDegrees = angleInRadians * (180 / Math.PI);

	return angleInDegrees;
}

const getOutgoingVector = ({
	nextInstruction,
	currentPoing: currentPoint,
}: {
	nextInstruction: ThreeDReducedInstruction;
	currentPoing: Vector4D;
}): Vector4D => {
	if (nextInstruction.type === 'M') {
		return currentPoint;
	}
	if (nextInstruction.type === 'L') {
		return [
			nextInstruction.point[0] - currentPoint[0],
			nextInstruction.point[1] - currentPoint[1],
			nextInstruction.point[2] - currentPoint[2],
			nextInstruction.point[3] - currentPoint[3],
		];
	}
	if (nextInstruction.type === 'C') {
		return [
			nextInstruction.cp1[0] - currentPoint[0],
			nextInstruction.cp1[1] - currentPoint[1],
			nextInstruction.cp1[2] - currentPoint[2],
			nextInstruction.cp1[3] - currentPoint[3],
		];
	}
	if (nextInstruction.type === 'Q') {
		return [
			nextInstruction.cp[0] - currentPoint[0],
			nextInstruction.cp[1] - currentPoint[1],
			nextInstruction.cp[2] - currentPoint[2],
			nextInstruction.cp[3] - currentPoint[3],
		];
	}
	throw new Error('Unknown instruction type');
};

const getIncomingVector = ({
	previousInstruction,
	previousPoint,
}: {
	previousInstruction: ThreeDReducedInstruction;
	previousPoint: Vector4D;
}): Vector4D => {
	if (previousInstruction.type === 'M') {
		return previousPoint;
	}
	if (previousInstruction.type === 'L') {
		return [
			previousInstruction.point[0] - previousPoint[0],
			previousInstruction.point[1] - previousPoint[1],
			previousInstruction.point[2] - previousPoint[2],
			previousInstruction.point[3] - previousPoint[3],
		];
	}
	if (previousInstruction.type === 'C') {
		return [
			3 * (previousInstruction.cp2[0] - previousPoint[0]),
			3 * (previousInstruction.cp2[1] - previousPoint[1]),
			3 * (previousInstruction.cp2[2] - previousPoint[2]),
			3 * (previousInstruction.cp2[3] - previousPoint[3]),
		];
	}
	if (previousInstruction.type === 'Q') {
		return [
			previousInstruction.cp[0] - previousPoint[0],
			previousInstruction.cp[1] - previousPoint[1],
			previousInstruction.cp[2] - previousPoint[2],
			previousInstruction.cp[3] - previousPoint[3],
		];
	}
	throw new Error('Unknown instruction type');
};

export const joinInbetweenTiles = (
	instructions: ThreeDReducedInstruction[],
	depth: number
) => {
	return instructions.map((t, i) => {
		const nextInstruction =
			i === instructions.length - 1 ? instructions[0] : instructions[i + 1];
		const previousInstructionIndex = i === 0 ? instructions.length - 1 : i - 1;
		const previousInstruction = instructions[previousInstructionIndex];
		const twoInstructionsAgo =
			previousInstructionIndex === 0
				? instructions[instructions.length - 1]
				: instructions[previousInstructionIndex - 1];

		const incomingVector = getIncomingVector({
			previousInstruction,
			previousPoint: twoInstructionsAgo.point,
		});
		const outgoingVector = getOutgoingVector({
			nextInstruction,
			currentPoing: t.point,
		});

		const angle = angleBetweenVectors(incomingVector, outgoingVector);

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
		console.log({angle});
		return {
			instructions: newInstructions,
			shouldDrawLine: !Number.isNaN(angle) && angle > 0 && angle < 90,
		};
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
