import {interpolate, useVideoConfig} from 'remotion';
import {Star} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame} from 'remotion';

export const Sparks: React.FC = () => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const sparks1 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 40,
	});

	const sparks2 = spring({
		fps,
		frame: frame - 10,
		config: {
			damping: 200,
		},
		durationInFrames: 40,
	});

	const y1 = interpolate(sparks1, [0, 1], [1200, 0]);
	const scale = interpolate(sparks1, [0, 1], [0, 1]);
	const rotation1 = interpolate(sparks1, [0, 1], [0, Math.PI]) + frame / 1000;

	const y2 = interpolate(sparks2, [0, 1], [1200, 0]);
	const scale2 = interpolate(sparks2, [0, 1], [0, 1]);
	const rotation2 = interpolate(sparks2, [0, 1], [0, Math.PI]) - frame / 1000;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Star
				stroke="black"
				strokeWidth={10}
				edgeRoundness={1}
				innerRadius={40}
				outerRadius={120}
				points={4}
				style={{
					position: 'absolute',
					marginLeft: -250,
					marginTop: -100 + y1,
					transformBox: 'fill-box',
					transformOrigin: 'center center',
					transform: `scale(${scale})`,
					rotate: `${rotation1}rad`,
				}}
				fill="#0b84f3"
			/>
			<Star
				stroke="black"
				strokeWidth={10}
				edgeRoundness={1}
				innerRadius={30}
				outerRadius={100}
				points={4}
				style={{
					position: 'absolute',
					marginLeft: 100,
					marginTop: 100 + y2,
					transformBox: 'fill-box',
					transformOrigin: 'center center',
					transform: `scale(${scale2})`,
					rotate: `${rotation2}rad`,
				}}
				fill="#0b84f3"
			/>
		</AbsoluteFill>
	);
};
