import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {EndCard} from './EndCard';
import './v4.css';
import {WrittenInReact} from './WrittenInReact';

export const DiscoverRemotion4: React.FC = () => {
	const {fps, height, width} = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = (delay: number) =>
		spring({
			fps,
			frame,
			delay: delay + 80,
			config: {
				damping: 200,
			},
			durationInFrames: 30,
		});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: 'GT Planar',
					fontSize: 50,
					translate: '0 ' + interpolate(spr(13), [0, 1], [0, -height]) + 'px',
				}}
			>
				<h1>
					Discover Remotion 4.0 <br />
					on remotion.dev
				</h1>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					translate: '0 ' + interpolate(spr(160), [0, 1], [0, -height]) + 'px',
				}}
			>
				<AbsoluteFill
					style={{
						padding: 40,
						width: '50%',
						height: '50%',
						translate: '0 ' + interpolate(spr(13), [0, 1], [height, 0]) + 'px',
					}}
				>
					<EventComp
						src={staticFile('day2.png')}
						date="July 4th"
						title="Visual editing"
					/>
				</AbsoluteFill>
				<AbsoluteFill
					style={{
						left: '50%',
						padding: 40,
						width: '50%',
						height: '50%',
						translate: '0 ' + interpolate(spr(16), [0, 1], [height, 0]) + 'px',
					}}
				>
					<EventComp
						src={staticFile('day3.png')}
						date="July 5th"
						title="Render Button"
					/>
				</AbsoluteFill>
				<AbsoluteFill
					style={{
						padding: 40,
						width: '50%',
						height: '50%',
						top: '50%',
						translate: '0 ' + interpolate(spr(19), [0, 1], [height, 0]) + 'px',
					}}
				>
					<EventComp
						src={staticFile('day4.png')}
						date="July 6th"
						title="Data-driven videos"
					/>
				</AbsoluteFill>
				<AbsoluteFill
					style={{
						top: '50%',
						left: '50%',
						width: '50%',
						height: '50%',
						padding: 40,
						marginTop: interpolate(spr(22), [0, 1], [height, 0]),
					}}
				>
					<EventComp
						src={staticFile('day5.png')}
						date="July 7th"
						title="Last but not least"
					/>
				</AbsoluteFill>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: 'GT Planar',
					fontSize: 50,
					translate:
						interpolate(spr(300), [0, 1], [0, -width]) +
						'px ' +
						interpolate(spr(160), [0, 1], [height, 0]) +
						'px',
				}}
			>
				<Sequence from={180}>
					<WrittenInReact />
				</Sequence>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: 'GT Planar',
					fontSize: 50,
					translate: interpolate(spr(300), [0, 1], [width, 0]) + 'px',
				}}
			>
				<Sequence from={300}>
					<EndCard />
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const EventComp: React.FC<{
	date: string;
	title: string;
	src: string;
}> = ({date, title, src}) => {
	return (
		<div
			style={{
				border: '8px solid black',
				borderRadius: 20,
				padding: 10,
				fontFamily: 'GT Planar',
				height: '100%',
				position: 'relative',
			}}
		>
			<AbsoluteFill
				style={{
					overflow: 'hidden',
					borderRadius: 20,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Img
					src={src}
					style={{
						height: '100%',
					}}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<p className="date">{date}</p>
				<>
					<p className="eventtitle">{title}</p>
				</>
			</AbsoluteFill>
		</div>
	);
};
