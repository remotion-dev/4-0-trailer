import React from 'react';
import {ThreeDElement} from './element';
import {Face} from './Face';

export const Faces: React.FC<{
	elements: ThreeDElement[];
}> = ({elements}) => {
	const sortedElement = elements.sort((a, b) => {
		return b.centerPoint[2] - a.centerPoint[2];
	});

	return (
		<>
			{sortedElement.map((element, i) => {
				return (
					<React.Fragment key={i}>
						{element.faces.map(({points, color, strokeWidth}, i) => {
							return (
								<Face
									key={JSON.stringify(points) + i}
									strokeColor="black"
									color={color}
									points={points}
									strokeWidth={strokeWidth}
								/>
							);
						})}
					</React.Fragment>
				);
			})}
		</>
	);
};
