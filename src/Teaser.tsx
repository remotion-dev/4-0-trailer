import {noise2D} from '@remotion/noise';
import {getSubpaths, parsePath, resetPath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	spring,
	staticFile,
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
import {transformElements} from './map-face';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
} from './matrix';

export const Teaser: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, height, width} = useVideoConfig();
	const viewBox = [0, 0, width, height];

	const font = useFont();

	if (!font) {
		return null;
	}

	const zoomIn = interpolate(frame, [40, 190], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.ease),
	});

	const distance = interpolate(zoomIn, [0, 1], [1, 0.000000005], {});

	const scale = 1 / distance;

	const text = getText({font, text: '4', size: 400});

	const i = 0;

	const triangle = makeTriangle({
		direction: 'right',
		length: 400,
		edgeRoundness: 0.71,
	});
	const path = centerPath(resetPath(triangle.path));
	const parsed = parsePath(path);

	const jumpIn = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 60,
	});

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
		delay: 30,
	});

	const depth = 25;

	const extruded = extrudeElement({
		backFaceColor: BLUE,
		sideColor: 'black',
		frontFaceColor: BLUE,
		depth,
		points: parsed,
		strokeWidth: 15,
		description: `triangle-${i}`,
		strokeColor: 'black',
	});

	const textFace = extrudeElement({
		backFaceColor: BLUE,
		depth,
		points: parsePath(centerPath(resetPath(text.path))),
		strokeWidth: 10,
		description: `text-${i}`,
		strokeColor: 'black',
		frontFaceColor: BLUE,
		sideColor: 'black',
	});

	const align = [translateX(width / 2), translateY(height / 2)];

	const projected = transformElements(
		[extruded],
		[scaled(1.5 - jumpIn * 0.5), rotateY(-spr * Math.PI), ...align]
	);

	const showLogo = spr < 0.5;

	const textScale = zoomIn;
	const textY = interpolate(zoomIn, [0, 1], [2000, 0]);

	const projected2 = transformElement(textFace, [
		rotateY(Math.PI - spr * Math.PI),
		rotateY(-zoomIn * 0.2 - noise2D('x', zoomIn, 0.05) * 0.2),
		rotateX(noise2D('y', zoomIn, 0.05)),
		rotateZ(-zoomIn * 0.1),
		translateY(zoomIn * 20),
		scaled(scale),
		...align,
	]);

	const frontFace = projected2.faces.find((f) =>
		f.description.includes('(front)')
	);

	const mask = threeDIntoSvgPath(frontFace?.points ?? []);
	const subpaths = getSubpaths(mask);

	const thirdText = frame > 320;
	const secondText = frame > 250;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<Audio
				volume={(f: number) => {
					return interpolate(f, [320, 460], [1, 0], {
						extrapolateLeft: 'clamp',
					});
				}}
				startFrom={20}
				src={staticFile('woop.mp3')}
			/>
			<AbsoluteFill style={{}}>
				{showLogo ? null : (
					<AbsoluteFill
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							clipPath: showLogo ? undefined : `path('${subpaths[0]}')`,
						}}
					>
						<h1
							style={{
								textAlign: 'center',
								fontFamily: 'Variable',
								fontVariationSettings: '"wght" 700',
								fontSize: 70,
								transform: `scale(${textScale}) translateY(${textY}px)`,
								lineHeight: 1.4,
							}}
						>
							{secondText && !thirdText ? (
								<>
									<span>Keynote</span>
									<br />
								</>
							) : null}
							{thirdText
								? 'remotion.dev/4'
								: secondText
								? 'July 3rd, 2023'
								: 'Remotion 4.0'}
						</h1>
					</AbsoluteFill>
				)}
				<AbsoluteFill>
					<svg
						viewBox={viewBox.join(' ')}
						style={{
							overflow: 'visible',
						}}
					>
						<Faces
							strokeMiterlimit={50}
							elements={showLogo ? projected : [projected2]}
						/>
					</svg>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
