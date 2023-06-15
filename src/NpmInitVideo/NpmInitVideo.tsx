import {parsePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {getCamera} from '../camera';
import {ThreeDElement, transformElement, transformElements} from '../element';
import {Faces} from '../Faces';
import {turnInto3D} from '../fix-z';
import {useFont} from '../get-char';
import {extrudeElement} from '../join-inbetween-tiles';
import {MatrixTransform4D, rotateY, translateZ} from '../matrix';

const depth = 10;

const rectWidth = 100;
const rectHeight = 100;

export const NpmInitVideo: React.FC = () => {
	const {width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();

	const font = useFont();

	if (!font) {
		return null;
	}

	const npmInitVideo = makeRect({
		width: rectWidth / 2,
		height: rectHeight / 2,
	});

	const rect = makeRect({
		width: rectWidth,
		height: rectHeight,
	});

	const topLeftTransformation: MatrixTransform4D[] = [];

	const npmInitVideoFace = transformElement(
		turnInto3D({
			instructions: parsePath(npmInitVideo.path),
			strokeWidth: 0,
			strokeColor: 'black',
			color: 'white',
			description: 'npm init video',
		}),
		[...topLeftTransformation, translateZ(6)]
	);

	const extrude = extrudeElement({
		backFaceColor: 'blue',
		depth,
		frontFaceColor: 'red',
		points: parsePath(rect.path),
		sideColor: 'yellow',
		strokeWidth: 10,
		description: 'test',
	});

	const allElements: ThreeDElement[] = [extrude, npmInitVideoFace];

	const all = transformElements(allElements, [rotateY(frame / 100)]);
	console.log(all);

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
