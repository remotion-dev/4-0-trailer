import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {ThreeDElement} from './element';
import {ElementComp} from './ElementComp';
import {MatrixTransform4D} from './matrix';
import {rayTracing} from './ray-tracing';

export const Faces: React.FC<{
	elements: ThreeDElement[];
	camera: MatrixTransform4D;
}> = ({camera, elements}) => {
	const sortedElements = useMemo(() => {
		return elements.sort((a, b) => {
			const rayTraced = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: a.boundingBox.frontTopLeft,
				secondPlaneNormal: b.boundingBox.normal,
				secondPlanePoint: a.boundingBox.frontTopLeft,
			});
			console.log({rayTraced});

			return -1;
		});
	}, [elements]);

	return (
		<>
			{sortedElements.map((element) => {
				return (
					<ElementComp key={element.id} camera={camera} element={element} />
				);
			})}
		</>
	);
};
