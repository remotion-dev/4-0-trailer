import {Instruction, reduceInstructions} from '@remotion/paths';
import {getBoundingBoxFromInstructions} from '@remotion/paths/dist/get-bounding-box';
import {ThreeDReducedInstruction} from './3d-svg';
import {turnInto3D} from './fix-z';
import {
	FaceType,
	transformInstructions,
	translateSvgInstruction,
} from './map-face';
import {translated, Vector4D} from './matrix';
import {subdivideInstructions} from './subdivide-instruction';
import {truthy} from './truthy';

export const extrudeInstructions = ({
	depth,
	sideColor,
	frontFaceColor,
	backFaceColor,
	points,
	shouldDrawLine,
	strokeWidth,
}: {
	depth: number;
	sideColor: string;
	frontFaceColor: string;
	backFaceColor: string;
	points: Instruction[];
	shouldDrawLine: boolean;
	strokeWidth: number;
}): FaceType[] => {
	const boundingBox = getBoundingBoxFromInstructions(
		reduceInstructions(points)
	);
	const centerX = (boundingBox.x2 - boundingBox.x1) / 2 + boundingBox.x1;
	const centerY = (boundingBox.y2 - boundingBox.y1) / 2 + boundingBox.y1;

	const threeD = turnInto3D(points);
	const instructions: Omit<FaceType, 'color'> = {
		centerPoint: [centerX, centerY, 0, 1],
		points: subdivideInstructions(
			subdivideInstructions(
				subdivideInstructions(subdivideInstructions(threeD))
			)
		),
		shouldDrawLine,
		strokeWidth,
	};

	// Const strokePathBox = getBoundingBox(serializeInstructions(points));
	// const width = strokePathBox.x2 - strokePathBox.x1;
	// const height = strokePathBox.y2 - strokePathBox.y1;
	// const area = width * height;
	// const desiredArea = (width - strokeWidth) * (height - strokeWidth);
	// const ratio = desiredArea / area;
	// Const borderPath = translatePath(
	// 	scalePath(serializeInstructions(points), ratio, ratio),
	// 	strokeWidth,
	// 	strokeWidth
	// );

	// Const backFaceBorder: Omit<FaceType, 'color'> = {
	// 	centerPoint: [0, 0, 0, 1],
	// 	points: turnInto3D(parsePath(borderPath)),
	// 	shouldDrawLine,
	// 	strokeWidth,
	// };

	const backFace = transformInstructions(instructions, [
		translated([0, 0, depth / 2]),
	]);
	// Const backFaceStrokeFace = transformInstructions(backFaceBorder, [
	// 	translated([0, 0, depth / 2]),
	// ]);
	const frontFace = transformInstructions(instructions, [
		translated([0, 0, -depth / 2]),
	]);
	// Const frontFaceStrokeFace = transformInstructions(backFaceBorder, [
	// 	translated([0, 0, -depth / 2]),
	// ]);

	const inbetween = backFace.points.map((t, i): FaceType => {
		const nextInstruction =
			i === backFace.points.length - 1
				? backFace.points[0]
				: backFace.points[i + 1];

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

		// When extruding, let's consider the whole inbetween as a plane and use the
		// center point of that plane as the center point for each face for z-sorting.
		return {
			points: newInstructions,
			color: sideColor,
			shouldDrawLine: false,
			centerPoint: [centerX, centerY, 0, 1],
			strokeWidth,
		};
	});

	// Const frontFaceStroke: FaceType = {
	// 	...frontFaceStrokeFace,
	// 	shouldDrawLine: true,
	// 	color: 'transparent',
	// 	centerPoint: [0, 0, frontFace.centerPoint[2] - 0.001, 1],
	// };

	// const backFaceStroke: FaceType = {
	// 	...backFaceStrokeFace,
	// 	shouldDrawLine: true,
	// 	color: 'transparent',
	// 	centerPoint: [0, 0, backFace.centerPoint[2] + 0.001, 1],
	// };

	return [
		...inbetween,
		{...frontFace, color: frontFaceColor, shouldDrawLine: true},
		// FrontFace.shouldDrawLine ? frontFaceStroke : null,
		{...backFace, color: backFaceColor, shouldDrawLine: true},
		// BackFace.shouldDrawLine ? backFaceStroke : null,
	].filter(truthy);
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
