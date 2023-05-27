import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import React from 'react';
import {Faces} from './Faces';
import {getCamera} from './camera';
import {makeRect} from '@remotion/shapes';
import {
	getBoundingBox,
	parsePath,
	resetPath,
	scalePath,
	translatePath,
} from '@remotion/paths';
import {turnInto3D} from './fix-z';
import {extrudeInstructions} from './join-inbetween-tiles';
import {rotated, translated, Vector4D} from './matrix';
import {projectPoints} from './project-points';
import {FaceType, transformFace} from './map-face';
import {useText} from './get-char';

const viewBox = [-1600, -800, 3200, 1600];
const color = '#0b84f3';
const depth = 20;

export const RenderProgress: React.FC = () => {
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
		delay: 50,
	});

	const evolve = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 10,
	});

	const frontFace = makeRect({
		height: 98,
		width: Math.max(40, 300 * evolve) - 2,
		cornerRadius: 30,
	});

	const text = useText('one.mp4');

	if (!text) {
		return null;
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
					translatePath(resetPath(frontFace.path), -width / 2, -height / 2)
				)
			),
			color,
			centerPoint: [0, 0, 0, 1] as Vector4D,
			isStroke: false,
			shouldDrawLine: false,
		},
		[translated([1, 1, -depth / 2 - 0.01])]
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

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
				<Faces
					camera={getCamera(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1])}
					faces={[...projected, textFaceProjected]}
				/>
			</svg>
		</AbsoluteFill>
	);
};
