import {parsePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {centerPath} from './center';
import {Faces} from './Faces';
import {extrudeInstructions} from './join-inbetween-tiles';
import {projectFaces} from './map-face';
import {rotated} from './matrix';

export const ExtrudeFix: React.FC = () => {
	const frame = useCurrentFrame();
	const rect = makeRect({
		height: 10,
		width: 10,
	});

	const centered = centerPath(rect.path);

	const extrude = extrudeInstructions({
		points: parsePath(centered),
		shouldDrawLine: true,
		backFaceColor: 'green',
		depth: 10,
		frontFaceColor: 'blue',
		sideColor: 'yellow',
		strokeWidth: 10,
	});

	const final = projectFaces({
		faces: extrude,
		transformations: [
			rotated([1, 0, 0], frame / 30),
			rotated([0, 1, 0], frame / 60),
			rotated([0, 0, 1], frame / 90),
		],
	});

	return (
		<AbsoluteFill>
			<svg viewBox="-100 -100 200 200">
				<Faces camera={getCamera(10, 10)} faces={final} />
			</svg>
		</AbsoluteFill>
	);
};
