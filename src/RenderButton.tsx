import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {getCamera} from './camera';
import {centerPath} from './center';
import {BLUE} from './colors';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {
	FaceType,
	projectFaces,
	transformFace,
	translateSvgInstruction,
} from './map-face';
import {rotateX, rotateY, rotateZ, translateZ} from './matrix';

const viewBox = [-1600, -800, 3200, 1600];

const cursorPath = scalePath(
	resetPath('M7.5 271V16.5L197 181L84.5 183L7.5 271Z'),
	0.25,
	0.25
);

export const RenderButton: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const shape = makeRect({
		height: 60,
		width: 200,
		cornerRadius: 15,
	});

	const depth = 30;
	const cursorDepth = 10;

	const centeredButton = centerPath(shape.path);

	const text = useText('Render video');
	if (!text) {
		return null;
	}

	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));
	const parsedText = parsePath(textPath);

	const transformations = [
		rotateY(-Math.PI / 4 + frame / 100),
		rotateX(-Math.PI / 4 + frame / 300),
	];

	const push = spring({
		fps,
		frame,
		config: {},
		durationInFrames: 200,
	});

	const cursorDistance = interpolate(push, [0, 1], [100, 0], {});

	const pushIn = Math.min(0, cursorDistance);

	const _extrudedButton: FaceType[] = extrudeInstructions({
		points: parsePath(centeredButton),
		shouldDrawLine: true,
		depth: depth + pushIn,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: 'black',
		strokeWidth: 10,
	});

	const extrudedTo0 = projectFaces({
		faces: _extrudedButton,
		transformations: [translateZ(-(depth + pushIn) / 2), ...transformations],
	});

	const extrudedCursor: FaceType[] = extrudeInstructions({
		points: parsePath(cursorPath),
		shouldDrawLine: true,
		depth: cursorDepth,
		sideColor: 'black',
		frontFaceColor: 'white',
		backFaceColor: 'white',
		strokeWidth: 10,
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
			shouldDrawLine: false,
			strokeWidth: 10,
		},
		[translateZ(-depth - 0.001 - pushIn)]
	);

	const movedCursor = projectFaces({
		faces: extrudedCursor,
		transformations: [
			rotateY(Math.PI / 2),
			rotateX(-Math.PI / 4),
			rotateZ(-interpolate(push, [0, 1], [Math.PI * 2, 0])),
			translateZ(Number(-depth - 0.001) - cursorDistance),
			...transformations,
		],
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'white',
				}}
			>
				<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
					<Faces
						sort
						camera={getCamera(viewBox[2], viewBox[3])}
						elements={[
							extrudedTo0,
							movedCursor,
							projectFaces({
								transformations,
								faces: [textFace],
							}),
						]}
					/>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
