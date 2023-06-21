import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {BLUE} from './colors';
import {RenderButtonVariant} from './RenderButtonVariant';

const gap = 40;
const transitionStart = 140;
const outStart = 200;

export const WaysToRender: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, height, width} = useVideoConfig();

	const sweep = spring({
		frame,
		fps,
		config: {
			damping: 200,
		},
		delay: transitionStart,
		durationInFrames: 30,
	});

	const out = spring({
		frame,
		fps,
		config: {
			damping: 200,
		},
		delay: outStart,
		durationInFrames: 20,
	});

	const y = interpolate(sweep, [0, 1], [0, -height]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					backgroundColor: 'white',
					transform: `translateX(${interpolate(out, [0, 1], [0, width])}px)`,
				}}
			/>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',

					transform: `translateY(${y}px)`,
				}}
			>
				<div>
					<h1
						style={{
							fontFamily: 'GT Planar',
							fontSize: 80,
						}}
					>
						Ways to render
					</h1>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap,
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap,
							}}
						>
							<Box delay={0} text="Command line" alpha={false} />
							<Box delay={10} text="Node.JS" alpha={false} />
							<Box delay={20} text="Lambda" alpha={false} />
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap,
							}}
						>
							<Box delay={30} text="Docker" alpha={false} />
							<Box delay={40} text="GitHub Actions" alpha={false} />
							<Box alpha delay={50} text="Cloud Run" />
						</div>
					</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Sequence from={transitionStart}>
					<RenderButtonVariant out={out} progress={sweep} />
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Box: React.FC<{
	text: string;
	alpha: boolean;
	delay: number;
}> = ({text, alpha, delay}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const fade = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay,
		durationInFrames: 90,
	});

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',
				border: '10px solid black',
				height: 250,
				width: 500,
				padding: 30,
				borderRadius: 20,
				opacity: fade,
			}}
		>
			{alpha ? (
				<div
					style={{
						fontFamily: 'GT Planar',
						color: BLUE,
						fontWeight: 'bolder',
						fontSize: 32,
					}}
				>
					ALPHA
				</div>
			) : null}
			<div style={{fontFamily: 'GT Planar', fontSize: 50, fontWeight: 'bold'}}>
				{text}
			</div>
		</div>
	);
};
