import {parsePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';

export const Recorder: React.FC = () => {
	const {width, height} = useVideoConfig();

	const viewBox = [-width / 2, -height / 2, width, height];

	const square = makeRect({
		width: 100,
		height: 100,
		cornerRadius: 10,
	});

	const parsed = parsePath(square.path);

	const extruded = extrudeElement({
		backFaceColor: 'black',
		sideColor: 'black',
		frontFaceColor: 'red',
		depth: 100,
		points: parsed,
		strokeWidth: 20,
		description: 'square',
		strokeColor: 'black',
		crispEdges: false,
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg
				viewBox={viewBox.join(' ')}
				style={{
					overflow: 'visible',
				}}
			>
				<Faces elements={[extruded]} />
			</svg>
		</AbsoluteFill>
	);
};
