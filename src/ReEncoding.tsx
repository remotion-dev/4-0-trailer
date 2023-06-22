import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Improvement} from './Improvement';

const delay = 120;

export const Reencoding: React.FC = () => {
	const {fps, height, width} = useVideoConfig();
	const frame = useCurrentFrame();

	const enter = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
	});

	const out = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
		delay: 10 * fps,
	});

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
		delay,
	});

	const firstSlide = interpolate(spr, [0, 1], [0, height]);
	const secondSlide = interpolate(spr, [0, 1], [-height, 0]);

	return (
		<AbsoluteFill
			style={{
				left:
					interpolate(enter, [0, 1], [width, 0]) +
					interpolate(out, [0, 1], [0, width]),
			}}
		>
			<AbsoluteFill
				style={{
					borderLeft: '15px solid black',
					marginLeft: -15,
				}}
			/>
			<AbsoluteFill
				style={{
					borderRight: '15px solid black',
					marginRight: -15,
				}}
			/>
			<AbsoluteFill
				style={{
					top: firstSlide,
				}}
			>
				<Img src={staticFile('re-encoding.png')} />
			</AbsoluteFill>
			<Sequence
				from={delay}
				style={{
					top: secondSlide,
				}}
			>
				<Improvement />
			</Sequence>
		</AbsoluteFill>
	);
};
