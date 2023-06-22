import React from 'react';
import {Audio, interpolate, Series, staticFile} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {MyComposition} from './Composition';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {Timeline} from './Timeline';

export const Main: React.FC = () => {
	return (
		<>
			<Audio
				volume={(f) => interpolate(f, [1800, 1900], [1, 0])}
				src={staticFile('illstandmyground.mp3')}
			/>
			<Series>
				<Series.Sequence durationInFrames={9 * 30}>
					<TriangleOut />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<NpmIniVideo />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<Timeline />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<RenderButton />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<RenderProgress />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<MyComposition />
				</Series.Sequence>
			</Series>
		</>
	);
};
