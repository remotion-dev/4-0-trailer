import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {getCamera} from './camera';
import {CursorWithButton} from './CursorAnimation';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, translateSvgInstruction} from './map-face';
import {rotated, translated} from './matrix';
import {projectPoints} from './project-points';
import {Sparks} from './Sparks';
import {subdivideInstructions} from './subdivide-instruction';

const viewBox = [-1600, -800, 3000, 1600];

const maxDepth = 20;

const buttonColor = '#0b84f3';

export const RenderButton: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const shape = makeRect({
		height: 60,
		width: 200,
		cornerRadius: 15,
	});

	const bBox = getBoundingBox(shape.path);
	const parsed = subdivideInstructions(
		subdivideInstructions(turnInto3D(parsePath(shape.path)))
	);

	const press =
		spring({
			fps,
			frame: frame - 60,
			config: {
				damping: 200,
			},
			durationInFrames: 10,
		}) -
		spring({
			fps,
			frame: frame - 70,
			config: {
				damping: 200,
			},
			durationInFrames: 10,
		});

	const text = useText('Render video');
	if (!text) {
		return null;
	}
	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));
	const parsedText = parsePath(textPath);
	const depth = maxDepth - press * maxDepth;

	const threeD = turnInto3D(parsedText).map((p) => {
		return translateSvgInstruction(p, 0, 0, -depth / 2);
	});

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const inbetweenFaces: FaceType[] = extrudeInstructions({
		instructions: {
			points: parsed,
			color: buttonColor,
			shouldDrawLine: true,
			isStroke: false,
			centerPoint: [0, 0, 0, 1],
		},
		depth,
		sideColor: 'black',
		frontFaceColor: 'red',
		backFaceColor: 'green',
		drawSegmentLines: false,
	});

	const transformations = [rotated([0, 1, 0], frame / 10)];

	const rotatedFaces = inbetweenFaces.map((face) => {
		return projectPoints({
			transformations,
			face,
		});
	});

	const bBoxText = getBoundingBox(textPath);

	const textProjected = projectPoints({
		transformations: [
			translated([
				-(bBoxText.x2 - bBoxText.x1) / 2,
				-(bBoxText.y2 - bBoxText.y1) / 2,
				0,
			]),
			rotated([0, 1, 0], frame / 10),
		],
		face: {
			centerPoint: [0, 0, -depth / 2, 1],
			color: 'white',
			isStroke: false,
			points: threeD,
			shouldDrawLine: false,
		},
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
						camera={getCamera(width, height)}
						faces={[...rotatedFaces, textProjected]}
					/>
				</svg>
			</AbsoluteFill>
			<CursorWithButton />
			<Sequence from={80}>
				<Sparks />
			</Sequence>
		</AbsoluteFill>
	);
};
