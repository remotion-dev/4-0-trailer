import React from 'react';
import {
	AbsoluteFill,
	Audio,
	interpolate,
	Series,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {Spiral} from './Spiral';
import {Studio} from './Studio';
import {TimelinePerspective1, TimelinePerspective2} from './Timeline';

export const Main: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<AbsoluteFill
				style={{
					opacity: interpolate(frame, [1800, 1900], [1, 0]),
				}}
			>
				<Audio
					volume={(f) => interpolate(f, [1800, 1900], [1, 0])}
					src={staticFile('illstandmyground.mp3')}
				/>
				<Series>
					<Series.Sequence durationInFrames={10 * 30}>
						<TriangleOut dark={false} background="white" />
					</Series.Sequence>
					<Series.Sequence durationInFrames={6 * 30}>
						<NpmIniVideo />
					</Series.Sequence>
					<Series.Sequence durationInFrames={7 * 30}>
						<TimelinePerspective1 />
					</Series.Sequence>
					<Series.Sequence durationInFrames={7 * 30}>
						<RenderButton />
					</Series.Sequence>
					<Series.Sequence durationInFrames={8 * 30}>
						<RenderProgress />
					</Series.Sequence>
					<Series.Sequence durationInFrames={6 * 30}>
						<Spiral />
					</Series.Sequence>
					<Series.Sequence durationInFrames={5 * 30}>
						<TimelinePerspective2 withAudio={false} />
					</Series.Sequence>
					<Series.Sequence durationInFrames={Infinity}>
						<Studio />
					</Series.Sequence>
				</Series>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
