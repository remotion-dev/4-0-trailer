import React from 'react';
import {
	AbsoluteFill,
	Img,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Square} from './Square';

const rows = 9;
const columns = 9;
const size = 90;

const padding = 25;

export const Recorder: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const viewBox = [0, 0, width, height];

	const imgScale =
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			durationInFrames: 20,
			delay: 108,
		}) * 0.8;

	return (
		<AbsoluteFill style={{}}>
			<AbsoluteFill
				style={{
					scale: String(imgScale),
				}}
			>
				<Img src={staticFile('recorder-logo.png')} />
			</AbsoluteFill>
			<AbsoluteFill>
				<svg
					viewBox={viewBox.join(' ')}
					style={{
						overflow: 'visible',
					}}
				>
					{new Array(rows).fill(true).map((_, i) => {
						return new Array(columns).fill(true).map((_, j) => {
							const key = `${i}-${j}`;
							const sizePerRow = (height - padding * 2) / rows;
							const sizePerColumn = (width - padding * 2) / columns;
							const top = sizePerRow * (j + 0.5) + padding;
							const left = sizePerColumn * (i + 0.5) + padding;

							return <Square key={key} left={left} size={size} top={top} />;
						});
					})}
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
