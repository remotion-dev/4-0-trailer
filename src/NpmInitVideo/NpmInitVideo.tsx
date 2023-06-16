import {parsePath} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from '../center';
import {BLUE} from '../colors';
import {transformElement, transformElements} from '../element';
import {Faces} from '../Faces';
import {turnInto3D} from '../fix-z';
import {getText, useFont} from '../get-char';
import {extrudeElement} from '../join-inbetween-tiles';
import {
	MatrixTransform4D,
	rotateY,
	translateX,
	translateY,
	translateZ,
} from '../matrix';

const depth = 20 * 7.5;
const dotRadius = 3 * 7.5;

const rectWidth = 150 * 7.5;
const rectHeight = 120 * 7.5;

export const NpmInitVideo: React.FC = () => {
	const {width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();

	const font = useFont();

	if (!font) {
		return null;
	}

	const dollar = getText({
		font,
		text: '$',
		size: 75,
	});

	const npmInitVideo = getText({
		font,
		text: 'npm init video',
		size: 75,
	});

	const rect = makeRect({
		width: rectWidth,
		height: rectHeight,
	});

	const topLeftTransformation: MatrixTransform4D[] = [
		translateY(dotRadius / 2),
		translateX(-rectWidth / 2),
		translateY(-rectHeight / 2),
		translateY(-dotRadius / 2),
		translateX(7 * 7.5),
		translateY(7 * 7.5),
		translateZ(depth / 2 + 0.001),
	];

	const redFace = transformElement(
		turnInto3D({
			instructions: makeCircle({
				radius: dotRadius,
			}).instructions,
			description: 'red-dot',
			color: '#fe5f57',
			strokeColor: 'black',
			strokeWidth: 1,
		}),
		topLeftTransformation
	);

	const yellowFace = transformElement(
		turnInto3D({
			instructions: makeCircle({
				radius: dotRadius,
			}).instructions,
			description: 'yellow-dot',
			color: '#ffbc2e',
			strokeColor: 'black',
			strokeWidth: 1,
		}),
		[...topLeftTransformation, translateX(10 * 7.5)]
	);

	const greenFace = transformElement(
		turnInto3D({
			instructions: makeCircle({
				radius: dotRadius,
			}).instructions,
			description: 'green-dot',
			color: '#28c840',
			strokeColor: 'black',
			strokeWidth: 1,
		}),
		[...topLeftTransformation, translateX(20 * 7.5)]
	);

	const dollarFace = transformElement(
		turnInto3D({
			instructions: parsePath(dollar.path),
			color: BLUE,
			strokeWidth: 0,
			strokeColor: 'black',
			description: 'dollar',
		}),
		[...topLeftTransformation, translateY(25 * 7.5)]
	);

	const npmInitVideoFace = transformElement(
		turnInto3D({
			strokeWidth: 0,
			strokeColor: 'black',
			color: BLUE,
			description: 'npm-init-video',
			instructions: parsePath(npmInitVideo.path),
		}),
		[...topLeftTransformation, translateY(25 * 7.5), translateX(10 * 7.5)]
	);

	const transformed = transformElements([greenFace, yellowFace, redFace], []);

	const centered = centerPath(rect.path);
	const extrude = extrudeElement({
		backFaceColor: 'red',
		frontFaceColor: '#222',
		depth,
		sideColor: 'yellow',
		strokeWidth: 10,
		points: parsePath(centered),
		description: 'rect',
	});

	const allFaces = [extrude, npmInitVideoFace];

	const all = transformElements(allFaces, [rotateY(frame / 100)]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')}>
				<Faces elements={all} />
			</svg>
		</AbsoluteFill>
	);
};
