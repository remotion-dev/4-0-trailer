import {parsePath, resetPath, scalePath} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {transformElement} from '../element';
import {Faces} from '../Faces';
import {extrudeElement} from '../join-inbetween-tiles';
import {MatrixTransform4D, rotateX, rotateY, translateX} from '../matrix';

const resizePath = scalePath(
	'M958.662 291.309C959.513 290.527 960 289.414 960 288.25C960 287.085 959.513 285.99 958.662 285.19L939.193 267.112C937.976 265.982 936.203 265.687 934.691 266.347C933.178 267.008 932.188 268.52 932.188 270.172V279.906H898.812V270.172C898.812 268.52 897.822 267.008 896.309 266.347C894.797 265.687 893.024 265.982 891.807 267.112L872.338 285.19C871.487 285.99 871 287.085 871 288.25C871 289.414 871.487 290.51 872.338 291.309L891.807 309.387C893.024 310.517 894.797 310.813 896.309 310.152C897.822 309.492 898.812 307.979 898.812 306.328V296.594H932.188V306.328C932.188 307.979 933.178 309.492 934.691 310.152C936.203 310.813 937.976 310.517 939.193 309.387L958.662 291.309Z',
	3,
	3
);

export const Resize: React.FC = () => {
	const cursor = transformElement(
		extrudeElement({
			depth: 2 * 7.5,
			backFaceColor: 'black',
			frontFaceColor: 'black',
			points: parsePath(resetPath(resizePath)),
			sideColor: '#eee',
			strokeWidth: 10,
			description: 'Cursor',
			strokeColor: '#eee',
			crispEdges: false,
		}),
		[]
	);
	const {height, width} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];

	const faces = [cursor];

	const transformations: MatrixTransform4D[] = [
		translateX(400),
		rotateY(Math.PI / 4),
		rotateX(Math.PI / 4),
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
