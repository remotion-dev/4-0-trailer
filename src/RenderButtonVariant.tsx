import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {centerPath} from './center';
import {BLUE} from './colors';
import {makeElement, transformElement} from './element';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {makeFace, transformElements} from './map-face';
import {rotateX, rotateY, translateY, translateZ} from './matrix';

const viewBox = [-1600, -800, 3200, 1600];

export const RenderButtonVariant: React.FC<{
	progress: number;
	out: number;
}> = ({progress, out}) => {
	const frame = useCurrentFrame();
	const {height} = useVideoConfig();
	const shape = makeRect({
		height: 450,
		width: 1500,
		cornerRadius: 112.5,
	});

	const depth = 225;

	const centeredButton = centerPath(shape.path);

	const font = useFont();
	if (!font) {
		return null;
	}
	const text = getText({font, text: 'Render video'});

	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));

	const transformations = [
		translateY(interpolate(progress, [0, 1], [height * 1.3, 0])),
		rotateX(-Math.PI / 8 + frame / 200),
		rotateY(-Math.PI / 4 + frame / 100),
	];

	const extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: 'black',
		strokeWidth: 30,
		description: 'Button',
		strokeColor: 'black',
		crispEdges: false,
	});

	const textFace = makeFace({
		fill: 'white',
		points: centerPath(textPath),
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'Text',
		crispEdges: false,
	});

	const textElement = transformElement(
		makeElement(textFace, textFace.centerPoint, 'Button text'),
		[translateZ(-depth / 2 - 0.001)]
	);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					scale: String(1 - out),
				}}
			>
				<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
					<Faces
						elements={transformElements(
							[extrudedButton, textElement],
							transformations
						)}
					/>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
