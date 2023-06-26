import {getBoundingBox, parsePath, resetPath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
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

export const InFrameLogo: React.FC<{
	background: string;
}> = ({background}) => {
	const {width, height, fps} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height].join(' ');
	const frame = useCurrentFrame();

	const zoomIn = (Math.sin(frame / 100) + 1) * 0.2;

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

		const depth = 20 * 7.5;
		const spread =
			depth +
			(Math.sin(frame / 200) +
				(1 +
					spring({
						frame,
						fps,
						config: {
							damping: 200,
						},
						durationInFrames: 100,
						delay: 80,
					}))) *
				500;

		const color = i === 2 ? '#E9F3FD' : i === 1 ? '#C1DBF9' : '#0b84f3';

		const extruded = extrudeElement({
			backFaceColor: color,
			sideColor: 'black',
			frontFaceColor: color,
			depth,
			points: parsed,
			strokeWidth: 20,
			description: `triangle-${i}`,
			strokeColor: 'black',
		});
		const projected = transformElement(extruded, [
			translateZ(spread * i - spread),
			translateX(-width / 2),
			translateY(-height / 2 + 20),
			rotateX(-(i * delayedFrame) / 300),
			rotateY(delayedFrame / 100),
			rotateZ(delayedFrame / 100),
			scaled(0.3 + zoomIn),
		]);

		return projected;
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: background,
			}}
		>
			<svg
				viewBox={viewBox}
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
