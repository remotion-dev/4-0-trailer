import {spring} from 'remotion';
import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {
	getBoundingBox,
	parsePath,
	resetPath,
	scalePath,
	translatePath,
} from '@remotion/paths';
import {turnInto3D} from '../fix-z';
import {useText} from '../get-char';
import {FaceType, transformFace} from '../map-face';
import {rotated, translated, Vector4D} from '../matrix';
import {makeRect} from '@remotion/shapes';
import {extrudeInstructions} from '../join-inbetween-tiles';
import {projectPoints} from '../project-points';

export const useButton = (
	phrase: string,
	depth: number,
	color: string,
	delay: number
) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const rect = makeRect({
		height: 100,
		width: 300,
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

	const frontFace = makeRect({
		height: 98,
		width: Math.max(40, 300 * evolve) - 2,
		cornerRadius: 30,
	});

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
						resetPath(frontFace.path),
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
