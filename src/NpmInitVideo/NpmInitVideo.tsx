import {parsePath} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {getCamera} from '../camera';
import {centerPath} from '../center';
import {BLUE} from '../colors';
import {ThreeDElement, transformElement, transformElements} from '../element';
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
		cornerRadius: 6 * 7.5,
	});

	const dot = turnInto3D({
		instructions: makeCircle({
			radius: dotRadius,
		}).instructions,
		color: '#fe5f57',
		strokeColor: 'black',
		strokeWidth: 1,
	});

	const topLeftTransformation: MatrixTransform4D[] = [
		translateY(dotRadius / 2),
		translateX(-rectWidth / 2),
		translateY(-rectHeight / 2),
		translateY(-dotRadius / 2),
		translateX(7 * 7.5),
		translateY(7 * 7.5),
		translateZ(-depth / 2),
	];

	const redFace = transformElement(dot, topLeftTransformation);

	const yellowFace = transformElement(dot, [
		...topLeftTransformation,
		translateX(10 * 7.5),
	]);

	const greenFace = transformElement(dot, [
		...topLeftTransformation,
		translateX(20 * 7.5),
	]);

	const dollarFace = transformElement(
		turnInto3D({
			instructions: parsePath(dollar.path),
			color: BLUE,
			strokeColor: 'black',
			strokeWidth: 0,
		}),
		[...topLeftTransformation, translateY(25 * 7.5)]
	);

	const npmInitVideoFace = transformElement(
		turnInto3D({
			instructions: parsePath(npmInitVideo.path),
			strokeWidth: 0,
			strokeColor: 'black',
			color: 'white',
		}),
		[...topLeftTransformation, translateY(25 * 7.5), translateX(10 * 7.5)]
	);

	const centered = centerPath(rect.path);
	const extrude = extrudeElement({
		backFaceColor: 'black',
		depth,
		frontFaceColor: '#222',
		points: parsePath(centered),
		sideColor: 'black',
		strokeWidth: 10,
	});

	const allElements: ThreeDElement[] = [
		extrude,
		greenFace,
		yellowFace,
		redFace,
		dollarFace,
		npmInitVideoFace,
	];

	const all = transformElements(allElements, [rotateY(frame / 100)]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')}>
				<Faces camera={getCamera(width, height)} elements={all} />
			</svg>
		</AbsoluteFill>
	);
};
