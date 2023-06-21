import {getSubpaths, parsePath, resetPath} from '@remotion/paths';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {threeDIntoSvgPath} from './3d-svg';
import {centerPath} from './center';
import {BLUE} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {loadFont} from './load-font';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
} from './matrix';

export const MyComposition = () => {
	const frame = useCurrentFrame() * 1.3;
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
		strokeColor: 'black',
	});

	const progress = spring({
		fps,
		frame,
		config: {
			damping: 20,
		},
		durationInFrames: 40,
	});

	const fromRight = interpolate(progress, [0, 1], [width * 0.75, 0], {
		extrapolateLeft: 'clamp',
	});

	const zoomIn = interpolate(frame, [0, 120], [0, 1], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.ease),
	});

	const distance = interpolate(zoomIn, [0, 1], [1, 0.000000005]);

	const scale = 1 / distance;

	const textScale = 1 - distance;
	const textY = interpolate(progress, [0, 1], [2000000, 0]);

	const rotatedFaces = transformElement(inbetweenFaces, [
		translateY(20),
		rotateY(-0.4 + frame / 200),
		rotateX(0.3 - frame / 400),
		rotateZ(0.4 - frame / 300),
		scaled(scale),
		translateX(width / 2),
		translateY(height / 2),
		translateX(fromRight),
	]);

	const frontFace = rotatedFaces.faces.find((f) =>
		f.description.includes('(front)')
	);

	const mask = threeDIntoSvgPath(frontFace?.points ?? []);

	const subpaths = getSubpaths(mask);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					clipPath: `path('${subpaths[0]}')`,
					fontFamily: 'Variable',
					fontVariationSettings: '"wght" 600',
					position: 'relative',
				}}
			>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						fontFamily: 'Variable',
						backgroundColor: 'white',
						fontVariationSettings: '"wght" 600',
						position: 'absolute',
						display: 'flex',
					}}
				>
					<h1
						style={{
							fontSize: 80,
							scale: String(textScale),
							translate: '0 ' + String(textY) + 'px',
						}}
					>
						Introducing Remotion 4.0
					</h1>
				</AbsoluteFill>
			</AbsoluteFill>
			<AbsoluteFill>
				<svg
					viewBox={[0, 0, width, height].join(' ')}
					style={{
						width: '100%',
					}}
				>
					<Faces elements={[rotatedFaces]} />
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

loadFont();
