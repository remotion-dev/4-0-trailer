import {parsePath, resetPath} from '@remotion/paths';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from './center';
import {BLUE} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {rotateX, rotateY, rotateZ, scaled, translateY} from './matrix';

export const MyComposition = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();

	const font = useFont();
	if (!font) {
		return null;
	}

	const text = getText({font, text: '4'});

	const depth = 80;

	const inbetweenFaces = extrudeElement({
		points: parsePath(centerPath(resetPath(text.path))),
		depth,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: BLUE,
		strokeWidth: 10,
		description: 'text',
	});

	const progress = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 40,
	});

	const distance = interpolate(frame, [0, 120], [1, 0.0000001], {
		extrapolateRight: 'clamp',
	});

	const scale = progress * (1 / distance);

	const rotatedFaces = transformElement(inbetweenFaces, [
		translateY(20),
		rotateY(-0.4 + frame / 200),
		rotateX(-frame / 400),
		rotateZ(0.4 - frame / 300),
		scaled(scale),
	]);

	return (
		<svg
			viewBox={[-width / 2, -height / 2, width, height].join(' ')}
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			<Faces elements={[rotatedFaces]} />
		</svg>
	);
};
