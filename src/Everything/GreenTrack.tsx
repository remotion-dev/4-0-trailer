import {parsePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {centerPath} from '../center';
import {GREEN} from '../colors';
import {transformElement} from '../element';
import {Faces} from '../Faces';
import {extrudeElement} from '../join-inbetween-tiles';
import {
	MatrixTransform4D,
	rotateX,
	rotateY,
	translateX,
	translateY,
} from '../matrix';

export const GreenTrack: React.FC = () => {
	const shape = makeRect({
		height: 300,
		width: 1000,
		cornerRadius: 60,
	});
	const {height, width} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];

	const depth = 100;

	const centeredButton = centerPath(shape.path);

	const extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth,
		sideColor: 'black',
		frontFaceColor: GREEN,
		backFaceColor: 'black',
		strokeWidth: 20,
		description: 'Button',
		strokeColor: 'black',
		crispEdges: false,
	});

	const faces = [extrudedButton];
	const transformations: MatrixTransform4D[] = [
		translateX(-800),
		translateY(400),
		rotateX(-Math.PI / 4),
		rotateY(-Math.PI / 4),
	];

	return (
		<AbsoluteFill>
			<svg viewBox={viewBox.join(' ')}>
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
