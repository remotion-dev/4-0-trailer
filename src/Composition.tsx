import {useCurrentFrame} from 'remotion';
import {
	Camera,
	multiplyMatrixAndPoint,
	rotated,
	setupCamera,
	Vector,
	Vector4D,
} from './multiply';

const faces = [
	[
		[0, 0, 0],
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0],
		[0, 0, 0],
	],
	[
		[0, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 1, 1],
		[0, 0, 1],
	],
	[
		[0, 0, 0],
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
	],
	[
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, 1],
		[1, 1, 0],
		[1, 0, 0],
	],
	[
		[0, 0, 0],
		[0, 0, 1],
		[1, 0, 1],
		[1, 0, 0],
		[0, 0, 0],
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[1, 1, 1],
		[1, 1, 0],
		[0, 1, 0],
	],
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

const width = 1;
const height = 1;
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
				return [...p, 1] as Vector4D;
			})
			.map((p) => {
				return [p[0] - 0.5, p[1] - 0.5, p[2] - 0.5, p[3]] as Vector4D;
			})
			.map((p) => {
				return multiplyMatrixAndPoint(rotated([0, 1, 0], frame / 20), p);
			})
			.map((p) => {
				return multiplyMatrixAndPoint(rotated([1, 0, 0], frame / 40), p);
			});
		return projected;
	});

	const projectedFaces = rotatedFaces
		.slice()
		.map((points, j) => {
			return {
				color: ['red', 'green', 'blue', 'yellow', 'orange', 'purple'][j],
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
			{projectedFaces.map(({color, points}, j) => {
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
