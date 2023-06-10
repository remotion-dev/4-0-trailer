import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {rotateX, rotateY, rotateZ, translateY} from './matrix';
import {useButton} from './RenderProgress/make-button';
import {truthy} from './truthy';

const viewBox = [-1600, -800, 3200, 1600];
const color = '#0b84f3';
const depth = 20;

export const RenderProgress: React.FC = () => {
	const frame = useCurrentFrame();

	const commonTransformations = [
		translateY(-frame * 1.5 + 50),
		rotateX(-Math.PI / 5),
		rotateZ(-Math.PI / 5),
		rotateZ(frame / 1400),
		rotateY(-frame / 600),
	];

	const button = useButton('one.mp4', depth, color, 0, commonTransformations);
	const button2 = useButton('two.mp4', depth, color, 40, [
		translateY(120),
		...commonTransformations,
	]);
	const button3 = useButton('three.mp4', depth, color, 80, [
		translateY(240),
		...commonTransformations,
	]);
	const button4 = useButton('four.mp4', depth, color, 120, [
		translateY(360),
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
