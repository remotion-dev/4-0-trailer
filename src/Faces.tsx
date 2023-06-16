import React, {useMemo} from 'react';
import {ThreeDElement} from './element';
import {Face} from './FaceComp';

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
