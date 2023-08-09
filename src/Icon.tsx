import {parsePath, resetPath, scalePath} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {centerPath} from './center';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {MatrixTransform4D, rotateX, rotateY} from './matrix';

const resizePath = scalePath(
	'M0 64C0 46.3 14.3 32 32 32c229.8 0 416 186.2 416 416c0 17.7-14.3 32-32 32s-32-14.3-32-32C384 253.6 226.4 96 32 96C14.3 96 0 81.7 0 64zM0 416a64 64 0 1 1 128 0A64 64 0 1 1 0 416zM32 160c159.1 0 288 128.9 288 288c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-123.7-100.3-224-224-224c-17.7 0-32-14.3-32-32s14.3-32 32-32z',
	1.5,
	1.5
);

export const Icon: React.FC = () => {
	const cursor = transformElement(
		extrudeElement({
			depth: 20 * 7.5,
			backFaceColor: 'white',
			frontFaceColor: 'white',
			points: parsePath(centerPath(resetPath(resizePath))),
			sideColor: 'black',
			strokeWidth: 20,
			description: 'Cursor',
			strokeColor: 'black',
			crispEdges: true,
		}),
		[]
	);

	const {height, width} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];

	const faces = [cursor];

	const transformations: MatrixTransform4D[] = [
		rotateY(-Math.PI / 8),
		rotateX(0),
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
