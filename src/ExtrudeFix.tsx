import {parsePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {centerPath} from './center';
import {Faces} from './Faces';
import {extrudeInstructions} from './join-inbetween-tiles';
import {transformFaces} from './map-face';
import {rotateX, rotateY, rotateZ} from './matrix';

export const ExtrudeFix: React.FC = () => {
	const frame = useCurrentFrame();
	const rect = makeRect({
		height: 10,
		width: 10,
	});

	const centered = centerPath(rect.path);

	const extrude = extrudeInstructions({
		points: parsePath(centered),
		backFaceColor: 'green',
		depth: 10,
		frontFaceColor: 'blue',
		sideColor: 'yellow',
		strokeWidth: 10,
	});

	const final = transformFaces({
		faces: extrude,
		transformations: [
			rotateX(frame / 30),
			rotateY(frame / 60),
			rotateZ(frame / 90),
		],
	});

	return (
		<AbsoluteFill>
			<svg viewBox="-100 -100 200 200">
				<Faces sort camera={getCamera(10, 10)} elements={[final]} />
			</svg>
		</AbsoluteFill>
	);
};
