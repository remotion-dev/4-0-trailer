import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, staticFile} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {MyComposition} from './Composition';
import {Everything} from './Everything';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {Spiral} from './Spiral';
import {TimelinePerspective1, TimelinePerspective2} from './Timeline';

export const Main: React.FC = () => {
	return (
		<>
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
				<Series.Sequence durationInFrames={7 * 30}>
					<Spiral />
				</Series.Sequence>
				<Series.Sequence durationInFrames={5 * 30}>
					<TimelinePerspective2 withAudio={false} />
				</Series.Sequence>
				<Series.Sequence durationInFrames={14 * 30}>
					<EndPush />
				</Series.Sequence>
			</Series>
		</>
	);
};

export const EndPush = () => {
	return (
		<AbsoluteFill>
			<AbsoluteFill>
				<Everything />
			</AbsoluteFill>
			<AbsoluteFill>
				<MyComposition delay={6 * 30} str="Welcome to Remotion 4.0" />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
