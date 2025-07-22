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

const rows = 1;
const columns = 1;
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
		<AbsoluteFill style={{scale: '8'}}>
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
						const key = `${i} `;
						const sizePerRow = (height - padding * 2) / rows;
						const sizePerColumn = (width - padding * 2) / columns;
						const top = sizePerRow * (0 + 0.5) + padding;
						const left = sizePerColumn * (0 + 0.5) + padding;

						return <Square key={key} left={left} top={top} />;
					})}
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
