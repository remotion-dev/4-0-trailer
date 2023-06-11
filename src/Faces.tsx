import React from 'react';
import {ThreeDElement} from './element';
import {ElementComp} from './ElementComp';
import {MatrixTransform4D} from './matrix';

export const Faces: React.FC<{
	elements: ThreeDElement[];
	camera: MatrixTransform4D;
}> = ({camera, elements}) => {
	return (
		<>
			{elements.map((element) => {
				return (
					<ElementComp key={element.id} camera={camera} element={element} />
				);
			})}
		</>
	);
};
