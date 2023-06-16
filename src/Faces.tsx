import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {ThreeDElement} from './element';
import {Face} from './FaceComp';
import {rayTracing} from './ray-tracing';

export const Faces: React.FC<{
	elements: ThreeDElement[];
}> = ({elements}) => {
	const faces = useMemo(() => {
		return elements
			.map((e) => {
				return e.faces;
			})
			.flat(1);
	}, [elements]);

	const sortedFaces = useMemo(() => {
		return faces.slice().sort((a, b) => {
			const rayTracedPoint = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: a.points[0].point,
				secondPlaneNormal: b.normal,
				secondPlanePoint: b.points[0].point,
			});

			if (rayTracedPoint.type === 'parallel') {
				console.log('parallel');
				return a.centerPoint[2] - b.centerPoint[2];
			}

			for (const point of a.points) {
				const diff = point.point[2] - rayTracedPoint.point[2];

				if (diff === 0) {
					continue;
				}

				return diff;
			}

			console.log({a, b});
			return a.centerPoint[2] - b.centerPoint[2];
		});
	}, [faces]);

	return (
		<>
			{sortedFaces.map(({points, color, strokeColor, strokeWidth}, i) => {
				return (
					<Face
						key={JSON.stringify(points) + i}
						strokeColor={strokeColor}
						color={color}
						points={points}
						strokeWidth={strokeWidth}
					/>
				);
			})}
		</>
	);
};
