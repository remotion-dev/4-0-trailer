import {
	getBoundingBox,
	parsePath,
	scalePath,
	translatePath,
} from '@remotion/paths';
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {transformAroundItself} from '../element';
import {Faces} from '../Faces';
import {extrudeElement} from '../join-inbetween-tiles';
import {rotateX, scaled} from '../matrix';

export const Square: React.FC<{
	left: number;
	top: number;
}> = ({left, top}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const _path =
		'M93.6661 0.180298C84.6844 0.66449 77.4465 2.0799 70.1524 4.83621C66.5147 6.19574 60.5519 9.15695 57.2704 11.2055C43.5447 19.7538 33.0816 32.6042 27.6251 47.559C26.5376 50.5201 23.5936 59.9623 21.6998 66.462C9.08037 109.911 1.91749 157.42 0.379905 207.704C0.136142 215.712 0.136142 234.783 0.379905 242.661C1.41121 275.997 4.61763 306.093 10.4304 336.785C12.7931 349.207 16.5808 365.894 18.7746 373.474C23.2561 388.875 32.4066 401.986 45.4198 411.596C54.139 418.04 64.0396 422.361 75.0089 424.484C80.2967 425.508 87.272 425.974 92.4098 425.639C99.5164 425.173 113.617 423.292 125.074 421.262C176.714 412.118 224.417 395.747 267.675 372.319C295.071 357.476 318.491 341.404 341.086 321.905C363.606 302.499 382.807 281.622 399.701 258.193C403.62 252.773 405.589 249.607 407.558 245.622C412.621 235.342 415.002 225.117 414.983 213.682C414.983 203.03 412.958 193.569 408.589 183.884C406.489 179.21 404.483 175.858 399.982 169.488C383.407 146.041 365.012 125.611 342.586 105.758C307.821 74.9917 266.532 49.7566 220.423 31.077C210.429 27.0357 200.584 23.4785 188.734 19.6234C163.645 11.4849 132.593 4.42648 106.323 0.906616C102.198 0.3479 96.5913 0.031311 93.6661 0.180298Z';

	const path = scalePath(_path, 0.2, 0.2);

	const dim = getBoundingBox(path);

	const translated = translatePath(
		path,
		left - dim.width / 2,
		top - dim.height / 2
	);

	const parsed = parsePath(translated);

	const frontFaceColor = '#0984F3';

	const scale1 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 10,
	});

	const scale2 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 15,
	});

	const extruded = extrudeElement({
		backFaceColor: '#0984F3',
		sideColor: frame > 20 ? 'transparent' : 'black',
		frontFaceColor,
		depth: 30,
		points: parsed,
		strokeWidth: interpolate(scale2, [0, 0.5], [scale1 * 6, 0]),
		description: 'square',
		strokeColor: frame > 20 ? 'transparent' : 'black',
		crispEdges: true,
	});

	const rotate = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
	});

	const transformed = transformAroundItself(extruded, [
		scaled(scale1 * 1.3),
		rotateX(rotate * Math.PI * 2),
		scaled(1 - scale2 * 0.4),
	]);

	return <Faces elements={[transformed]} />;
};
