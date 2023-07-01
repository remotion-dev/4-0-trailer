import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const RightPaneLogo: React.FC = () => {
	const {fps} = useVideoConfig();

	const frame = useCurrentFrame();

	const progress = (delay: number) =>
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			delay,
			durationInFrames: 60,
		});

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					left: 'calc(50% - 10px)',
					width: '50%',
					borderLeft: '10px solid black',
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundColor: 'white',
					left: '50%',
					width: '50%',
				}}
			>
				<AbsoluteFill>
					<div
						style={{
							textAlign: 'center',
							fontFamily: 'Variable',
							fontSize: 80,
							marginTop: 140,
							fontVariationSettings: '"wght" 600',
							opacity: progress(0),
							translate:
								'0 ' + interpolate(progress(0), [0, 1], [100, 0]) + 'px',
						}}
					>
						Zod
					</div>
				</AbsoluteFill>
				<AbsoluteFill>
					<Img
						style={{
							height: 600,
							marginTop: 300,
							opacity: progress(30),

							translate:
								'0 ' + interpolate(progress(30), [0, 1], [100, 0]) + 'px',
						}}
						src={staticFile('zod.svg')}
					/>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
