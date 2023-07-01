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

const items = 10;

export const DigitWheel: React.FC<{
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
		durationInFrames: 60,
	});

	const rotation = progress;

	return (
		<AbsoluteFill
			style={{
				perspective: 5000,
			}}
		>
			{new Array(items).fill(true).map((f, i) => {
				const index = i / items + rotation + (digit + 1) / items;

				const z = Math.cos(index * -Math.PI * 2) * 450;
				const y = Math.sin(index * Math.PI * 2) * 240;
				const r = interpolate(index, [0, 1], [0, Math.PI * 2]);

				const display = items - i - 1;

				return (
					<AbsoluteFill
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: 160,
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
									color:
										display === digit && progress > 0.5
											? 'black'
											: 'rgba(0, 0, 0, 0.05)',
									fontWeight: 'bold',
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
