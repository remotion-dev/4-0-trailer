import React, {useMemo} from 'react';
import {Face} from './Face';
import {FaceType, sortFacesZIndex} from './map-face';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const Faces: React.FC<{
	faces: FaceType[];
	camera: MatrixTransform4D;
}> = ({camera, faces}) => {
	const sorted = useMemo(() => sortFacesZIndex(faces), [faces]);

	return (
		<>
			{sorted.map(({points, color, shouldDrawLine, strokeWidth}, i) => {
				const multiplied = points.map((p) => {
					const result = multiplyMatrixAndSvgInstruction(camera, p);
					return result;
				});

				return (
					<Face
						key={JSON.stringify(points) + i}
						strokeColor="black"
						color={color}
						points={multiplied}
						shouldDrawLine={shouldDrawLine}
						strokeWidth={strokeWidth}
					/>
				);
			})}
		</>
	);
};
