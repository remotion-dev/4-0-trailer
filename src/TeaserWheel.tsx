import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {loadFont} from './load-font';

loadFont();

export const DURATION = 282;

const items = 9;

export const Wheel: React.FC<{
	topLayer: boolean;
}> = ({topLayer}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress =
		spring({
			fps,
			frame,
			config: {damping: 25},
			durationInFrames: 1,
		}) +
		spring({
			fps,
			frame: frame - 80,
			config: {damping: 25},
			durationInFrames: 30,
		}) +
		spring({
			fps,
			frame: frame - 160,
			config: {damping: 25},
			durationInFrames: 30,
		});

	const rotation = progress * (1 / items);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{}}>
				{new Array(items).fill(true).map((f, i) => {
					const index = i / items + rotation;

					const z = Math.cos(index * -Math.PI * 2) * 450;
					const y = Math.sin(index * Math.PI * 2) * 450;
					const r = interpolate(index, [0, 1], [0, Math.PI * 2]);

					return (
						<AbsoluteFill
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: 90,
								fontFamily: 'Variable',

								fontVariationSettings: '"wght" ' + 900,
								transform: `translateZ(${z}px) translateY(${y}px) rotateX(${r}deg)`,
								backfaceVisibility: 'hidden',
								color: topLayer ? 'black' : 'rgba(0, 0, 0, 0)',
							}}
						>
							<div
								style={{
									transform: `rotateX(-${r}rad)`,
									backfaceVisibility: 'hidden',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div
									style={{
										lineHeight: 1,
									}}
								>
									{i === 8 ? (
										'Remotion 4.0 Launch'
									) : i === 7 ? (
										'July 3rd, 18:30'
									) : i === 6 ? (
										<div
											style={{
												flexDirection: 'row',
												justifyContent: 'center',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											Hohlstrasse 188
										</div>
									) : (
										''
									)}
								</div>
							</div>
						</AbsoluteFill>
					);
				})}
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					height: '50%',
					backgroundImage: `linear-gradient(to bottom, white 60%, rgba(255, 255, 255, 0))`,
				}}
			/>
			<AbsoluteFill
				style={{
					height: '50%',
					top: '50%',
					backgroundImage: `linear-gradient(to top, white 60%, rgba(255, 255, 255, 0))`,
				}}
			/>
		</AbsoluteFill>
	);
};
