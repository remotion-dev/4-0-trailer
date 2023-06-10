import React, {useMemo} from 'react';
import {Face} from './Face';
import {sortElements, ThreeDelement} from './map-face';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const Faces: React.FC<{
	elements: ThreeDelement[];
	camera: MatrixTransform4D;
	sort: boolean;
}> = ({camera, elements, sort}) => {
	const sorted = useMemo(
		() => (sort ? sortElements(elements) : elements),
		[elements, sort]
	);

	return (
		<>
			{sorted.map((element) => {
				return (
					<>
						{element.faces.map(
							({points, color, shouldDrawLine, strokeWidth}, i) => {
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
							}
						)}
					</>
				);
			})}
		</>
	);
};
