import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {getCamera} from './camera';
import {BLUE, GREEN} from './colors';
import {Faces} from './Faces';
import {extrudeInstructions} from './join-inbetween-tiles';
import {projectElements, projectFaces} from './map-face';
import {rotated, scaled, translateX, translateY, translateZ} from './matrix';

const cursorHandlerPath = scalePath(
	'M16.0234 0.73407H142.355C150.64 0.73407 157.355 7.4498 157.355 15.7341V69.0469C157.355 73.4503 155.421 77.6313 152.064 80.4813L88.398 134.538C88.398 134.538 91.5 2925.5 91.5 2938.5C91.5 2951.5 72.0829 2952 72.0829 2938.5C72.0829 2925 68.9809 134.538 68.9809 134.538L5.66765 80.7808C2.08724 77.7408 0.0234375 73.2811 0.0234375 68.5842V16.7341C0.0234375 7.89751 7.18688 0.73407 16.0234 0.73407Z',
	0.08,
	0.08
);

type Track = {
	x: number;
	depth: number;
	frontColor: string;
	backColor: string;
	width: number;
};

const TRACK_HEIGHT = 20;
const LAYER_DEPTH = 20;

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
			width: 150,
		},
		{
			depth: LAYER_DEPTH,
			x: 40,
			frontColor: BLUE,
			backColor: 'black',
			width: 150,
		},
		{
			depth: LAYER_DEPTH,
			x: 60,
			frontColor: GREEN,
			backColor: 'black',
			width: 150,
		},
		{
			depth: LAYER_DEPTH,
			x: 60,
			frontColor: BLUE,
			backColor: 'black',
			width: 300,
		},
		{
			depth: LAYER_DEPTH,
			x: 30,
			frontColor: BLUE,
			backColor: 'black',
			width: 300,
		},
	];

	const facesProject = faces.map((f, i) => {
		return projectFaces({
			faces: extrudeInstructions({
				depth: 20,
				backFaceColor: f.backColor,
				frontFaceColor: f.frontColor,
				points: makeRect({
					width: f.width,
					height: TRACK_HEIGHT,
					cornerRadius: 2,
				}).instructions,
				sideColor: 'black',
				shouldDrawLine: true,
				strokeWidth: 8,
			}),
			transformations: [
				translateX(f.x),
				translateY((TRACK_HEIGHT + 2) * i),
				translateZ(
					spring({
						frame,
						delay: i * 20,
						fps,
						from: 1,
						to: 0,
						durationInFrames: 50,
					}) * 200
				),
			],
		});
	});

	const cursor = projectFaces({
		faces: extrudeInstructions({
			depth: 2,
			backFaceColor: 'black',
			frontFaceColor: 'red',
			points: parsePath(resetPath(cursorHandlerPath)),
			shouldDrawLine: true,
			sideColor: 'black',
			strokeWidth: 8,
		}),
		transformations: [
			translateX(frame - 6),
			translateY(-12),
			translateZ(-LAYER_DEPTH / 2 - 1),
		],
	});

	const facesMapped = useMemo(() => {
		return [...facesProject.flat(1), cursor];
	}, [cursor, facesProject]);

	return (
		<svg
			style={{
				backgroundColor: 'white',
			}}
			viewBox={viewBox.join(' ')}
		>
			<Faces
				sort={false}
				camera={getCamera(viewBox[2], viewBox[3])}
				elements={projectElements({
					transformations: [
						translateX(-frame * 0.6),
						translateY(-30),
						rotated([-1, 0, 0], xRotation),
						rotated([0, 0, 1], -frame / 1500),
						rotated([0, 1, 0], interpolate(frame, [0, 4000], [0, -Math.PI])),
						scaled([scale, scale, scale]),
					],
					threeDElements: facesMapped,
				})}
			/>
		</svg>
	);
};
