import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {BLUE} from './colors';

export const NameTag: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const toRight = spring({
		fps,
		frame,
		config: {
			damping: 20,
		},
	});

	const toRight2 = spring({
		fps,
		frame,
		config: {
			damping: 20,
		},
		delay: 10,
	});

	const firstX = interpolate(toRight, [0, 1], [-1000, 0]);
	const secondX = interpolate(toRight2, [0, 1], [-1000, 0]);

	return (
		<AbsoluteFill>
			<AbsoluteFill>
				<div
					style={{
						position: 'absolute',
						bottom: 200,
						left: 120 + firstX,
						backgroundColor: BLUE,
						fontFamily: 'Variable',
						color: 'white',
						fontSize: 80,
						fontVariationSettings: '"wght" 700',
						padding: '18px 30px',
						paddingTop: 10,
						border: '8px solid black',
						borderRadius: 15,
					}}
				>
					Jonny Burger
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 100,
						padding: '18px 30px',
						backgroundColor: 'white',
						fontFamily: 'Variable',
						left: 200 + secondX,
						fontSize: 60,
						border: '8px solid black',
						borderRadius: 15,
						fontWeight: 'bolder',
					}}
				>
					Chief Hacker, Remotion
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
