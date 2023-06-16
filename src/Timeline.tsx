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

type Track = {
	x: number;
	depth: number;
	frontColor: string;
	backColor: string;
	width: number;
};

const TRACK_HEIGHT = 10;
const LAYER_DEPTH = 5;

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
			backFaceColor: 'black',
			frontFaceColor: f.frontColor,
			points: makeRect({
				width: f.width,
				height: TRACK_HEIGHT,
				cornerRadius: 0,
			}).instructions,
			sideColor: 'rgba(0,0,0,1)',
			strokeWidth: 1,
			description: 'Track' + i,
		});
		return transformElement(faces, [
			translateX(f.x),
			translateY((TRACK_HEIGHT + 1) * i),
			translateZ(-i * 0.01),
		]);
	});

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
