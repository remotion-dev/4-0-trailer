import {Instruction, reduceInstructions} from '@remotion/paths';
import {getBoundingBoxFromInstructions} from '@remotion/paths/dist/get-bounding-box';
import {ThreeDReducedInstruction} from './3d-svg';
import {FaceType} from './face-type';
import {turnInto3D} from './fix-z';
import {
	sortFacesZIndex,
	transformFace,
	translateSvgInstruction,
} from './map-face';
import {translateZ, Vector4D} from './matrix';
import {subdivideInstructions} from './subdivide-instruction';

export const extrudeInstructions = ({
	depth,
	sideColor,
	frontFaceColor,
	backFaceColor,
	points,
	strokeWidth,
}: {
	depth: number;
	sideColor: string;
	frontFaceColor: string;
	backFaceColor: string;
	points: Instruction[];
	strokeWidth: number;
}): FaceType[] => {
	const boundingBox = getBoundingBoxFromInstructions(
		reduceInstructions(points)
	);

	const centerX = (boundingBox.x2 - boundingBox.x1) / 2 + boundingBox.x1;
	const centerY = (boundingBox.y2 - boundingBox.y1) / 2 + boundingBox.y1;

	const threeD = turnInto3D(points);
	const instructions: FaceType = {
		centerPoint: [centerX, centerY, 0, 1],
		points: subdivideInstructions(
			subdivideInstructions(subdivideInstructions(threeD))
		),
		strokeWidth,
		strokeColor: 'black',
		color: 'black',
	};

	const unscaledBackFace = transformFace(instructions, [translateZ(depth / 2)]);
	const unscaledFrontFace = transformFace(instructions, [
		translateZ(-depth / 2),
	]);

	const inbetween = unscaledBackFace.points.map((t, i): FaceType => {
		const nextInstruction =
			i === unscaledBackFace.points.length - 1
				? unscaledBackFace.points[0]
				: unscaledBackFace.points[i + 1];

		const currentPoint = t.point;
		const nextPoint = nextInstruction.point;
		const movingOver: Vector4D = [
			nextPoint[0],
			nextPoint[1],
			nextPoint[2] - depth,
			nextPoint[3],
		];

		const translatedInstruction = translateSvgInstruction(
			inverseInstruction(nextInstruction, currentPoint),
			0,
			0,
			-depth
		);
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
			translatedInstruction,
			{
				type: 'L',
				point: currentPoint,
			},
		];

		return {
			points: newInstructions,
			color: sideColor,
			centerPoint: [centerX, centerY, 0, 1],
			strokeWidth: 0,
			strokeColor: 'black',
		};
	});

	const scaledFrontFace: FaceType = {
		...unscaledFrontFace,
		color: frontFaceColor,
	};
	const scaledBackFace: FaceType = {
		...unscaledBackFace,
		color: backFaceColor,
	};

	return sortFacesZIndex([...inbetween, scaledFrontFace, scaledBackFace]);
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
