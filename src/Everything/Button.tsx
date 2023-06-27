import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from '../center';
import {BLUE} from '../colors';
import {makeElement, transformElement} from '../element';
import {Faces} from '../Faces';
import {getText, useFont} from '../get-char';
import {extrudeElement} from '../join-inbetween-tiles';
import {makeFace} from '../map-face';
import {
	MatrixTransform4D,
	rotateY,
	scaled,
	translateX,
	translateY,
	translateZ,
} from '../matrix';

export const EverythingRenderButton: React.FC = () => {
	const shape = makeRect({
		height: 300,
		width: 1000,
		cornerRadius: 60,
	});
	const {height, width} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];

	const depth = 100;

	const centeredButton = centerPath(shape.path);

	const extrudedButton = extrudeElement({
		points: parsePath(centeredButton),
		depth,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: 'black',
		strokeWidth: 20,
		description: 'Button',
		strokeColor: 'black',
		crispEdges: false,
	});
	const frame = useCurrentFrame();
	const font = useFont();
	if (!font) {
		return null;
	}

	const text = getText({font, text: 'Render'});

	const textPath = resetPath(scalePath(text.path, 0.17, 0.17));

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

	const faces = [extrudedButton, textElement];
	const transformations: MatrixTransform4D[] = [
		scaled(0.8),
		translateX(-400),
		rotateY(Math.PI / 4 - frame / 200),
		translateY(-150 - frame * 0.5),
	];

	return (
		<AbsoluteFill>
			<svg style={{}} viewBox={viewBox.join(' ')}>
				<Faces
					noSort
					elements={faces.flat(1).map((element) => {
						return transformElement(element, transformations);
					})}
				/>
			</svg>
		</AbsoluteFill>
	);
};
