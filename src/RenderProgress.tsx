import {AbsoluteFill, useCurrentFrame} from 'remotion';
import React from 'react';
import {Faces} from './Faces';
import {getCamera} from './camera';
import {useButton} from './RenderProgress/make-button';
import {transformFace} from './map-face';
import {rotated, translated} from './matrix';

const viewBox = [-1600, -800, 3200, 1600];
const color = '#0b84f3';
const depth = 20;

export const RenderProgress: React.FC = () => {
	const frame = useCurrentFrame();
	const button = useButton('one.mp4', depth, color, 0);
	const button2 = useButton('two.mp4', depth, color, 40);
	const button3 = useButton('three.mp4', depth, color, 80);
	const button4 = useButton('four.mp4', depth, color, 120);

	const rendered = [
		button,
		button2.map((b) => {
			return transformFace(b, [translated([0, 120, 0])]);
		}),
		button3.map((b) => {
			return transformFace(b, [translated([0, 240, 0])]);
		}),
		button4.map((b) => {
			return transformFace(b, [translated([0, 360, 0])]);
		}),
	]
		.flat(1)
		.map((b) => {
			return transformFace(b, [
				translated([0, -frame * 1.5 + 50, 0]),
				rotated([1, 0, 1], -Math.PI / 5),
				rotated([0, 0, 1], frame / 1400),
				rotated([0, 1, 0], -frame / 600),
			]);
		});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
				<Faces
					camera={getCamera(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1])}
					faces={rendered}
				/>
			</svg>
		</AbsoluteFill>
	);
};