import {Vector4D} from './matrix';

export type ThreeDReducedInstruction =
	| {
			type: 'M';
			_startPoint: Vector4D;
			point: Vector4D;
	  }
	| {
			type: 'L';
			_startPoint: Vector4D;
			point: Vector4D;
	  }
	| {
			type: 'C';
			cp1: Vector4D;
			cp2: Vector4D;
			_startPoint: Vector4D;
			point: Vector4D;
	  }
	| {
			type: 'Q';
			cp: Vector4D;
			_startPoint: Vector4D;
			point: Vector4D;
	  };

const serializeThreeDReducedInstruction = (
	instruction: ThreeDReducedInstruction
): string => {
	if (instruction.type === 'M') {
		return `M ${instruction.point[0]} ${instruction.point[1]}`;
	}
	if (instruction.type === 'L') {
		return `L ${instruction.point[0]} ${instruction.point[1]}`;
	}
	if (instruction.type === 'C') {
		return `C ${instruction.cp1[0]} ${instruction.cp1[1]} ${instruction.cp2[0]} ${instruction.cp2[1]} ${instruction.point[0]} ${instruction.point[1]}`;
	}
	if (instruction.type === 'Q') {
		return `Q ${instruction.cp[0]} ${instruction.cp[1]} ${instruction.point[0]} ${instruction.point[1]}`;
	}
	throw new Error('Unknown instruction type');
};

export const threeDIntoSvgPath = (
	instructions: ThreeDReducedInstruction[]
): string =>
	instructions
		.map((instruction) => serializeThreeDReducedInstruction(instruction))
		.join(' ');
