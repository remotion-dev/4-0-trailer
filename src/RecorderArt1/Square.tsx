import {noise2D} from '@remotion/noise';
import {parsePath, translatePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	interpolateColors,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {transformAroundItself} from '../element';
import {Faces} from '../Faces';
import {extrudeElement} from '../join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
} from '../matrix';

export const Square: React.FC<{
	left: number;
	top: number;
	size: number;
}> = ({left, top, size}) => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const square = makeRect({
		width: size,
		height: size,
		edgeRoundness: 0.69,
	});

	const angleFromCenter = Math.atan2(top - height / 2, left - width / 2);
	const leftDistanceFromCenter = Math.abs(left - width / 2);
	const topDistanceFromCenter = Math.abs(top - height / 2);
	const distanceFromCenter = Math.sqrt(
		leftDistanceFromCenter ** 2 + topDistanceFromCenter ** 2
	);

	const scaleDelay = distanceFromCenter / 20;

	const scale = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: scaleDelay,
	});

	const willScaleOut = topDistanceFromCenter < 200;

	const removeDelay = distanceFromCenter / 50;
	const scaleOut = willScaleOut
		? spring({
				fps,
				frame,
				config: {
					damping: 200,
				},
				durationInFrames: 15,
				delay: removeDelay + 100,
		  }) * 1.1
		: 0;

	const translated = translatePath(
		square.path,
		left - size / 2,
		top - size / 2
	);

	const xOffset = noise2D('x', frame / 100, left) * 0.2;
	const yOffset = noise2D('y', frame / 100, top) * 0.2;
	const zOffset = noise2D('z', frame / 100, distanceFromCenter) * 0.2;

	const parsed = parsePath(translated);

	const frontFaceColor = interpolateColors(
		distanceFromCenter,
		[0, 1000],
		['#F43B00', 'white']
	);

	const extruded = extrudeElement({
		backFaceColor: 'white',
		sideColor: 'black',
		frontFaceColor,
		depth: 30,
		points: parsed,
		strokeWidth: 6,
		description: 'square',
		strokeColor: 'black',
		crispEdges: true,
	});

	const scaleDown = (distanceFromCenter / 1000) * 0.1;
	const biggestScale = 1 - scaleDown;
	const pullToCenter = distanceFromCenter * scaleDown;
	const x = -Math.cos(angleFromCenter) * pullToCenter;
	const y = -Math.sin(angleFromCenter) * pullToCenter;

	const progress = Math.max(0, scale - scaleOut);

	const transformed = transformAroundItself(extruded, [
		rotateX((Math.sin(angleFromCenter) * distanceFromCenter) / 500 + xOffset),
		rotateY((-Math.cos(angleFromCenter) * distanceFromCenter) / 500 + yOffset),
		rotateZ(zOffset),
		scaled(biggestScale * progress),
		translateX(x),
		translateY(y),
	]);

	return <Faces elements={[transformed]} />;
};
