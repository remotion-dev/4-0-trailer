import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {getCamera} from './camera';
import {BLUE} from './colors';
import {Faces} from './Faces';
import {extrudeInstructions} from './join-inbetween-tiles';
import {projectFaces} from './map-face';
import {rotated, translated} from './matrix';

const cursorHandlerPath = scalePath(
	'M16.0234 0.73407H142.355C150.64 0.73407 157.355 7.4498 157.355 15.7341V69.0469C157.355 73.4503 155.421 77.6313 152.064 80.4813L88.398 134.538C88.398 134.538 91.5 2925.5 91.5 2938.5C91.5 2951.5 72.0829 2952 72.0829 2938.5C72.0829 2925 68.9809 134.538 68.9809 134.538L5.66765 80.7808C2.08724 77.7408 0.0234375 73.2811 0.0234375 68.5842V16.7341C0.0234375 7.89751 7.18688 0.73407 16.0234 0.73407Z',
	0.08,
	0.08
);

type Track = {
	x: number;
	y: number;
};

export const Timeline: React.FC = () => {
	const {width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();
	const xRotation = frame / 100;

	const face1 = projectFaces({
		faces: extrudeInstructions({
			depth: 20,
			backFaceColor: 'black',
			frontFaceColor: BLUE,
			points: makeRect({width: 150, height: 20, cornerRadius: 2}).instructions,
			sideColor: 'black',
			shouldDrawLine: true,
			strokeWidth: 8,
		}),
		transformations: [],
	});

	const face2 = projectFaces({
		faces: extrudeInstructions({
			depth: 20,
			backFaceColor: 'black',
			frontFaceColor: BLUE,
			points: makeRect({width: 150, height: 20, cornerRadius: 2}).instructions,
			sideColor: 'black',
			shouldDrawLine: true,
			strokeWidth: 8,
		}),
		transformations: [translated([40, 20, 0])],
	});

	const face3 = projectFaces({
		faces: extrudeInstructions({
			depth: 20,
			backFaceColor: 'black',
			frontFaceColor: GREEN,
			points: makeRect({width: 150, height: 20, cornerRadius: 2}).instructions,
			sideColor: 'black',
			shouldDrawLine: true,
			strokeWidth: 8,
		}),
		transformations: [translated([80, 40, 0])],
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
		transformations: [translated([frame - 6, -10, -10])],
	});

	return (
		<svg viewBox={viewBox.join(' ')}>
			<Faces
				camera={getCamera(viewBox[2], viewBox[3])}
				faces={projectFaces({
					transformations: [
						translated([-30, -30, 0]),
						rotated([-1, 0, 0], xRotation),
					],
					faces: [...face1, ...face2, ...face3, ...cursor],
				})}
			/>
		</svg>
	);
};
