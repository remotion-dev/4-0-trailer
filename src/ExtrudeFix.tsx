import {parsePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {centerPath} from './center';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {extrudeInstructions} from './join-inbetween-tiles';
import {rotated} from './matrix';
import {projectPoints} from './project-points';

export const ExtrudeFix: React.FC = () => {
	const frame = useCurrentFrame();
	const rect = makeRect({
		height: 1,
		width: 1,
	});

	const centered = centerPath(rect.path);

	const parsed = turnInto3D(parsePath(centered));
	const extrude = extrudeInstructions({
		instructions: {
			color: 'red',
			centerPoint: [0, 0, 0, 1],
			isStroke: false,
			points: parsed,
			shouldDrawLine: true,
		},
		backFaceColor: 'green',
		depth: 1,
		drawSegmentLines: false,
		frontFaceColor: 'blue',
		sideColor: 'yellow',
	});

	const final = extrude.map((face) => {
		return projectPoints({
			face,
			transformations: [
				rotated([1, 0, 0], frame / 30),
				rotated([0, 1, 0], frame / 60),
				rotated([0, 0, 1], frame / 90),
			],
		});
	});

	return (
		<AbsoluteFill>
			<svg viewBox="-10 -10 20 20">
				<Faces camera={getCamera(20, 20)} faces={final} />
			</svg>
		</AbsoluteFill>
	);
};
