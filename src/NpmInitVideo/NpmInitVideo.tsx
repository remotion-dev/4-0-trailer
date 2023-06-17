import {parsePath} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from '../center';
import {BLUE} from '../colors';
import {makeElement, transformElement} from '../element';
import {Faces} from '../Faces';
import {getText, useFont} from '../get-char';
import {extrudeElement} from '../join-inbetween-tiles';
import {makeFace, transformElements} from '../map-face';
import {
	MatrixTransform4D,
	rotateX,
	rotateY,
	translateX,
	translateY,
	translateZ,
} from '../matrix';

const depth = 20 * 7.5;
const dotRadius = 3 * 7.5;

const rectWidth = 150 * 7.5;
const rectHeight = 120 * 7.5;

export const NpmIniVideo: React.FC = () => {
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

	const dot = makeCircle({
		radius: dotRadius,
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

	const redFace = makeFace({
		fill: '#fe5f57',
		points: dot.path,
		strokeWidth: 1,
		strokeColor: 'black',
	});

	const redElement = transformElement(
		makeElement(redFace, redFace.centerPoint, 'redFace'),
		topLeftTransformation
	);

	const yellowFace = makeFace({
		fill: '#ffbc2e',
		points: dot.path,
		strokeWidth: 1,
		strokeColor: 'black',
	});

	const yellowElement = transformElement(
		makeElement(yellowFace, [0, 0, 0, 1], 'yellowFace'),
		[...topLeftTransformation, translateX(10 * 7.5)]
	);

	const greenFace = makeFace({
		fill: '#28c840',
		points: dot.path,
		strokeWidth: 1,
		strokeColor: 'black',
	});

	const greenElement = transformElement(
		makeElement(greenFace, greenFace.centerPoint, 'greenFace'),
		[...topLeftTransformation, translateX(20 * 7.5)]
	);

	const dollarFace = makeFace({
		fill: BLUE,
		points: dollar.path,
		strokeWidth: 0,
		strokeColor: 'black',
	});

	const dollarElement = transformElement(
		makeElement(dollarFace, dollarFace.centerPoint, 'dollarFace'),
		[...topLeftTransformation, translateY(25 * 7.5)]
	);

	const npmInitVideoFace = makeFace({
		fill: 'white',
		points: npmInitVideo.path,
		strokeWidth: 0,
		strokeColor: 'black',
	});

	const npmInitVideoElement = transformElement(
		makeElement(
			npmInitVideoFace,
			npmInitVideoFace.centerPoint,
			'npmInitVideoFace'
		),
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
		description: 'npm init video',
	});

	const allFaces = [
		extrude,
		greenElement,
		yellowElement,
		redElement,
		dollarElement,
		npmInitVideoElement,
	];

	const all = transformElements(allFaces, [
		rotateY(frame / 100),
		rotateX(frame / 50),
	]);

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
