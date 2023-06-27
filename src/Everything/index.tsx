import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EverythingRenderButton} from './Button';
import {EverythingCursor} from './Cursor';
import {GreenTrack} from './GreenTrack';
import {Resize} from './Resize';
import {EverythingTriangle} from './Triangle';

export const Everything: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
				scale: String(interpolate(frame, [0, 100], [1, 1.1])),
			}}
		>
			<EverythingCursor />
			<EverythingTriangle />
			<EverythingRenderButton />
			<Resize />
			<GreenTrack />
		</AbsoluteFill>
	);
};
