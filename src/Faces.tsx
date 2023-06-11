import React, {useMemo} from 'react';
import {Face} from './Face';
import {FaceType, sortElements} from './map-face';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const Faces: React.FC<{
	elements: FaceType[][];
	camera: MatrixTransform4D;
	sort: boolean;
}> = ({camera, elements, sort}) => {
	const sorted = useMemo(() => {
		return sort ? sortElements(elements) : elements;
	}, [elements, sort]);

	return (
		<>
			{sorted.map((element, i) => {
				return (
					<React.Fragment key={i}>
						{element.map(({points, color, strokeWidth}, i) => {
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
