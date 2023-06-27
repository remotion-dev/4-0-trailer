import {parsePath, resetPath, scalePath} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {transformElement} from '../element';
import {Faces} from '../Faces';
import {extrudeElement} from '../join-inbetween-tiles';
import {MatrixTransform4D, rotateX, rotateY, translateY} from '../matrix';

const cursorHandlerPath = scalePath(
	'M16.0234 0.73407H142.355C150.64 0.73407 157.355 7.4498 157.355 15.7341V69.0469C157.355 73.4503 155.421 77.6313 152.064 80.4813L88.398 134.538C88.398 134.538 91.5 2925.5 91.5 2938.5C91.5 2951.5 72.0829 2952 72.0829 2938.5C72.0829 2925 68.9809 134.538 68.9809 134.538L5.66765 80.7808C2.08724 77.7408 0.0234375 73.2811 0.0234375 68.5842V16.7341C0.0234375 7.89751 7.18688 0.73407 16.0234 0.73407Z',
	1.2,
	1.2
);

export const EverythingCursor: React.FC = () => {
	const frame = useCurrentFrame();

	const cursor = transformElement(
		extrudeElement({
			depth: 2 * 7.5,
			backFaceColor: '#ff3232',
			frontFaceColor: '#ff3232',
			points: parsePath(resetPath(cursorHandlerPath)),
			sideColor: 'black',
			strokeWidth: 20,
			description: 'Cursor',
			strokeColor: 'black',
			crispEdges: false,
		}),
		[]
	);
	const {height, width} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];

	const faces = [cursor];

	const transformations: MatrixTransform4D[] = [
		translateY(-frame * 3),
		rotateX(Math.PI / 8),
		rotateY(Math.PI / 8 - frame / 40),
	];

	return (
		<AbsoluteFill>
			<svg style={{}} viewBox={viewBox.join(' ')}>
				<Faces
					noSort
					elements={faces.flat(1).map((element) => {
						return transformElement(element, transformations);
					})}
				/>
			</svg>
		</AbsoluteFill>
	);
};
