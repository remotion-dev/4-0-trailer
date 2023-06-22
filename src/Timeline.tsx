import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BLUE, GREEN} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
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

const TRACK_HEIGHT = 150;
const LAYER_DEPTH = 150;

export const Timeline: React.FC = () => {
	const {width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const xRotation = interpolate(frame, [-200, 200], [0, Math.PI / 4]);
	const scale = interpolate(frame, [0, 300], [1.3, 1.8]);

	const faces: Track[] = [
		{
			depth: LAYER_DEPTH,
			x: 0,
			frontColor: BLUE,
			backColor: 'black',
			width: 150 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 40 * 7.5,
			frontColor: BLUE,
			backColor: 'black',
			width: 150 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 60 * 7.5,
			frontColor: GREEN,
			backColor: 'black',
			width: 150 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 60 * 7.5,
			frontColor: BLUE,
			backColor: 'black',
			width: 300 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 30 * 7.5,
			frontColor: BLUE,
			backColor: 'black',
			width: 300 * 7.5,
		},
	];

	const facesProject = faces.map((f, i) => {
		return transformElement(
			extrudeElement({
				depth: 20 * 7.5,
				backFaceColor: f.backColor,
				frontFaceColor: f.frontColor,
				points: makeRect({
					width: f.width,
					height: TRACK_HEIGHT,
					cornerRadius: 15,
				}).instructions,
				sideColor: 'black',
				strokeWidth: 10,
				description: `Track ${i}`,
				strokeColor: 'black',
			}),
			[
				translateX(f.x),
				translateY((TRACK_HEIGHT + 2) * i),
				translateZ(
					spring({
						frame,
						delay: i * 20 - 40,
						fps,
						from: 1,
						to: 0,
						config: {
							damping: 200,
						},
						durationInFrames: 80,
					}) *
						200 *
						7.5
				),
			]
		);
	});

	const cursor = transformElement(
		extrudeElement({
			depth: 2 * 7.5,
			backFaceColor: 'black',
			frontFaceColor: 'red',
			points: parsePath(resetPath(cursorHandlerPath)),
			sideColor: 'black',
			strokeWidth: 10,
			description: 'Cursor',
			strokeColor: 'black',
		}),
		[
			translateX((frame - 6) * 7.5),
			translateY(-12 * 7.5),
			translateZ(-LAYER_DEPTH / 2 - 1),
		]
	);

	const facesMapped = useMemo(() => {
		return [...facesProject, cursor];
	}, [cursor, facesProject]);

	return (
		<svg
			style={{
				backgroundColor: 'white',
			}}
			viewBox={viewBox.join(' ')}
		>
			<Faces
				noSort
				elements={facesMapped.map((element) => {
					return transformElement(element, [
						translateX(-frame * 0.6 * 7.5),
						translateY(-30 * 7.5),
						rotateX(-xRotation),
						rotateZ(-frame / 1500),
						rotateY(interpolate(frame, [0, 4000], [0, -Math.PI])),
						scaled(scale),
					]);
				})}
			/>
		</svg>
	);
};
