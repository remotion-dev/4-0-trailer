import {getBoundingBox, parsePath, resetPath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {rotateY, scaled, translateX, translateY, translateZ} from './matrix';

export const LogoOnDark: React.FC<{
	background: string;
}> = ({background}) => {
	const {width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();

	const zoomIn = frame * 0.001;

	const delayedFrame = Math.max(frame - 80, 0);

	const paths = new Array(3).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 1500 + 1 * 675,
			edgeRoundness: 0.71,
		});
		const path = resetPath(triangle.path);
		const parsed = parsePath(path);

		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const depth = (5 + delayedFrame / 20) * 7.5;
		const spread = depth + (delayedFrame / 1.2) * 2;

		const darkColor = i === 2 ? '#fff' : i === 1 ? '#fff' : '#fff';

		const actualColor = darkColor;

		const extruded = extrudeElement({
			backFaceColor: actualColor,
			sideColor: 'black',
			frontFaceColor: actualColor,
			depth,
			points: parsed,
			strokeWidth: 2,
			description: `triangle-${i}`,
			strokeColor: 'black',
			crispEdges: false,
		});

		const projected = transformElement(extruded, [
			translateZ(spread * i - spread),
			translateX(-width / 2),
			translateY(-height / 2 + 20),
			scaled(0.25),
			rotateY(1),
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
				viewBox={viewBox.join(' ')}
				style={{
					backgroundColor: '#0b84f3',
					overflow: 'visible',
					opacity: interpolate(frame, [0, 70], [0, 1]),
				}}
			>
				<Faces elements={paths.reverse()} />
			</svg>
		</AbsoluteFill>
	);
};
