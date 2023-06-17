import React from 'react';
import {Face} from './Face';
import {FaceType} from './map-face';

export const Faces: React.FC<{
	elements: FaceType[][];
}> = ({elements}) => {
	return (
		<>
			{elements.map((element, i) => {
				return (
					<React.Fragment key={i}>
						{element.map(({points, color, strokeWidth}, i) => {
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
