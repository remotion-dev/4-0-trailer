import {spring} from 'remotion';
import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {
	getBoundingBox,
	Instruction,
	parsePath,
	resetPath,
	scalePath,
	serializeInstructions,
	translatePath,
} from '@remotion/paths';
import {turnInto3D} from '../fix-z';
import {useText} from '../get-char';
import {FaceType, transformFace} from '../map-face';
import {rotated, translated, Vector4D} from '../matrix';
import {makeRect} from '@remotion/shapes';
import {extrudeInstructions} from '../join-inbetween-tiles';
import {projectPoints} from '../project-points';

const outerCornerRadius = 30;
const padding = 1;
const outerWidth = 300;
const outerHeight = 100;

export const useButton = (
	phrase: string,
	depth: number,
	color: string,
	delay: number
) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
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
		delay: 50 + delay,
	});

	const evolve = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 10 + delay,
	});

	const boxWidth = outerWidth - padding * 2;
	const boxHeight = outerHeight - padding * 2;

	const innerCornerRadius = outerCornerRadius - padding;

	const cornerRadiusFactor = (4 / 3) * Math.tan(Math.PI / 8);

	const paths: Instruction[] = [
		{
			type: 'M',
			x: 0,
			y: 0,
		},
		{
			type: 'L',
			x: boxWidth - innerCornerRadius,
			y: 0,
		},
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
		{
			type: 'L',
			x: boxWidth,
			y: boxHeight - innerCornerRadius,
		},
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
		{
			type: 'L',
			x: innerCornerRadius,
			y: boxHeight,
		},
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
		{
			type: 'L',
			x: 0,
			y: innerCornerRadius,
		},
		{
			type: 'C',
			x: innerCornerRadius,
			y: 0,
			cp1x: 0,
			cp1y: innerCornerRadius - innerCornerRadius * cornerRadiusFactor,
			cp2x: innerCornerRadius - innerCornerRadius * cornerRadiusFactor,
			cp2y: 0,
		},
	];

	const text = useText(phrase);

	if (!text) {
		return [];
	}

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
		instructions: {
			centerPoint: [0, 0, 0, 1] as Vector4D,
			color: 'black',
			isStroke: false,
			points: turnInto3D(
				parsePath(translatePath(resetPath(rect.path), -width / 2, -height / 2))
			),
			shouldDrawLine: true,
		},
		drawSegmentLines: false,
	});

	const progressFace: FaceType = transformFace(
		{
			points: turnInto3D(
				parsePath(
					translatePath(
						resetPath(serializeInstructions(paths)),
						-width / 2 + 1,
						-height / 2 + 1
					)
				)
			),
			color,
			centerPoint: [0, 0, 0, 1] as Vector4D,
			isStroke: false,
			shouldDrawLine: false,
		},
		[translated([0, 0, -depth / 2 - 0.01])]
	);

	const scaled = resetPath(scalePath(text.path, 0.4, 0.4));
	const boundingBoxText = getBoundingBox(scaled);
	const centeredText = translatePath(
		scaled,
		-boundingBoxText.x2 / 2,
		-boundingBoxText.y2 / 2
	);

	const textFace: FaceType = transformFace(
		{
			points: turnInto3D(parsePath(centeredText)),
			color: 'black',
			centerPoint: [0, 0, 0, 1] as Vector4D,
			isStroke: false,
			shouldDrawLine: false,
		},
		[rotated([1, 0, 0], Math.PI), translated([0, 0, depth / 2 + 0.01])]
	);

	const projected = [...extruded, progressFace].map((face) => {
		return projectPoints({
			transformations: [rotated([1, 0, 0], rotation)],
			face,
		});
	});

	const textFaceProjected = projectPoints({
		transformations: [rotated([1, 0, 0], rotation)],
		face: textFace,
	});

	return [...projected, textFaceProjected];
};
