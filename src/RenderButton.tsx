import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {getCamera} from './camera';
import {centerPath} from './center';
import {BLUE} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	translateX,
	translateY,
	translateZ,
} from './matrix';

const viewBox = [-1600, -800, 3200, 1600];

const cursorPath = scalePath(
	resetPath(
		'M32 32L0 46.9V432l29 31.8 96.1-117.2 48.2 102.7 13.6 29 57.9-27.2-13.6-29L183.3 320H320l-.1-42L32 32z'
	),
	0.75,
	0.75
);

export const RenderButton: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const shape = makeRect({
		height: 450,
		width: 1500,
		cornerRadius: 112.5,
	});

	const depth = 225;
	const cursorDepth = 75;

	const centeredButton = centerPath(shape.path);

	const font = useFont();
	if (!font) {
		return null;
	}
	const text = getText({font, text: 'Render video'});

	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));
	const parsedText = parsePath(textPath);

	const transformations = [
		rotateY(-Math.PI / 4 + frame / 100),
		rotateX(-Math.PI / 4 + frame / 600),
	];

	const push = spring({
		fps,
		frame,
		config: {},
		durationInFrames: 600,
	});

	const cursorDistance = interpolate(push, [0, 1], [750, 0], {});

	const pushIn = Math.min(0, cursorDistance);

	const _extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth: depth + pushIn,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: 'black',
		strokeWidth: 20,
		description: 'button',
	});

	const extrudedTo0 = transformElement(_extrudedButton, [
		translateZ(-(depth + pushIn) / 2),
		...transformations,
	]);

	const extrudedCursor = extrudeElement({
		points: parsePath(cursorPath),
		depth: cursorDepth,
		sideColor: 'black',
		frontFaceColor: 'white',
		backFaceColor: 'white',
		strokeWidth: 20,
		description: 'cursor',
	});

	const bBoxText = getBoundingBox(textPath);

	const centeredText = turnInto3D({
		instructions: parsedText,
		strokeColor: 'black',
		color: 'white',
		strokeWidth: 0,
		description: 'centered text',
	});

	const textFace = transformElement(centeredText, [
		translateX(-(bBoxText.x2 - bBoxText.x1) / 2),
		translateY(-(bBoxText.y2 - bBoxText.y1) / 2),
		translateZ(-depth - 0.001 - pushIn),
	]);

	const movedCursor = transformElement(extrudedCursor, [
		rotateY(Math.PI / 2),
		rotateX(-Math.PI / 4),
		rotateZ(-interpolate(push, [0, 1], [Math.PI * 2, 0])),
		translateZ(Number(-depth - 0.001) - cursorDistance),
		...transformations,
	]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'white',
				}}
			>
				<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
					<Faces
						camera={getCamera(viewBox[2], viewBox[3])}
						elements={[
							extrudedTo0,
							transformElement(textFace, transformations),
							movedCursor,
						]}
					/>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
