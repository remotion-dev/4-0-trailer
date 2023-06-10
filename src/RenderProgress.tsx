import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {useFont} from './get-char';
import {sortFacesZIndex} from './map-face';
import {rotateX, rotateY, rotateZ, translateY} from './matrix';
import {getButton} from './RenderProgress/make-button';

const viewBox = [-1600, -800, 3200, 1600];
const color = '#0b84f3';
const depth = 20;

export const RenderProgress: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const commonTransformations = [
		translateY(-frame * 1.5 + 50),
		rotateX(-Math.PI / 5),
		rotateZ(-Math.PI / 5),
		rotateZ(frame / 1400),
		rotateY(-frame / 600),
	];
	const font = useFont();
	if (!font) {
		return null;
	}

	const rendered = new Array(4).fill(true).map((_, i) => {
		return sortFacesZIndex(
			getButton({
				font,
				phrase: ['one.mp4', 'two.mp4', 'three.mp4', 'four.mp4'][i],
				depth,
				color,
				delay: i * 40,
				transformations: [translateY(i * 120), ...commonTransformations],
				frame,
				fps,
			})
		);
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
				<Faces
					sort
					camera={getCamera(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1])}
					elements={rendered}
				/>
			</svg>
		</AbsoluteFill>
	);
};
