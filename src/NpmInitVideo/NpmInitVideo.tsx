import {parsePath} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {getCamera} from '../camera';
import {centerPath} from '../center';
import {BLUE} from '../colors';
import {Faces} from '../Faces';
import {turnInto3D} from '../fix-z';
import {getText, useFont} from '../get-char';
import {extrudeInstructions} from '../join-inbetween-tiles';
import {FaceType, transformFace, transformFaces} from '../map-face';
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

	const redFace: FaceType = transformFace(
		{
			centerPoint: [0, 0, 0, 1],
			color: '#fe5f57',
			points: dot,
			strokeWidth: 1,
			strokeColor: 'black',
		},
		topLeftTransformation
	);

	const yellowFace: FaceType = transformFace(
		{
			centerPoint: [0, 0, 0, 1],
			color: '#ffbc2e',
			points: dot,
			strokeWidth: 1,
			strokeColor: 'black',
		},
		[...topLeftTransformation, translateX(10 * 7.5)]
	);

	const greenFace: FaceType = transformFace(
		{
			centerPoint: [0, 0, 0, 1],
			color: '#28c840',
			points: dot,
			strokeWidth: 1,
			strokeColor: 'black',
		},
		[...topLeftTransformation, translateX(20 * 7.5)]
	);

	const dollarFace: FaceType = transformFace(
		{
			centerPoint: [0, 0, 0, 1],
			color: BLUE,
			points: turnInto3D(parsePath(dollar.path)),
			strokeWidth: 0,
			strokeColor: 'black',
		},
		[...topLeftTransformation, translateY(25 * 7.5)]
	);

	const npmInitVideoFace: FaceType = transformFace(
		{
			centerPoint: [0, 0, 0, 1],
			color: 'white',
			points: turnInto3D(parsePath(npmInitVideo.path)),
			strokeWidth: 0,
			strokeColor: 'black',
		},
		[...topLeftTransformation, translateY(25 * 7.5), translateX(10 * 7.5)]
	);

	const transformed = transformFaces({
		faces: [greenFace, yellowFace, redFace],
		transformations: [],
	});

	const centered = centerPath(rect.path);
	const extrude = extrudeInstructions({
		backFaceColor: 'black',
		depth,
		frontFaceColor: '#222',
		points: parsePath(centered),
		sideColor: 'black',
		strokeWidth: 10,
	});

	const allFaces = [extrude, transformed, [dollarFace], [npmInitVideoFace]];

	const all = allFaces.map((a) => {
		return transformFaces({
			faces: a,
			transformations: [rotateY(frame / 100), rotateX(frame / 100)],
		});
	});

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
