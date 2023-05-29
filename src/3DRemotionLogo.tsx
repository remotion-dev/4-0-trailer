import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {extrudeInstructions} from './join-inbetween-tiles';
import {rotated, scaled, translated, Vector4D} from './matrix';
import {projectPoints} from './project-points';
import {subdivideInstructions} from './subdivide-instruction';

const viewBox = [-1600, -800, 3200, 1600];
const scale = 1;

export const TriangleOut: React.FC = () => {
	const frame = useCurrentFrame();

	const zoomIn = frame * 0.001;

	const delayedFrame = Math.max(frame - 80, 0);

	const paths = new Array(3).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 200 + i * 90,
			edgeRoundness: 0.71,
		});
		const path = resetPath(scalePath(triangle.path, scale, scale));
		const reduced = parsePath(path);
		const threeD = subdivideInstructions(turnInto3D(reduced));

		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const depth = 5 + delayedFrame / 20;
		const spread = depth + delayedFrame / 1.2;

		const color = i === 2 ? '#E9F3FD' : i === 1 ? '#C1DBF9' : '#0b84f3';

		const extruded = extrudeInstructions({
			backFaceColor: color,
			sideColor: 'black',
			frontFaceColor: color,
			depth,
			instructions: {
				centerPoint: [0, 0, 0, 1] as Vector4D,
				color: 'black',
				isStroke: false,
				points: threeD,
				shouldDrawLine: true,
			},
			drawSegmentLines: false,
		});
		const projected = extruded.map((e) => {
			return projectPoints({
				transformations: [
					translated([0, 0, spread * i - spread]),
					translated([-width / 2, -height / 2 + 20, 0]),
					rotated([1, 0, 0], -(i * delayedFrame) / 300),
					rotated([0, 1, 0], delayedFrame / 100),
					rotated([0, 0, 1], delayedFrame / 100),
					scaled([0.6 + zoomIn, 0.6 + zoomIn, 0.6 + zoomIn]),
				],
				face: e,
			});
		});

		return projected;
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg
				viewBox={viewBox.join(' ')}
				style={{
					overflow: 'visible',
					opacity: interpolate(frame, [0, 70], [0, 1]),
				}}
			>
				<Faces
					camera={getCamera(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1])}
					faces={paths.flat(1)}
				/>
			</svg>
		</AbsoluteFill>
	);
};
