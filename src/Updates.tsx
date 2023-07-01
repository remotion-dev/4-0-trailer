import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {DigitWheel} from './DigitWheel';

export const TenK: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				marginTop: interpolate(
					spring({
						fps,
						frame,
						config: {
							damping: 200,
						},
					}),
					[0, 1],
					[680, 320]
				),
			}}
		>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						height: 280,
						width: 1300,
						borderRadius: 60,
						border: '10px solid #000',
						backgroundColor: '#fff',
					}}
				/>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: 50,
					}}
				>
					<div
						style={{
							height: 280,
							width: 10,
							backgroundColor: '#000',
						}}
					/>
				</AbsoluteFill>
			</AbsoluteFill>
			<AbsoluteFill style={{}}>
				<AbsoluteFill
					style={{
						clipPath: `inset(410px 0px 410px 0px)`,
					}}
				>
					<AbsoluteFill
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginLeft: -510,
						}}
					>
						<svg
							style={{
								height: 128,
								width: 128,
							}}
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"
							/>
						</svg>
					</AbsoluteFill>
					{'100'.split('').map((digit, i) => (
						<AbsoluteFill
							style={{
								marginLeft: i * 120 - 30 - 300,
							}}
						>
							<DigitWheel delay={i * 5} digit={Number(digit)} />
						</AbsoluteFill>
					))}
				</AbsoluteFill>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						marginLeft: 800,
						lineHeight: 1.2,
					}}
				>
					<div
						style={{
							fontFamily: 'Variable',
							fontSize: 80,
							fontVariationSettings: '"wght" 700',
							marginLeft: 320,
						}}
					>
						Updates
					</div>
					<div
						style={{
							fontFamily: 'Variable',
							fontSize: 80,
							fontVariationSettings: '"wght" 700',
							marginLeft: 320,
						}}
					>
						since v3.0
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
