import React from 'react';
import {cameraEye} from './camera';
import {FaceType} from './face-type';
import {Face} from './FaceComp';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const Faces: React.FC<{
	elements: FaceType[][];
	camera: MatrixTransform4D;
}> = ({camera, elements}) => {
	const faces = elements.flat(1);

	const sorted = faces.slice().sort((a, b) => {
		const aDistanceX = a.centerPoint[0] - cameraEye[0];
		const aDistanceY = a.centerPoint[1] - cameraEye[1];
		const aDistanceZ = a.centerPoint[2] - cameraEye[2];

		const bDistanceX = b.centerPoint[0] - cameraEye[0];
		const bDistanceY = b.centerPoint[1] - cameraEye[1];
		const bDistanceZ = b.centerPoint[2] - cameraEye[2];

		const distanceA = Math.sqrt(
			aDistanceX ** 2 + aDistanceY ** 2 + aDistanceZ ** 2
		);

		const distanceB = Math.sqrt(
			bDistanceX ** 2 + bDistanceY ** 2 + bDistanceZ ** 2
		);

		return distanceA - distanceB;
	});

	return (
		<>
			{sorted.map(({points, color, strokeWidth}, i) => {
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
		</>
	);
};
