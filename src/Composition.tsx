import {
	getSubpaths,
	parsePath,
	reduceInstructions,
	resetPath,
	scalePath,
	translatePath,
} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {Camera, setupCamera, Vector} from './multiply';
import {Face} from './Face';
import {
	FaceType,
	projectPoints,
	sortFacesZIndex,
	translateSvgInstruction,
} from './map-face';
import {fixZ} from './fix-z';
import {useText} from './get-char';

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const scale = 0.02;

	const text = useText('g');
	if (!text) {
		return null;
	}

	const _scaled = scalePath(resetPath(text.path), scale, scale);
	const _bBox = getBoundingBox(_scaled);
	const scaled = translatePath(_scaled, -_bBox.x2 / 2, _bBox.y2 / 2);
	const bBox = getBoundingBox(scaled);
	const subpaths = getSubpaths(scaled);

	const parsed = subpaths.map((p) => {
		return fixZ(reduceInstructions(parsePath(p)));
	});

	const width = bBox.y2 - bBox.y1;
	const height = bBox.x2 - bBox.x1;

	const facePerSubpath = parsed.map((path): FaceType => {
		return {
			points: path,
			color: '#0b84f3',
			shouldDrawLine: true,
		};
	});
	const depth = 0.2;

	const mainFaces: FaceType[][] = facePerSubpath.map((face) => {
		return [
			face,
			{
				...face,
				points: face.points.map((p) => {
					return translateSvgInstruction(p, 0, 0, -depth);
				}),
			} as FaceType,
		];
	});
	/*
	Const inbetweenFaces = [
		...parsed
			.map((path) => {
				return path.map((p, i): FaceType[] => {
					if (p.type !== 'M' && p.type !== 'L') {
						throw new Error('unexpected');
					}

					const joined: number = i === 0 ? path.length - 1 : i - 1;
					const segmentToJoin: ThreeDReducedInstruction = path[joined];
					if (segmentToJoin.type !== 'M' && segmentToJoin.type !== 'L') {
						throw new Error('unexpected');
					}

					return [
						{
							shouldDrawLine: false,
							points: [
								[p.x, p.y, 0],
								[p.x, p.y, -depth],
								[segmentToJoin.x, segmentToJoin.y, -depth],
								[segmentToJoin.x, segmentToJoin.y, 0],
								[p.x, p.y, 0],
							],
						},
						{
							shouldDrawLine: false,
							points: [
								[p.x, p.y, 0],
								[p.x, p.y, -depth],
								[p.x, p.y, 0],
							],
						},
						{
							shouldDrawLine: true,
							points: [
								[p.x, p.y, -depth],
								[segmentToJoin.x, segmentToJoin.y, -depth],
								[p.x, p.y, -depth],
							],
						},
						{
							shouldDrawLine: true,
							points: [
								[p.x, p.y, 0],
								[segmentToJoin.x, segmentToJoin.y, 0],
								[p.x, p.y, 0],
							],
						},
					];
				});
			})
			.flat(2)
			.filter(truthy),
	];
	*/

	const camAngle = Math.PI / 12;

	const cam: Camera = {
		eye: [0, 0, 1 / Math.tan(camAngle / 2) - 1] as Vector,
		coa: [0, 0, 0],
		up: [0, 1, 0],
		near: 2,
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
	const camera = setupCamera(area, 1, cam);
	/*
	Const rotatedFaces = sortFacesZIndex(
		inbetweenFaces.map(({points, shouldDrawLine}) =>
			projectPoints({
				points,
				shouldDrawLine,
				width,
				height,
				frame,
				camera,
				color: '#000',
			})
		)
	); */
	const sorted = mainFaces.map((face) => {
		return sortFacesZIndex(
			face.map(({points, shouldDrawLine, color}) =>
				projectPoints({
					points,
					frame,
					camera,
					color,
					shouldDrawLine,
				})
			)
		);
	});
	const bottomFaces = sorted.map((face) => face[0]);
	const topFaces = sorted.map((face) => face[1]);

	return (
		<svg
			viewBox="-10 -10 20 20"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			{[...bottomFaces, ...topFaces].map(
				({color, points, shouldDrawLine}, i) => {
					return (
						<Face
							key={JSON.stringify(points) + i}
							color={color}
							points={points}
							shouldDrawLine={shouldDrawLine}
						/>
					);
				}
			)}
		</svg>
	);
};
