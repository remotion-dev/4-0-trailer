import {parsePath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from '../center';
import {BLUE} from '../colors';
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

export const EverythingTriangle: React.FC = () => {
	const frame = useCurrentFrame();
	const shape = makeTriangle({
		direction: 'right',
		length: 500,
		edgeRoundness: 0.71,
	});
	const {height, width} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];

	const depth = 100;

	const centeredButton = centerPath(shape.path);

	const extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: 'black',
		strokeWidth: 20,
		description: 'Button',
		strokeColor: 'black',
		crispEdges: false,
	});

	const faces = [extrudedButton];
	const transformations: MatrixTransform4D[] = [
		translateY(400 - frame),
		rotateX(-Math.PI / 4),
		rotateY(-Math.PI / 16 - frame / 250),
		translateX(300),
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
