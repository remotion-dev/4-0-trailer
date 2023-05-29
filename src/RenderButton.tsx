import {
	getBoundingBox,
	parsePath,
	resetPath,
	scalePath,
	translatePath,
} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
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

export const RenderButton: React.FC = () => {
	const frame = useCurrentFrame();
	const shape = makeRect({
		height: 60,
		width: 200,
		cornerRadius: 15,
	});

	const bBox = getBoundingBox(shape.path);
	const buttonWidth = bBox.x2 - bBox.x1;
	const buttonHeight = bBox.y2 - bBox.y1;

	const centeredButton = translatePath(
		shape.path,
		-buttonWidth / 2,
		-buttonHeight / 2
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
	const depth = 30;

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

	const transformations = [rotated([0, 1, 0], frame / 10)];

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
						camera={getCamera(buttonWidth, buttonHeight)}
						faces={[...extrudedButton, textFace].map((face) => {
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
