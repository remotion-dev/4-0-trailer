import {ThreeDReducedInstruction} from './3d-svg';
import {Vector4D} from './matrix';

export const subdivideInstructions = (
	instructions: ThreeDReducedInstruction[]
): ThreeDReducedInstruction[] => {
	const newInstructions: ThreeDReducedInstruction[] = [];
	instructions.forEach((instruction, i) => {
		if (instruction.type === 'M') {
			newInstructions.push(instruction);
			return;
		}
		const previousInstruction = instructions[i - 1];
		const subdivided = subdivideInstruction(
			previousInstruction.point,
			instruction
		);
		newInstructions.push(...subdivided);
	});
	return newInstructions;
};

const subdivideInstruction = (
	from: Vector4D,
	instruction: ThreeDReducedInstruction
) => {
	if (instruction.type === 'C') {
		return subdivideCInstruction(from, instruction);
	}
	if (instruction.type === 'L' || instruction.type === 'M') {
		return subdivideLOrMInstruction(from, instruction);
	}
	if (instruction.type === 'Q') {
		return subdivideQInstruction(from, instruction);
	}

	throw new Error('Cannot subdivide instruction');
};

const subdivideLOrMInstruction = (
	from: Vector4D,
	instruction: ThreeDReducedInstruction
) => {
	if (instruction.type !== 'L' && instruction.type !== 'M') {
		throw new Error('Expected L or M instruction');
	}
	const t = 0.5;
	const q0: Vector4D = [
		(1 - t) * from[0] + t * instruction.point[0],
		(1 - t) * from[1] + t * instruction.point[1],
		(1 - t) * from[2] + t * instruction.point[2],
		(1 - t) * from[3] + t * instruction.point[3],
	];

	const curves: [ThreeDReducedInstruction, ThreeDReducedInstruction] = [
		{type: instruction.type, point: q0},
		{type: instruction.type, point: instruction.point},
	];

	return curves;
};

const subdivideCInstruction = (
	from: Vector4D,
	instruction: ThreeDReducedInstruction
) => {
	if (instruction.type !== 'C') {
		throw new Error('Expected C instruction');
	}

	const t = 0.5;

	const q0: Vector4D = [
		(1 - t) * from[0] + t * instruction.cp1[0],
		(1 - t) * from[1] + t * instruction.cp1[1],
		(1 - t) * from[2] + t * instruction.cp1[2],
		(1 - t) * from[3] + t * instruction.cp1[3],
	];

	const q1: Vector4D = [
		(1 - t) * instruction.cp1[0] + t * instruction.cp2[0],
		(1 - t) * instruction.cp1[1] + t * instruction.cp2[1],
		(1 - t) * instruction.cp1[2] + t * instruction.cp2[2],
		(1 - t) * instruction.cp1[3] + t * instruction.cp2[3],
	];

	const q2: Vector4D = [
		(1 - t) * instruction.cp2[0] + t * instruction.point[0],
		(1 - t) * instruction.cp2[1] + t * instruction.point[1],
		(1 - t) * instruction.cp2[2] + t * instruction.point[2],
		(1 - t) * instruction.cp2[3] + t * instruction.point[3],
	];

	const r0: Vector4D = [
		(1 - t) * q0[0] + t * q1[0],
		(1 - t) * q0[1] + t * q1[1],
		(1 - t) * q0[2] + t * q1[2],
		(1 - t) * q0[3] + t * q1[3],
	];

	const r1: Vector4D = [
		(1 - t) * q1[0] + t * q2[0],
		(1 - t) * q1[1] + t * q2[1],
		(1 - t) * q1[2] + t * q2[2],
		(1 - t) * q1[3] + t * q2[3],
	];

	const s0: Vector4D = [
		(1 - t) * r0[0] + t * r1[0],
		(1 - t) * r0[1] + t * r1[1],
		(1 - t) * r0[2] + t * r1[2],
		(1 - t) * r0[3] + t * r1[3],
	];

	const curves: [ThreeDReducedInstruction, ThreeDReducedInstruction] = [
		{type: 'C', point: s0, cp1: q0, cp2: r0},
		{type: 'C', point: instruction.point, cp1: r1, cp2: q2},
	];

	return curves;
};

const subdivideQInstruction = (
	from: Vector4D,
	instruction: ThreeDReducedInstruction
) => {
	if (instruction.type !== 'Q') {
		throw new Error('Expected Q instruction');
	}

	const t = 0.5;
	const q0: Vector4D = [
		(1 - t) * from[0] + t * instruction.cp[0],
		(1 - t) * from[1] + t * instruction.cp[1],
		(1 - t) * from[2] + t * instruction.cp[2],
		(1 - t) * from[3] + t * instruction.cp[3],
	];

	const q1: Vector4D = [
		(1 - t) * instruction.cp[0] + t * instruction.point[0],
		(1 - t) * instruction.cp[1] + t * instruction.point[1],
		(1 - t) * instruction.cp[2] + t * instruction.point[2],
		(1 - t) * instruction.cp[3] + t * instruction.point[3],
	];

	const r0: Vector4D = [
		(1 - t) * q0[0] + t * q1[0],
		(1 - t) * q0[1] + t * q1[1],
		(1 - t) * q0[2] + t * q1[2],
		(1 - t) * q0[3] + t * q1[3],
	];

	const newInstructions: [ThreeDReducedInstruction, ThreeDReducedInstruction] =
		[
			{type: 'Q', point: r0, cp: q0},
			{type: 'Q', point: instruction.point, cp: q1},
		];

	return newInstructions;
};
