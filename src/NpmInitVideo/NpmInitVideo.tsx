import {parsePath} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from '../center';
import {BLUE} from '../colors';
import {makeElement, transformElement} from '../element';
import {Faces} from '../Faces';
import {turnInto3D} from '../fix-z';
import {getText, useFont} from '../get-char';
import {extrudeElement} from '../join-inbetween-tiles';
import {transformElements} from '../map-face';
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

	const dot = turnInto3D(
		makeCircle({
			radius: dotRadius,
		}).instructions
	);

	const topLeftTransformation: MatrixTransform4D[] = [
		translateY(dotRadius / 2),
		translateX(-rectWidth / 2),
		translateY(-rectHeight / 2),
		translateY(-dotRadius / 2),
		translateX(7 * 7.5),
		translateY(7 * 7.5),
		translateZ(-depth / 2),
	];

	const redFace = transformElement(
		makeElement(
			{
				centerPoint: [0, 0, 0, 1],
				color: '#fe5f57',
				points: dot,
				strokeWidth: 1,
				strokeColor: 'black',
			},
			[0, 0, 0, 1],
			'redFace'
		),
		topLeftTransformation
	);

	const yellowFace = transformElement(
		makeElement(
			{
				centerPoint: [0, 0, 0, 1],
				color: '#ffbc2e',
				points: dot,
				strokeWidth: 1,
				strokeColor: 'black',
			},
			[0, 0, 0, 1],
			'yellowFace'
		),
		[...topLeftTransformation, translateX(10 * 7.5)]
	);

	const greenFace = transformElement(
		makeElement(
			{
				centerPoint: [0, 0, 0, 1],
				color: '#28c840',
				points: dot,
				strokeWidth: 1,
				strokeColor: 'black',
			},
			[0, 0, 0, 1],
			'greenFace'
		),
		[...topLeftTransformation, translateX(20 * 7.5)]
	);

	const dollarFace = transformElement(
		makeElement(
			{
				centerPoint: [0, 0, 0, 1],
				color: BLUE,
				points: turnInto3D(parsePath(dollar.path)),
				strokeWidth: 0,
				strokeColor: 'black',
			},
			[0, 0, 0, 1],
			'dollarFace'
		),
		[...topLeftTransformation, translateY(25 * 7.5)]
	);

	const npmInitVideoFace = transformElement(
		makeElement(
			{
				centerPoint: [0, 0, 0, 1],
				color: 'white',
				points: turnInto3D(parsePath(npmInitVideo.path)),
				strokeWidth: 0,
				strokeColor: 'black',
			},
			[0, 0, 0, 1],
			'npmInitVideoFace'
		),
		[...topLeftTransformation, translateY(25 * 7.5), translateX(10 * 7.5)]
	);

	const transformed = transformElements([greenFace, yellowFace, redFace], []);

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

	const allFaces = [extrude, ...transformed, dollarFace, npmInitVideoFace];

	const all = allFaces.map((a) => {
		return transformElement(a, [rotateY(frame / 100), rotateX(frame / 100)]);
	});

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
