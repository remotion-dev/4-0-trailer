import {
	getBoundingBox,
	parsePath,
	reduceInstructions,
	resetPath,
	scalePath,
} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Face} from './Face';
import {turnInto3D} from './fix-z';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, sortFacesZIndex, transformFace} from './map-face';
import {rotated, translated, Vector4D} from './matrix';
import {projectPoints} from './RenderButton';
import {subdivideInstructions} from './subdivide-instruction';

const viewBox = [-1600, -800, 3200, 1600];
const scale = 1.5;

export const TriangleOut: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const paths = new Array(3).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 200 + i * 90,
			edgeRoundness: 0.71,
		});
		const path = resetPath(scalePath(triangle.path, scale, scale));
		const reduced = reduceInstructions(parsePath(path));
		const threeD = subdivideInstructions(turnInto3D(reduced));

		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const depth = 5 + frame / 20;
		const spread = depth + frame / 2;

		const face: FaceType = transformFace(
			{
				centerPoint: [0, 0, 0, 1] as Vector4D,
				color: 'black',
				isStroke: false,
				points: threeD,
				shouldDrawLine: true,
			},
			[translated([0, 0, spread * i - spread])]
		);

		const color = i === 2 ? '#E9F3FD' : i === 1 ? '#C1DBF9' : '#0b84f3';

		const extruded = extrudeInstructions({
			backFaceColor: color,
			sideColor: 'black',
			frontFaceColor: color,
			depth,
			instructions: face,
			drawSegmentLines: false,
		});
		const projected = extruded.map((e) => {
			return projectPoints({
				camera: getCamera(width, height),
				height,
				width,
				centerPoint: e.centerPoint,
				color: e.color,
				depth,
				fps,
				frame,
				isStroke: e.isStroke,
				points: e.points,
				shouldDrawLine: e.shouldDrawLine,
				transformations: [
					rotated([1, 0, 0], (i * frame) / 300),
					rotated([0, 1, 0], frame / 100),
				],
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
			<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
				{sortFacesZIndex(paths.flat(1)).map((p, i) => {
					return (
						<Face
							key={JSON.stringify(p.points) + i}
							points={p.points}
							color={p.color}
							shouldDrawLine={p.shouldDrawLine}
							strokeColor="black"
						/>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
