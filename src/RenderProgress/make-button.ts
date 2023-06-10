import {
	getBoundingBox,
	parsePath,
	resetPath,
	scalePath,
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
import {makeRoundedProgress} from './make-rounded-progress';

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
		cornerRadius: outerCornerRadius,
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
		strokeWidth: 20,
	});

	const progressFace: FaceType = transformFace({
		face: {
			points: makeRoundedProgress({
				outerCornerRadius,
				boxHeight,
				evolve,
				height,
				width,
				padding,
				boxWidth,
			}),
			color,
			centerPoint: [0, 0, 0, 1] as Vector4D,
			shouldDrawLine: false,
			strokeWidth: 20,
		},
		transformations: [translateZ(-depth / 2 - 0.0001)],
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
			strokeWidth: 0,
		},
		transformations: [rotateX(Math.PI), translateZ(depth / 2 + 0.0001)],
	});

	const projected = transformFaces({
		transformations: [rotateX(rotation), ...transformations],
		faces: [...extruded, progressFace, textFace],
	});

	return sortFacesZIndex(projected);
};
