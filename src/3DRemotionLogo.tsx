import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {extrudeInstructions} from './join-inbetween-tiles';
import {projectFaces} from './map-face';
import {rotated, scaled, translated} from './matrix';

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
		const parsed = parsePath(path);

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
			points: parsed,
			shouldDrawLine: true,
			strokeWidth: 10,
		});
		const projected = projectFaces({
			transformations: [
				translated([0, 0, spread * i - spread]),
				translated([-width / 2, -height / 2 + 20, 0]),
				rotated([1, 0, 0], -(i * delayedFrame) / 300),
				rotated([0, 1, 0], delayedFrame / 100),
				rotated([0, 0, 1], delayedFrame / 100),
				scaled([0.6 + zoomIn, 0.6 + zoomIn, 0.6 + zoomIn]),
			],
			faces: extruded,
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
