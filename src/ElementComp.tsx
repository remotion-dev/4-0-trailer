import React from 'react';
import {ThreeDElement} from './element';
import {Face} from './FaceComp';
import {sortFacesZIndex} from './map-face';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const ElementComp: React.FC<{
	element: ThreeDElement;
	camera: MatrixTransform4D;
}> = ({element, camera}) => {
	const sortedFaces = sortFacesZIndex(element.faces);

	return (
		<>
			{sortedFaces.map(({points, color, strokeColor, strokeWidth}, i) => {
				const multiplied = points.map((p) => {
					const result = multiplyMatrixAndSvgInstruction(camera, p);
					return result;
				});

				return (
					<Face
						key={JSON.stringify(points) + i}
						strokeColor={strokeColor}
						color={color}
						points={multiplied}
						strokeWidth={strokeWidth}
					/>
				);
			})}
		</>
	);
};
