import {ThreeDReducedInstruction} from './3d-svg';
import {STROKE_WIDTH} from './Face';
import {FaceType, transformFace, translateSvgInstruction} from './map-face';
import {translated, Vector4D} from './matrix';
import {getOrthogonalVector, normalizeVector} from './normalize-vector';
import {subdivideInstructions} from './subdivide-instruction';
import {truthy} from './truthy';

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
	currentPoint,
}: {
	nextInstruction: ThreeDReducedInstruction;
	currentPoint: Vector4D;
}): Vector4D => {
	if (nextInstruction.type === 'M') {
		return [
			nextInstruction.point[0] - currentPoint[0],
			nextInstruction.point[1] - currentPoint[1],
			nextInstruction.point[2] - currentPoint[2],
			nextInstruction.point[3] - currentPoint[3],
		];
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
	currentPoint,
}: {
	previousInstruction: ThreeDReducedInstruction;
	currentPoint: Vector4D;
}): Vector4D => {
	if (previousInstruction.type === 'M') {
		return [
			currentPoint[0] - previousInstruction.point[0],
			currentPoint[1] - previousInstruction.point[1],
			currentPoint[2] - previousInstruction.point[2],
			currentPoint[3] - previousInstruction.point[3],
		];
	}
	if (previousInstruction.type === 'L') {
		return [
			currentPoint[0] - previousInstruction.point[0],
			currentPoint[1] - previousInstruction.point[1],
			currentPoint[2] - previousInstruction.point[2],
			currentPoint[3] - previousInstruction.point[3],
		];
	}
	if (previousInstruction.type === 'C') {
		return [
			currentPoint[0] - previousInstruction.cp2[0],
			currentPoint[1] - previousInstruction.cp2[1],
			currentPoint[2] - previousInstruction.cp2[2],
			currentPoint[3] - previousInstruction.cp2[3],
		];
	}
	if (previousInstruction.type === 'Q') {
		return [
			currentPoint[0] - previousInstruction.cp[0],
			currentPoint[1] - previousInstruction.cp[1],
			currentPoint[2] - previousInstruction.cp[2],
			currentPoint[3] - previousInstruction.cp[3],
		];
	}
	throw new Error('Unknown instruction type');
};

export const extrudeInstructions = ({
	instructions,
	depth,
	sideColor,
	frontFaceColor,
	backFaceColor,
	drawSegmentLines,
}: {
	instructions: FaceType;
	depth: number;
	sideColor: string;
	frontFaceColor: string;
	backFaceColor: string;
	drawSegmentLines: boolean;
}): FaceType[] => {
	const backFace = transformFace(instructions, [translated([0, 0, depth / 2])]);
	const frontFace = transformFace(instructions, [
		translated([0, 0, -depth / 2]),
	]);
	const {points} = backFace;

	const subdivided = subdivideInstructions(
		subdivideInstructions(subdivideInstructions(subdivideInstructions(points)))
	);

	console.log('subdivided', subdivided);
	const inbetween = subdivided
		.map((t, i): FaceType[] => {
			const nextInstruction =
				i === subdivided.length - 1 ? subdivided[0] : subdivided[i + 1];
			const previousInstructionIndex = i === 0 ? subdivided.length - 1 : i - 1;
			const previousInstruction = subdivided[previousInstructionIndex];

			const incomingVector = getIncomingVector({
				previousInstruction,
				currentPoint: t.point,
			});
			const outgoingVector = getOutgoingVector({
				nextInstruction,
				currentPoint: t.point,
			});

			const angle = angleBetweenVectors(incomingVector, outgoingVector);

			const currentPoint = t.point;

			const nextPoint = nextInstruction.point;

			const vectorToNextPoint: Vector4D = [
				nextPoint[0] - currentPoint[0],
				nextPoint[1] - currentPoint[1],
				nextPoint[2] - currentPoint[2],
				nextPoint[3] - currentPoint[3],
			];
			const orthogonal = getOrthogonalVector(vectorToNextPoint);
			const normalizedOrthogonal = normalizeVector(
				orthogonal,
				STROKE_WIDTH / 2
			);
			console.log({orthogonal, vectorToNextPoint, nextPoint, currentPoint});

			const currentPointMovedToRight: Vector4D = [
				currentPoint[0] + normalizedOrthogonal[0],
				currentPoint[1] + normalizedOrthogonal[1],
				currentPoint[2] + normalizedOrthogonal[2],
				currentPoint[3] + normalizedOrthogonal[3],
			];

			const nextInstructionOffset = translateSvgInstruction(
				nextInstruction,
				normalizedOrthogonal[0],
				normalizedOrthogonal[1],
				normalizedOrthogonal[2]
			);

			const movingOver: Vector4D = [
				nextInstructionOffset.point[0],
				nextInstructionOffset.point[1],
				nextInstructionOffset.point[2] - depth,
				nextInstructionOffset.point[3],
			];

			const movingOverCurrent: Vector4D = [
				currentPointMovedToRight[0],
				currentPointMovedToRight[1],
				currentPointMovedToRight[2] - depth,
				currentPointMovedToRight[3],
			];

			const newInstructions: ThreeDReducedInstruction[] = [
				{
					type: 'M',
					point: currentPointMovedToRight,
				},
				nextInstructionOffset,
				{
					type: 'L',
					point: movingOver,
				},
				translateSvgInstruction(
					inverseInstruction(nextInstruction, currentPointMovedToRight),
					0,
					0,
					-depth
				),
				{
					type: 'L',
					point: currentPointMovedToRight,
				},
			];

			const shouldDrawLine =
				drawSegmentLines && !Number.isNaN(angle) && angle > 20;

			const d: FaceType[] = [
				{
					points: newInstructions,
					color: sideColor,
					shouldDrawLine: false,
					isStroke: false,
					centerPoint: [0, 0, t.point[2] - depth / 2, 1] as Vector4D,
				},
				shouldDrawLine
					? {
							points: [
								{
									type: 'M' as const,
									point: currentPoint,
								},
								{
									type: 'L' as const,
									point: movingOverCurrent,
								},
							],
							color: 'transparent',
							shouldDrawLine,
							isStroke: true,
							centerPoint: [0, 0, t.point[2] - depth / 2, 1] as Vector4D,
					  }
					: null,
			].filter(truthy);
			return d;
		})
		.flat(1);

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
