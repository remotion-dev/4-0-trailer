import {getBoundingBox, parsePath, resetPath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
	translateZ,
} from './matrix';

const viewBox = [-1600, -800, 3200, 1600];

export const TriangleOut: React.FC = () => {
	const frame = useCurrentFrame();

	const zoomIn = frame * 0.001;

	const delayedFrame = Math.max(frame - 80, 0);

	const paths = new Array(3).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 1500 + i * 675,
			edgeRoundness: 0.71,
		});
		const path = resetPath(triangle.path);
		const parsed = parsePath(path);

		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const depth = (5 + delayedFrame / 20) * 7.5;
		const spread = depth + (delayedFrame / 1.2) * 7.5;

		const color = i === 2 ? '#E9F3FD' : i === 1 ? '#C1DBF9' : '#0b84f3';

		const extruded = extrudeElement({
			backFaceColor: color,
			sideColor: 'black',
			frontFaceColor: color,
			depth,
			points: parsed,
			strokeWidth: 20,
			description: `triangle-${i}`,
		});
		const projected = transformElement(extruded, [
			translateZ(spread * i - spread),
			translateX(-width / 2),
			translateY(-height / 2 + 20),
			rotateX(-(i * delayedFrame) / 300),
			rotateY(delayedFrame / 100),
			rotateZ(delayedFrame / 100),
			scaled(0.6 + zoomIn),
		]);

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
				<Faces elements={paths.reverse()} />
			</svg>
		</AbsoluteFill>
	);
};
