import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const Introducing: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = interpolate(frame, [0, 200], [0.9, 1.1]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<AbsoluteFill
				style={{
					scale: String(scale),
				}}
			>
				<AbsoluteFill
					style={{
						backgroundColor: 'white',
						justifyContent: 'center',
						alignItems: 'center',
						fontWeight: 'bold',
						fontFamily: 'GT Planar',
						fontSize: 60,
					}}
				>
					<h1>
						Introducing Remotion <span style={{opacity: 0}}>4</span>.0
					</h1>
				</AbsoluteFill>
				<AbsoluteFill style={{marginLeft: 573}}>
					<NumberWheel digit={4} delay={10} />
				</AbsoluteFill>
				<AbsoluteFill
					style={{
						height: '50%',
						backgroundImage: `linear-gradient(to bottom, white 80%, rgba(255, 255, 255, 0) 88%)`,
					}}
				/>
				<AbsoluteFill
					style={{
						height: '50%',
						top: '50%',
						backgroundImage: `linear-gradient(to top, white 80%, rgba(255, 255, 255, 0) 88%)`,
					}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

import {interpolate, spring, useVideoConfig} from 'remotion';
import {loadFont} from './load-font';

loadFont();

const items = 10;

const NumberWheel: React.FC<{
	digit: number;
	delay: number;
}> = ({digit, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - delay,
		fps,
		config: {
			damping: 100,
		},
		durationInFrames: 30,
	});

	const rotation = progress;

	return (
		<AbsoluteFill
			style={{
				perspective: 5000,
			}}
		>
			{new Array(items).fill(true).map((f, i) => {
				const index =
					i / items + Number(digit + 1) / items + 0.9 + rotation * 0.1;

				const z = Math.cos(index * -Math.PI * 2) * 450;
				const y = Math.sin(index * Math.PI * 2) * 240;
				const r = interpolate(index, [0, 1], [0, Math.PI * 2]);

				const display = items - i - 1;

				return (
					<AbsoluteFill
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: 110,
							fontFamily: 'Variable',
							fontVariationSettings: '"wght" 700',
							transform: `translateZ(${z}px) translateY(${y}px) rotateX(${r}deg)`,
							backfaceVisibility: 'hidden',
							perspective: 1000,
							fontVariantNumeric: 'tabular-nums',
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
									color: display === digit ? 'black' : 'black',
								}}
							>
								{display}
							</div>
						</div>
					</AbsoluteFill>
				);
			})}
		</AbsoluteFill>
	);
};
