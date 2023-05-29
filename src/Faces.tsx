import React from 'react';
import {Face} from './Face';
import {FaceType, sortFacesZIndex} from './map-face';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const Faces: React.FC<{
	faces: FaceType[];
	camera: MatrixTransform4D;
}> = ({camera, faces}) => {
	const sorted = sortFacesZIndex(faces);

	return (
		<>
			{sorted.map(({points, color, shouldDrawLine, strokeWidth}, i) => {
				return (
					<Face
						key={JSON.stringify(points) + i}
						strokeColor="black"
						color={color}
						points={points.map((p) => {
							return multiplyMatrixAndSvgInstruction(camera, p);
						})}
						shouldDrawLine={shouldDrawLine}
						strokeWidth={strokeWidth}
					/>
				);
			})}
		</>
	);
};
