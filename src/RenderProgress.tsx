import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {rotated, translated} from './matrix';
import {useButton} from './RenderProgress/make-button';
import {truthy} from './truthy';

const viewBox = [-1600, -800, 3200, 1600];
const color = '#0b84f3';
const depth = 20;

export const RenderProgress: React.FC = () => {
	const frame = useCurrentFrame();

	const commonTransformations = [
		translated([0, -frame * 1.5 + 50, 0]),
		rotated([1, 0, 1], -Math.PI / 5),
		rotated([0, 0, 1], frame / 1400),
		rotated([0, 1, 0], -frame / 600),
	];

	const button = useButton('one.mp4', depth, color, 0, commonTransformations);
	const button2 = useButton('two.mp4', depth, color, 40, [
		translated([0, 120, 0]),
		...commonTransformations,
	]);
	const button3 = useButton('three.mp4', depth, color, 80, [
		translated([0, 240, 0]),
		...commonTransformations,
	]);
	const button4 = useButton('four.mp4', depth, color, 120, [
		translated([0, 360, 0]),
		...commonTransformations,
	]);

	const rendered = [button, button2, button3, button4].filter(truthy);

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
