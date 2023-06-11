import {
	getBoundingBox,
	parsePath,
	resetPath,
	scalePath,
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
import {getCamera} from './camera';
import {centerPath} from './center';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {getText, useFont} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {
	FaceType,
	sortFacesZIndex,
	transformFace,
	transformFaces,
	translateSvgInstruction,
} from './map-face';
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
		height: 40,
		width: 40,
		cornerRadius: 20,
	});

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
	});

	const depth = 20;

	const centeredButton = centerPath(shape.path);
	const font = useFont();
	if (!font) {
		return null;
	}
	const text = getText({font, text: String(step), size: 70});

	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));
	const parsedText = parsePath(textPath);

	const push = spring({
		fps,
		frame,
		config: {},
		durationInFrames: 200,
	});

	const cursorDistance = interpolate(push, [0, 1], [100, 0], {});

	const pushIn = Math.min(0, cursorDistance);

	const actualDepth = depth + pushIn;

	const _extrudedButton: FaceType[] = extrudeInstructions({
		points: parsePath(centeredButton),
		depth: actualDepth,
		sideColor: 'black',
		frontFaceColor: '#0b84f3',
		backFaceColor: 'black',
		strokeWidth: 10,
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
		translateY(interpolate(spr, [0, 1], [500, 0])),
		translateY(interpolate(intrude, [0, 1], [0, -20])),
	];

	const extrudedTo0 = transformFaces({
		faces: _extrudedButton,
		transformations: [...transformations],
	});

	const bBoxText = getBoundingBox(textPath);

	const centeredText = turnInto3D(parsedText).map((turn) => {
		return translateSvgInstruction(
			turn,
			-(bBoxText.x2 - bBoxText.x1) / 2,
			-(bBoxText.y2 - bBoxText.y1) / 2,
			0
		);
	});

	const textFace = transformFace(
		{
			centerPoint: [0, 0, 0, 1],
			color: 'white',
			points: centeredText,
			strokeWidth: 0,
			strokeColor: 'black',
		},
		[translateZ(-actualDepth / 2 + 0.001)]
	);

	const radius = interpolate(intrude, [0, 1], [0, 1200]);

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
						sort
						camera={getCamera(viewBox[2], viewBox[3])}
						elements={[
							sortFacesZIndex(extrudedTo0),
							sortFacesZIndex(
								transformFaces({
									transformations,
									faces: [textFace],
								})
							),
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
