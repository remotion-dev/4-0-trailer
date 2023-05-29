import {Instruction} from '@remotion/paths';
import {ThreeDReducedInstruction} from './3d-svg';
import {turnInto3D} from './fix-z';
import {
	FaceType,
	transformInstructions,
	translateSvgInstruction,
} from './map-face';
import {translated, Vector4D} from './matrix';
import {subdivideInstructions} from './subdivide-instruction';

export const extrudeInstructions = ({
	depth,
	sideColor,
	frontFaceColor,
	backFaceColor,
	points,
	shouldDrawLine,
}: {
	depth: number;
	sideColor: string;
	frontFaceColor: string;
	backFaceColor: string;
	points: Instruction[];
	shouldDrawLine: boolean;
}): FaceType[] => {
	const threeD = turnInto3D(points);
	const instructions: Omit<FaceType, 'color'> = {
		centerPoint: [0, 0, 0, 1],
		points: threeD,
		shouldDrawLine,
	};
	const backFace = transformInstructions(instructions, [
		translated([0, 0, depth / 2]),
	]);
	const frontFace = transformInstructions(instructions, [
		translated([0, 0, -depth / 2]),
	]);

	const subdivided = subdivideInstructions(
		subdivideInstructions(
			subdivideInstructions(subdivideInstructions(backFace.points))
		)
	);

	const inbetween = subdivided.map((t, i): FaceType => {
		const nextInstruction =
			i === subdivided.length - 1 ? subdivided[0] : subdivided[i + 1];

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

		return {
			points: newInstructions,
			color: sideColor,
			shouldDrawLine: false,
			centerPoint: [0, 0, t.point[2] - depth / 2, 1],
		};
	});

	return [
		...inbetween,
		{...frontFace, color: frontFaceColor},
		{...backFace, color: backFaceColor},
	];
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
