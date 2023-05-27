import React from 'react';
import {Face} from './Face';
import {FaceType, sortFacesZIndex} from './map-face';

export const Faces: React.FC<{
	faces: FaceType[];
}> = ({faces}) => {
	const sorted = sortFacesZIndex(faces);

	return (
		<>
			{sorted.map(({points, color, shouldDrawLine}, i) => {
				return (
					<Face
						key={JSON.stringify(points) + i}
						strokeColor="black"
						color={color}
						points={points}
						shouldDrawLine={shouldDrawLine}
					/>
				);
			})}
		</>
	);
};
