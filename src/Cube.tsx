import {
	getBoundingBox,
	parsePath,
	resetPath,
	translatePath,
} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	Audio,
	interpolate,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {centerPath} from './center';
import {makeElement, transformElement} from './element';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {translateSvgInstruction} from './map-face';
import {rotateX, rotateY, translateY, translateZ} from './matrix';

const viewBox = [-1600, -800, 3200, 1600];

export const cubeSchema = z.object({
	step: z.number(),
	label: z.string(),
});

export const Cube: React.FC<z.infer<typeof cubeSchema>> = ({label, step}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const shape = makeRect({
		height: 40 * 7.5,
		width: 40 * 7.5,
		cornerRadius: 20 * 7.5,
	});

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
	});

	const depth = 150;

	const centeredButton = centerPath(shape.path);
	const font = useFont();
	if (!font) {
		return null;
	}
	const text = getText({font, text: String(step), size: 131.25});

	const textPath = resetPath(text.path);
	const parsedText = parsePath(textPath);

	const push = spring({
		fps,
		frame,
		config: {},
		durationInFrames: 200,
	});

	const cursorDistance = interpolate(push, [0, 1], [750, 0], {});

	const pushIn = Math.min(0, cursorDistance);

	const actualDepth = depth + pushIn;

	const _extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth: actualDepth,
		sideColor: 'black',
		frontFaceColor: '#0b84f3',
		backFaceColor: 'black',
		strokeWidth: 10,
		description: 'button',
	});

	const intrude = spring({
		fps,
		frame,
		delay: 30,
		config: {},
	});

	const transformations = [
		rotateY((-Math.PI / 4 + frame / 100) * (1 - intrude)),
		rotateX((-Math.PI / 4 + frame / 300) * (1 - intrude)),
		translateY(interpolate(spr, [0, 1], [500 * 7.5, 0])),
		translateY(interpolate(intrude, [0, 1], [0, -20 * 7.5])),
	];

	const extrudedTo0 = transformElement(_extrudedButton, transformations);

	const bBoxText = getBoundingBox(textPath);

	const centeredText = turnInto3D(parsedText).map((turn) => {
		return translateSvgInstruction(
			turn,
			-(bBoxText.x2 - bBoxText.x1) / 2,
			-(bBoxText.y2 - bBoxText.y1) / 2,
			0
		);
	});

	const textFace = transformElement(
		makeElement(
			{
				centerPoint: [0, 0, 0, 1],
				points: centeredText,
				color: 'white',
				strokeColor: 'black',
				strokeWidth: 0,
			},
			[0, 0, 0, 1],
			'text'
		),
		[translateZ(-actualDepth / 2 + 0.001)]
	);

	const radius = interpolate(intrude, [0, 1], [0, 1200 * 7.5]);

	const circleMask = makeCircle({
		radius,
	});
	const x = translatePath(
		circleMask.path,
		width / 2 - radius,
		height / 2 - radius
	);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'white',
					clipPath: `url(#myClip)`,
				}}
			>
				<svg width="0" height="0" id="mask">
					<defs>
						<clipPath id="myClip">
							<path d={x} />
						</clipPath>
					</defs>
				</svg>
				<div
					style={{
						fontFamily: 'GT Planar',
						fontWeight: 'bold',
						fontSize: 65,
						marginTop: 200,
					}}
				>
					{label}
				</div>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
					<Faces
						elements={[
							extrudedTo0,
							transformElement(textFace, transformations),
						]}
					/>
				</svg>
			</AbsoluteFill>
			<Sequence from={10}>
				<Audio src={staticFile('fireball.mp3')} />
			</Sequence>
		</AbsoluteFill>
	);
};
