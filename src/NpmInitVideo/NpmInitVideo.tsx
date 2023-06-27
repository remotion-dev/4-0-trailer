import {parsePath} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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
	rotateZ,
	scaled,
	translateX,
	translateY,
	translateZ,
} from '../matrix';

const depth = 20 * 7.5;
const dotRadius = 3 * 7.5;

const rectWidth = 150 * 7.5;
const rectHeight = 120 * 7.5;

export const NpmIniVideo: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = 150 - useCurrentFrame();

	const font = useFont();

	if (!font) {
		return null;
	}

	const textZDistance = (delay: number) =>
		900 -
		spring({
			frame: frame + 300,
			fps,
			delay,
			durationInFrames: 600,
			config: {damping: 200},
		}) *
			900;

	const dollar = getText({
		font,
		text: '$',
		size: 75,
	});

	const npm = getText({
		font,
		text: 'npm',
		size: 75,
	});

	const init = getText({
		font,
		text: 'init',
		size: 75,
	});
	const video = getText({
		font,
		text: 'video',
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

	const transformations = [
		rotateX(-0.5 - frame / 900),
		rotateY(-Math.PI / 3 + frame / 400),
		rotateZ(-0.2853981634),
		scaled(1.8 - frame / 300),
		translateX(600 - frame * 2),
		translateY(300 - frame),
	];

	const redFace = makeFace({
		fill: '#fe5f57',
		points: dot.path,
		strokeWidth: 10,
		strokeColor: 'black',
		description: 'redFace',
		crispEdges: false,
	});

	const redElement = transformElement(
		makeElement(redFace, redFace.centerPoint, 'redFace'),
		[
			...topLeftTransformation,
			translateZ(-textZDistance(0)),
			...transformations,
		]
	);

	const yellowFace = makeFace({
		fill: '#ffbc2e',
		points: dot.path,
		strokeWidth: 10,
		strokeColor: 'black',
		description: 'yellowFace',
		crispEdges: false,
	});

	const yellowElement = transformElement(
		makeElement(yellowFace, [0, 0, 0, 1], 'yellowFace'),
		[
			...topLeftTransformation,
			translateZ(-textZDistance(20)),
			translateX(10 * 7.5),
			...transformations,
		]
	);

	const greenFace = makeFace({
		fill: '#28c840',
		points: dot.path,
		strokeWidth: 10,
		strokeColor: 'black',
		description: 'greenFace',
		crispEdges: false,
	});

	const greenElement = transformElement(
		makeElement(greenFace, greenFace.centerPoint, 'greenFace'),
		[
			...topLeftTransformation,
			translateX(20 * 7.5),
			translateZ(-textZDistance(40)),
			...transformations,
		]
	);

	const dollarFace = makeFace({
		fill: BLUE,
		points: dollar.path,
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'dollarFace',
		crispEdges: false,
	});

	const dollarElement = transformElement(
		makeElement(dollarFace, dollarFace.centerPoint, 'dollarFace'),
		[
			...topLeftTransformation,
			translateY(25 * 7.5),
			translateZ(-textZDistance(0)),
			...transformations,
		]
	);

	const npmFace = makeFace({
		fill: 'white',
		points: npm.path,
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'npmInitVideoFace',
		crispEdges: false,
	});

	const npmElement = transformElement(
		makeElement(npmFace, npmFace.centerPoint, 'npmInitVideoFace'),
		[
			...topLeftTransformation,
			translateZ(-textZDistance(20)),
			translateY(25 * 7.5),
			translateX(10 * 7.5),
			...transformations,
		]
	);

	const initVideoFace = makeFace({
		fill: 'white',
		points: init.path,
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'npmInitVideoFace',
		crispEdges: false,
	});

	const initVideoElement = transformElement(
		makeElement(initVideoFace, initVideoFace.centerPoint, 'npmInitVideoFace'),
		[
			...topLeftTransformation,
			translateZ(-textZDistance(40)),
			translateY(25 * 7.5),
			translateX(10 * 7.5 + 20 * 8.6),
			...transformations,
		]
	);

	const videoFace = makeFace({
		fill: 'white',
		points: video.path,
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'npmInitVideoFace',
		crispEdges: false,
	});

	const videoElement = transformElement(
		makeElement(videoFace, videoFace.centerPoint, 'npmInitVideoFace'),
		[
			...topLeftTransformation,
			translateZ(-textZDistance(60)),
			translateY(25 * 7.5),
			translateX(10 * 7.5 + 20 * 15.7),
			...transformations,
		]
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
		strokeColor: 'black',
		crispEdges: false,
	});

	const allFaces = [
		transformElement(extrude, transformations),
		greenElement,
		yellowElement,
		redElement,
		dollarElement,
		npmElement,
		initVideoElement,
		videoElement,
	];

	const all = transformElements(allFaces, []);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')}>
				<Faces noSort elements={all} />
			</svg>
		</AbsoluteFill>
	);
};
