import {noise2D} from '@remotion/noise';
import {interpolate, Sequence} from 'remotion';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Cursor} from './Cursor';

export const CursorWithButton: React.FC = () => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const push1 = spring({
		fps,
		frame: frame - 60,
		config: {
			damping: 200,
		},
		durationInFrames: 10,
	});

	const push2 = spring({
		fps,
		frame: frame - 70,
		config: {
			damping: 200,
		},
		durationInFrames: 10,
	});

	const scale = 1 - push1 * 0.3 + push2 * 0.3;

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 40,
	});

	const noiseBase = noise2D('frame', frame / 30, 0);
	const noise = interpolate(frame, [0, 70], [1, 0]) * noiseBase;

	const positionY =
		interpolate(spr, [0, 1], [1000, 0]) +
		3 +
		interpolate(push2, [0, 1], [0, -600]);
	const positionX = Math.sin(frame / 10) * 50 - 30;
	const rotation = noise * 40;

	return (
		<AbsoluteFill>
			<Cursor
				scale={scale}
				positionX={positionX}
				positionY={positionY}
				rotation={rotation}
			/>
		</AbsoluteFill>
	);
};
