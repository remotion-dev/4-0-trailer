import {makeRect} from '@remotion/shapes';
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {rotateX, rotateY, translateX, translateY} from './matrix';

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
			x: 10,
			frontColor: 'red',
			backColor: 'blue',
			width: 10,
		},
		{
			depth: LAYER_DEPTH,
			x: 20,
			frontColor: 'green',
			backColor: 'orange',
			width: 10,
		},
	];

	const facesProject = faces.map((f, i) => {
		const faces = extrudeElement({
			depth: LAYER_DEPTH,
			backFaceColor: f.backColor,
			frontFaceColor: f.frontColor,
			points: makeRect({
				width: f.width,
				height: TRACK_HEIGHT,
				cornerRadius: 0,
			}).instructions,
			sideColor: 'yellow',
			strokeWidth: 1,
			description: 'Track' + i,
		});
		return transformElement(faces, [
			translateX(f.x),
			translateY(TRACK_HEIGHT * i),
		]);
	});

	const facesMapped = useMemo(() => {
		return [...facesProject];
	}, [facesProject]);

	const elements = facesMapped.map((element) => {
		return transformElement(element, [
			rotateY(frame / 100),
			rotateX(frame / 20),
		]);
	});

	console.log({elements});

	return (
		<svg
			style={{
				backgroundColor: 'white',
			}}
			viewBox={viewBox.join(' ')}
		>
			<Faces elements={elements} />
		</svg>
	);
};
