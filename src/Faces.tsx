import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {BLUE} from './colors';
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
			const debug =
				a.color === '#222' ||
				b.color === '#222' ||
				a.color === BLUE ||
				b.color === BLUE;
			const ArayTracedFrontTopLeft = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: a.centerPoint,
				secondPlaneNormal: b.normal,
				secondPlanePoint: b.centerPoint,
				debug,
			});

			if (ArayTracedFrontTopLeft.type === 'parallel') {
				return b.centerPoint[2] > a.centerPoint[2] ? -1 : 1;
			}

			if (debug) {
				console.log({a, b, ArayTracedFrontTopLeft});
			}

			return a.centerPoint[2] < ArayTracedFrontTopLeft.point[2] ? 1 : -1;
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
