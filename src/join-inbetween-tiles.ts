import {Instruction} from '@remotion/paths';
import {ThreeDReducedInstruction} from './3d-svg';
import {makeElement, ThreeDElement} from './element';
import {FaceType} from './face-type';
import {turnInto3D} from './fix-z';
import {getCenterFromPoints} from './get-center-from-points';
import {getNormalFromPoints} from './get-normal-from.points';
import {transformFace, translateSvgInstruction} from './map-face';
import {translateZ, Vector4D} from './matrix';
import {truthy} from './truthy';

export const extrudeElement = ({
	depth,
	sideColor,
	frontFaceColor,
	backFaceColor,
	points,
	strokeWidth,
	description,
}: {
	depth: number;
	sideColor: string;
	frontFaceColor: string;
	backFaceColor: string;
	points: Instruction[];
	strokeWidth: number;
	description: string;
}): ThreeDElement => {
	const threeD = turnInto3D({
		instructions: points,
		color: 'black',
		strokeWidth,
		strokeColor: 'black',
		description,
	});

	const unscaledBackFace = transformFace(threeD.faces[0], [
		translateZ(-depth / 2),
	]);
	const unscaledFrontFace = transformFace(threeD.faces[0], [
		translateZ(depth / 2),
	]);

	const inbetween = unscaledFrontFace.points
		.map((t, i): FaceType | null => {
			const nextInstruction =
				i === unscaledFrontFace.points.length - 1
					? unscaledFrontFace.points[0]
					: unscaledFrontFace.points[i + 1];

			const currentPoint = t.point;
			const nextPoint = nextInstruction.point;
			const movingOver: Vector4D = [
				nextPoint[0],
				nextPoint[1],
				nextPoint[2] - depth,
				nextPoint[3],
			];

			if (
				currentPoint[0] === nextPoint[0] &&
				currentPoint[1] === nextPoint[1] &&
				currentPoint[2] === nextPoint[2] &&
				currentPoint[3] === nextPoint[3]
			) {
				return null;
			}

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

			const normal = getNormalFromPoints(currentPoint, nextPoint, movingOver);

			return {
				points: newInstructions,
				color: sideColor,
				centerPoint: getCenterFromPoints([
					currentPoint,
					nextPoint,
					movingOver,
					translatedInstruction.point,
				]),
				strokeWidth: 0,
				strokeColor: 'black',
				normal,
				description: 'inbetween' + i,
			};
		})
		.filter(truthy);

	const scaledFrontFace: FaceType = {
		...unscaledFrontFace,
		color: frontFaceColor,
	};
	const scaledBackFace: FaceType = {
		...unscaledBackFace,
		color: backFaceColor,
	};

	const {backBottomRight, backTopLeft, frontBottomRight, frontTopLeft} =
		threeD.boundingBox;

	return makeElement(
		[...inbetween, scaledFrontFace, scaledBackFace],
		{
			backBottomRight: [
				backBottomRight[0],
				backBottomRight[1],
				backBottomRight[2] - depth / 2,
				backBottomRight[3],
			],
			backTopLeft: [
				backTopLeft[0],
				backTopLeft[1],
				backTopLeft[2] - depth / 2,
				backTopLeft[3],
			],
			frontBottomRight: [
				frontBottomRight[0],
				frontBottomRight[1],
				frontBottomRight[2] + depth / 2,
				frontBottomRight[3],
			],
			frontTopLeft: [
				frontTopLeft[0],
				frontTopLeft[1],
				frontTopLeft[2] + depth / 2,
				frontTopLeft[3],
			],
			// TODO: WRONG I just hardcoded something
			normal: [0, 0, 1, 1],
		},
		description
	);
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
