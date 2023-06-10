import {
	getBoundingBox,
	Instruction,
	parsePath,
	resetPath,
	scalePath,
	serializeInstructions,
	translatePath,
} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import {Font} from 'opentype.js';
import {interpolate, spring} from 'remotion';
import {centerPath} from '../center';
import {turnInto3D} from '../fix-z';
import {getText} from '../get-char';
import {extrudeInstructions} from '../join-inbetween-tiles';
import {
	FaceType,
	sortFacesZIndex,
	transformFace,
	transformFaces,
} from '../map-face';
import {MatrixTransform4D, rotateX, translateZ, Vector4D} from '../matrix';
import {subdivide2DCInstruction} from '../subdivide-instruction';
import {truthy} from '../truthy';

const outerCornerRadius = 30;
const padding = 1;
const outerWidth = 300;
const outerHeight = 100;

export const getButton = ({
	font,
	phrase,
	depth,
	color,
	delay,
	transformations,
	frame,
	fps,
}: {
	font: Font;
	phrase: string;
	depth: number;
	color: string;
	delay: number;
	transformations: MatrixTransform4D[];
	frame: number;
	fps: number;
}): FaceType[] => {
	const rect = makeRect({
		height: outerHeight,
		width: outerWidth,
		cornerRadius: 30,
	});

	const turn = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 40 + delay,
	});

	const evolve = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 40,
		delay,
	});

	const boxWidth = outerWidth - padding * 2;
	const boxHeight = outerHeight - padding * 2;

	const actualWidth = boxWidth * evolve;

	const innerCornerRadius = outerCornerRadius - padding;

	const cornerRadiusFactor = (4 / 3) * Math.tan(Math.PI / 8);

	const startOfEndCurve = boxWidth - innerCornerRadius;
	const lerpStartCurve = interpolate(
		actualWidth,
		[0, innerCornerRadius],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const lerpEndCurve = interpolate(
		evolve,
		[startOfEndCurve / boxWidth, 1],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const start: Instruction = {
		type: 'M',
		x: 0,
		y: innerCornerRadius,
	};

	const [topLeftCorner] = subdivide2DCInstruction(
		start.x,
		start.y,
		{
			type: 'C' as const,
			x: innerCornerRadius,
			y: 0,
			cp1x: 0,
			cp1y: innerCornerRadius - innerCornerRadius * cornerRadiusFactor,
			cp2x: innerCornerRadius - innerCornerRadius * cornerRadiusFactor,
			cp2y: 0,
		},
		lerpStartCurve
	);

	if (topLeftCorner.type !== 'C') {
		throw new Error('Expected C');
	}

	const toRight: Instruction = {
		type: 'L',
		x: Math.max(topLeftCorner.x, Math.min(actualWidth, startOfEndCurve)),
		y: topLeftCorner.y,
	};

	const [topRightCorner] = subdivide2DCInstruction(
		boxWidth - innerCornerRadius,
		0,
		{
			type: 'C',
			x: boxWidth,
			y: innerCornerRadius,
			cp1x:
				boxWidth - innerCornerRadius + innerCornerRadius * cornerRadiusFactor,
			cp1y: 0,
			cp2x: boxWidth,
			cp2y: innerCornerRadius - innerCornerRadius * cornerRadiusFactor,
		},
		lerpEndCurve
	);

	const [hiddenBottomRightCorner, bottomRightCorner] = subdivide2DCInstruction(
		boxWidth,
		boxHeight - innerCornerRadius,
		{
			type: 'C',
			x: boxWidth - innerCornerRadius,
			y: boxHeight,
			cp1x: boxWidth,
			cp1y:
				boxHeight - innerCornerRadius + innerCornerRadius * cornerRadiusFactor,
			cp2x:
				boxWidth - innerCornerRadius + innerCornerRadius * cornerRadiusFactor,
			cp2y: boxHeight,
		},
		1 - lerpEndCurve
	);

	if (hiddenBottomRightCorner.type !== 'C') {
		throw new Error('Expected C');
	}

	const toLeft: Instruction = {
		type: 'L' as const,
		x: Math.min(actualWidth, innerCornerRadius),
		y: boxHeight,
	};

	const [hiddenBottomLeftCorner, bottomLeftCorner] = subdivide2DCInstruction(
		innerCornerRadius,
		boxHeight,
		{
			type: 'C',
			x: 0,
			y: boxHeight - innerCornerRadius,
			cp1x: innerCornerRadius - innerCornerRadius * cornerRadiusFactor,
			cp1y: boxHeight,
			cp2x: 0,
			cp2y:
				boxHeight - innerCornerRadius + innerCornerRadius * cornerRadiusFactor,
		},
		1 - lerpStartCurve
	);

	if (hiddenBottomLeftCorner.type !== 'C') {
		throw new Error('Expected C');
	}

	const toBottom: Instruction =
		lerpEndCurve > 0
			? {
					type: 'L',
					x: hiddenBottomRightCorner.x,
					y: hiddenBottomRightCorner.y,
			  }
			: lerpStartCurve < 1
			? {
					type: 'L',
					x: hiddenBottomLeftCorner.x,
					y: hiddenBottomLeftCorner.y,
			  }
			: {
					type: 'L',
					x: actualWidth,
					y: boxHeight,
			  };

	const paths: Instruction[] = [
		start,
		topLeftCorner,
		lerpStartCurve === 1 ? toRight : null,
		lerpEndCurve > 0 ? topRightCorner : null,
		toBottom,
		lerpEndCurve > 0 ? bottomRightCorner : null,
		lerpStartCurve === 1 ? toLeft : null,
		bottomLeftCorner,
		{
			type: 'L' as const,
			x: 0,
			y: innerCornerRadius,
		},
	].filter(truthy);

	const text = getText({font, text: phrase});

	const path = resetPath(rect.path);

	const boundingBox = getBoundingBox(path);
	const width = boundingBox.x2 - boundingBox.x1;
	const height = boundingBox.y2 - boundingBox.y1;

	const rotation = interpolate(turn, [0, 1], [0, Math.PI]);

	const extruded = extrudeInstructions({
		backFaceColor: 'white',
		sideColor: 'black',
		frontFaceColor: 'black',
		depth,
		points: parsePath(centerPath(rect.path)),
		strokeWidth: 10,
	});

	const progressFace: FaceType = transformFace({
		face: {
			points: turnInto3D(
				parsePath(
					translatePath(
						serializeInstructions(paths),
						-width / 2 + 1,
						-height / 2 + 1
					)
				)
			),
			color,
			centerPoint: [0, 0, 0, 1] as Vector4D,
			shouldDrawLine: false,
			strokeWidth: 10,
		},
		transformations: [translateZ(-depth / 2 - 0.01)],
	});

	const scaled = resetPath(scalePath(text.path, 0.4, 0.4));
	const boundingBoxText = getBoundingBox(scaled);
	const leftAlignedText = translatePath(
		scaled,
		-boxWidth / 2 + 20,
		-boundingBoxText.y2 / 2
	);

	const textFace: FaceType = transformFace({
		face: {
			points: turnInto3D(parsePath(leftAlignedText)),
			color: 'black',
			centerPoint: [0, 0, 0, 1] as Vector4D,
			shouldDrawLine: false,
			strokeWidth: 10,
		},
		transformations: [rotateX(Math.PI), translateZ(depth / 2 + 0.01)],
	});

	const projected = transformFaces({
		transformations: [rotateX(rotation), ...transformations],
		faces: [...extruded, progressFace, textFace],
	});

	return sortFacesZIndex(projected);
};
