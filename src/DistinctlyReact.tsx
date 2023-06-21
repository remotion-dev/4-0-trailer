import {
	AbsoluteFill,
	Img,
	interpolate,
	OffthreadVideo,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const DistinctlyReact: React.FC = () => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const shift = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 90,
		durationInFrames: 45,
	});

	const shiftOut = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 12 * 30,
		durationInFrames: 45,
	});

	const x = interpolate(shift + shiftOut, [0, 1, 2], [0, -1000, 0]);
	const xSlide = interpolate(shift + shiftOut, [0, 1, 2], [1945, 0, 1945]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					transform: `translateX(${x}px)`,
				}}
			>
				<OffthreadVideo src={staticFile('distinctly-react.mov')} />
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					transform: `translateX(${xSlide}px)`,
				}}
			>
				<Img src={staticFile('react first.png')} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
