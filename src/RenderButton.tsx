import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {centerPath} from './center';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, transformFace, translateSvgInstruction} from './map-face';
import {rotated, translated} from './matrix';
import {projectPoints} from './project-points';
import {subdivideInstructions} from './subdivide-instruction';

const viewBox = [-1600, -800, 3200, 1600];

const buttonColor = '#0b84f3';
const cursorPath = scalePath(
	'M7.5 271V16.5L197 181L84.5 183L7.5 271Z',
	0.15,
	0.15
);

export const RenderButton: React.FC = () => {
	const frame = useCurrentFrame();
	const shape = makeRect({
		height: 60,
		width: 200,
		cornerRadius: 15,
	});

	const depth = 30;
	const cursorDepth = 5;

	const centeredButton = centerPath(shape.path);

	const cursor = subdivideInstructions(
		subdivideInstructions(turnInto3D(parsePath(cursorPath)))
	);

	const parsed = subdivideInstructions(
		subdivideInstructions(turnInto3D(parsePath(centeredButton)))
	);

	const text = useText('Render video');
	if (!text) {
		return null;
	}

	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));
	const parsedText = parsePath(textPath);

	const extrudedButton: FaceType[] = extrudeInstructions({
		instructions: {
			points: parsed,
			color: buttonColor,
			shouldDrawLine: true,
			isStroke: false,
			centerPoint: [0, 0, 0, 1],
		},
		depth,
		sideColor: 'black',
		frontFaceColor: '#0b84f3',
		backFaceColor: 'black',
		drawSegmentLines: false,
	});

	const extrudedCursor: FaceType[] = extrudeInstructions({
		instructions: {
			points: cursor,
			color: 'white',
			shouldDrawLine: true,
			isStroke: false,
			centerPoint: [0, 0, 0, 1],
		},
		depth: cursorDepth,
		sideColor: 'black',
		frontFaceColor: 'white',
		backFaceColor: 'white',
		drawSegmentLines: false,
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
			isStroke: false,
			points: centeredText,
			shouldDrawLine: false,
		},
		[translated([0, 0, -depth / 2 - 0.001])]
	);

	const movedCursor = extrudedCursor.map((cursor) => {
		return projectPoints({
			face: cursor,
			transformations: [
				rotated([0, 1, 0], Math.PI / 2),
				rotated([1, 0, 0], -Math.PI / 4),
				translated([0, 0, Number(-depth / 2 - 0.001)]),
			],
		});
	});

	const transformations = [rotated([0, 1, 0], -Math.PI / 4 + frame / 100)];

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
						camera={getCamera(viewBox[2], viewBox[3])}
						faces={[...extrudedButton, textFace, ...movedCursor].map((face) => {
							return projectPoints({
								transformations,
								face,
							});
						})}
					/>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
