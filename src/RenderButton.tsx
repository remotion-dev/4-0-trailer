import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {centerPath} from './center';
import {BLUE} from './colors';
import {makeElement, transformElement} from './element';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {makeFace, transformElements} from './map-face';
import {rotateX, rotateY, rotateZ, translateZ} from './matrix';

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

	const transformations = [
		rotateY(-Math.PI / 4 + frame / 100),
		rotateX(-Math.PI / 4 + frame / 400),
	];

	const push = spring({
		fps,
		frame,
		durationInFrames: 290,
		config: {
			damping: 200,
		},
	});

	const push2 = spring({
		fps,
		frame,
		durationInFrames: 30,
		config: {
			damping: 10,
		},
		delay: 190,
	});

	const cursorDistance =
		interpolate(push, [0, 1], [1250, 100], {}) -
		interpolate(push2, [0, 1], [0, 200], {});

	const pressIn = Math.min(0, cursorDistance);

	const actualDepth = depth + pressIn;

	const extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth: actualDepth,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: 'black',
		strokeWidth: 20,
		description: 'Button',
		strokeColor: 'black',
		crispEdges: false,
	});

	const extrudedCursor = extrudeElement({
		points: parsePath(resetPath(cursorPath)),
		depth: cursorDepth,
		sideColor: 'black',
		frontFaceColor: 'white',
		backFaceColor: 'white',
		strokeWidth: 20,
		description: 'Cursor',
		strokeColor: 'black',
		crispEdges: true,
	});

	const textFace = makeFace({
		fill: 'white',
		points: centerPath(textPath),
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'Text',
		crispEdges: false,
	});

	const textElement = transformElement(
		makeElement(textFace, textFace.centerPoint, 'Button text'),
		[translateZ(-actualDepth / 2 - 0.001)]
	);

	const movedCursor = transformElement(extrudedCursor, [
		translateZ(-cursorDepth / 2 - 0.001),
		rotateY(Math.PI / 2),
		rotateX(-Math.PI / 4),
		rotateZ(-interpolate(push, [0, 1], [Math.PI * 2, 0])),
		translateZ(Number(-depth / 2 - 0.001) - cursorDistance),
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
						noSort
						strokeMiterlimit={1000}
						elements={transformElements(
							[extrudedButton, textElement, movedCursor],
							transformations
						)}
					/>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
