import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {ThreeDElement} from './element';
import {Face} from './FaceComp';
import {rayTracing} from './ray-tracing';

export const Faces: React.FC<{
	elements: ThreeDElement[];
}> = ({elements}) => {
	const faces = useMemo(() => {
		return elements.map((e) => e.faces).flat(1);
	}, [elements]);

	const sortedElements = useMemo(() => {
		return faces.sort((a, b) => {
			const ArayTracedFrontTopLeft = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: a.centerPoint,
				secondPlaneNormal: b.normal,
				secondPlanePoint: b.centerPoint,
			});

			if (ArayTracedFrontTopLeft.type === 'parallel') {
				console.log('parallel');
				return a.centerPoint[2] - b.centerPoint[2];
			}

			return a.centerPoint[2] - ArayTracedFrontTopLeft.point[2];
		});
	}, [faces]);

	return (
		<>
			{sortedElements.map((element) => {
				return (
					<Face
						points={element.points}
						color={element.color}
						strokeColor={element.strokeColor}
						strokeWidth={element.strokeWidth}
					/>
				);
			})}
		</>
	);
};
