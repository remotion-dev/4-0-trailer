import React from 'react';
import {ThreeDElement} from './element';
import {Face} from './FaceComp';
import {sortFacesZIndex} from './map-face';

export const ElementComp: React.FC<{
	element: ThreeDElement;
}> = ({element}) => {
	const sortedFaces = sortFacesZIndex(element.faces);

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
