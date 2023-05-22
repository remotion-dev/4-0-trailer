import {
	getBoundingBox,
	parsePath,
	reduceInstructions,
	resetPath,
	scalePath,
} from '@remotion/paths';
import {getBoundingBoxFromInstructions} from '@remotion/paths/dist/get-bounding-box';
import {useCurrentFrame} from 'remotion';
import {
	Camera,
	multiplyMatrixAndPoint,
	rotated,
	setupCamera,
	Vector,
	Vector4D,
} from './multiply';

const w =
	'M18 48.5L1.5 0.5H15L24 27.5L33 0.5H48L62 27.5L67.5 0.5H84L71 48.5H56L42 24.5L33 48.5H18Z';

const scale = 0.02;

const parsed = reduceInstructions(
	parsePath(scalePath(resetPath(w), scale, scale))
);

const bBox = getBoundingBoxFromInstructions(parsed);
const width = bBox.y2 - bBox.y1;
const height = bBox.x2 - bBox.x1;

const removedZ = parsed.filter((p) => p.type !== 'Z');

const face = removedZ
	.map((p) => {
		if (p.type !== 'M' && p.type !== 'L') {
			throw new Error('unexpected');
		}

		return [p.x, p.y] as const;
	})
	.map(([x, y]) => {
		return [x, y, 0] as Vector;
	});

const depth = 0.2;

const faces = [
	face,
	face.map((p) => {
		return [p[0], p[1], p[2] - depth] as Vector;
	}),
	...removedZ.map((p, i) => {
		if (p.type !== 'M' && p.type !== 'L') {
			throw new Error('unexpected');
		}

		const joined = i === 0 ? removedZ.length - 1 : i - 1;
		const segmentToJoin = removedZ[joined];
		if (segmentToJoin.type !== 'M' && segmentToJoin.type !== 'L') {
			throw new Error('unexpected');
		}

		return [
			[p.x, p.y, 0],
			[p.x, p.y, -depth],
			[segmentToJoin.x, segmentToJoin.y, -depth],
			[segmentToJoin.x, segmentToJoin.y, 0],
			[p.x, p.y, 0],
		];
	}),
];

const camAngle = Math.PI / 12;

const cam: Camera = {
	eye: [0, 0, 1 / Math.tan(camAngle / 2) - 1] as Vector,
	coa: [0, 0, 0],
	up: [0, 1, 0],
	near: 3,
	far: 4,
	angle: camAngle,
};

const vSphereCenter = [width / 2, height / 2];
const vSphereRadius = Math.min(...vSphereCenter);

const area = [
	-vSphereRadius,
	-vSphereRadius,
	vSphereRadius,
	vSphereRadius,
] as const;

const camera = setupCamera(area, 100, cam);

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const rotatedFaces = faces.map((points) => {
		const projected = points
			.map((p) => {
				return [p[0] - width / 2, p[1] - height / 2, p[2], 1] as Vector4D;
			})
			.map((p) => {
				return [p[0], p[1], p[2], p[3]] as Vector4D;
			})
			.map((p) => {
				return multiplyMatrixAndPoint(rotated([0, 1, 0], frame / 20), p);
			});
		return projected;
	});

	const projectedFaces = rotatedFaces
		.slice()
		.map((points, j) => {
			const availableColors = [
				'red',
				'green',
				'blue',
				'yellow',
				'orange',
				'purple',
			];
			return {
				color: availableColors[j % availableColors.length],
				points,
			};
		})
		.sort((a, b) => {
			const aZ =
				a.points.reduce((acc, curr) => acc + curr[2], 0) / a.points.length;
			const bZ: number =
				b.points.reduce((acc, curr) => acc + curr[2], 0) / b.points.length;
			return bZ - aZ;
		})
		.map(({points, color}) => {
			return {
				points: points
					.map((p) => {
						return multiplyMatrixAndPoint(camera, p);
					})
					.map((p) => {
						return [p[0], p[1]] as const;
					}),
				color,
			};
		});

	return (
		<svg
			viewBox="-10 -10 20 20"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			{projectedFaces.map(({color, points}) => {
				return (
					<path
						d={points
							.map((p, i) => {
								if (i === 0) return `M ${p[0]} ${p[1]}`;
								return `L ${p[0]} ${p[1]}`;
							})
							.join(' ')}
						fill={color}
						stroke="black"
						strokeWidth={0.1}
					/>
				);
			})}
		</svg>
	);
};
