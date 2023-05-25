import {
	getBoundingBox,
	parsePath,
	reduceInstructions,
	resetPath,
} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
import {spring} from 'remotion';
import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Face} from './Face';
import {turnInto3D} from './fix-z';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, sortFacesZIndex} from './map-face';
import {rotated, Vector4D} from './matrix';
import {projectPoints} from './RenderButton';
import {subdivideInstructions} from './subdivide-instruction';

const viewBox = [-1600, -800, 3200, 1600];
const depth = 20;

export const TriangleOut: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scale =
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			durationInFrames: 30,
			reverse: true,
		}) *
			18 +
		1;

	const paths = new Array(1).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 200 + i * 90,
			edgeRoundness: 0.71,
		});
		const path = resetPath(triangle.path);
		const reduced = reduceInstructions(parsePath(path));
		const threeD = subdivideInstructions(turnInto3D(reduced));
		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const face: FaceType = {
			centerPoint: [0, 0, 0, 1] as Vector4D,
			color: 'black',
			isStroke: false,
			points: threeD,
			shouldDrawLine: true,
		};

		const extruded = extrudeInstructions({
			backFaceColor: 'black',
			sideColor: 'black',
			frontFaceColor: i === 2 ? '#E9F3FD' : i === 1 ? '#C1DBF9' : 'var(--blue)',
			depth,
			instructions: face,
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
				transformations: [rotated([0, 1, 0], frame / 10)],
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
