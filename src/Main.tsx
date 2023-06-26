import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, staticFile} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {MyComposition} from './Composition';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {TimelinePerspective1, TimelinePerspective2} from './Timeline';

export const Main: React.FC = () => {
	return (
		<>
			<Audio
				volume={(f) => interpolate(f, [1800, 1900], [1, 0])}
				src={staticFile('illstandmyground.mp3')}
			/>
			<Series>
				<Series.Sequence durationInFrames={9 * 30}>
					<TriangleOut dark={false} background="white" />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<NpmIniVideo />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<TimelinePerspective1 />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<RenderButton />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<RenderProgress />
				</Series.Sequence>
				<Series.Sequence durationInFrames={11 * 30}>
					<TimelinePerspective2 withAudio={false} />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<AbsoluteFill />
				</Series.Sequence>
				<Series.Sequence durationInFrames={Infinity}>
					<MyComposition str="Welcome to Remotion 4.0" />
				</Series.Sequence>
			</Series>
		</>
	);
};
