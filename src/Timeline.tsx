import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BLUE} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	translateX,
	translateY,
	translateZ,
} from './matrix';

const cursorHandlerPath = scalePath(
	'M16.0234 0.73407H142.355C150.64 0.73407 157.355 7.4498 157.355 15.7341V69.0469C157.355 73.4503 155.421 77.6313 152.064 80.4813L88.398 134.538C88.398 134.538 91.5 2925.5 91.5 2938.5C91.5 2951.5 72.0829 2952 72.0829 2938.5C72.0829 2925 68.9809 134.538 68.9809 134.538L5.66765 80.7808C2.08724 77.7408 0.0234375 73.2811 0.0234375 68.5842V16.7341C0.0234375 7.89751 7.18688 0.73407 16.0234 0.73407Z',
	0.6,
	0.6
);

type Track = {
	x: number;
	depth: number;
	frontColor: string;
	backColor: string;
	width: number;
};

const TRACK_HEIGHT = 10;
const LAYER_DEPTH = 5;
const CURSOR_DEPTH = 15;

export const Timeline: React.FC = () => {
	const viewBox = [-50, -50, 100, 100];
	const frame = useCurrentFrame();

	const faces: Track[] = [
		{
			depth: LAYER_DEPTH,
			x: 0,
			frontColor: 'red',
			backColor: 'black',
			width: 10,
		},
		{
			depth: LAYER_DEPTH,
			x: 2,
			frontColor: BLUE,
			backColor: 'black',
			width: 10,
		},
	];

	const facesProject = faces.map((f, i) => {
		const faces = extrudeElement({
			depth: LAYER_DEPTH,
			backFaceColor: 'transparent',
			frontFaceColor: f.frontColor,
			points: makeRect({
				width: f.width,
				height: TRACK_HEIGHT,
				cornerRadius: 0,
			}).instructions,
			sideColor: 'rgba(0,0,0,0)',
			strokeWidth: 1,
			description: 'Track' + i,
		});
		return transformElement(faces, [
			translateX(f.x),
			translateY(TRACK_HEIGHT * i),
			translateZ(-i * 0.01),
		]);
	});

	const cursor = transformElement(
		extrudeElement({
			depth: CURSOR_DEPTH,
			backFaceColor: 'black',
			frontFaceColor: 'red',
			points: parsePath(resetPath(cursorHandlerPath)),
			sideColor: 'black',
			strokeWidth: 10,
			description: 'cursor',
		}),
		[
			translateZ(LAYER_DEPTH / 2 + CURSOR_DEPTH / 2),
			translateX((frame - 6) * 7.5),
			translateY(-12 * 7.5),
		]
	);

	const facesMapped = useMemo(() => {
		return [...facesProject];
	}, [facesProject]);

	return (
		<svg
			style={{
				backgroundColor: 'white',
			}}
			viewBox={viewBox.join(' ')}
		>
			<Faces
				elements={facesMapped.map((element) => {
					return transformElement(element, [
						rotateX(-interpolate(frame, [-200, 200], [0, Math.PI / 4])),
						rotateZ(-frame / 150),
						rotateY(interpolate(frame, [0, 400], [0, -Math.PI])),
					]);
				})}
			/>
		</svg>
	);
};
