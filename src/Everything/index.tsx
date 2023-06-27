import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EverythingRenderButton} from './Button';
import {EverythingCursor} from './Cursor';
import {GreenTrack} from './GreenTrack';
import {Resize} from './Resize';
import {Rust} from './Rust';

export const Everything: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<EverythingRenderButton />
			<EverythingCursor />
			<Resize />
			<Rust />
			<GreenTrack />
		</AbsoluteFill>
	);
};
