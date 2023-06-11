import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {ThreeDElement} from './element';
import {ElementComp} from './ElementComp';
import {MatrixTransform4D, multiplyMatrix, Vector4D} from './matrix';

const distanceToCameraEye = (vector: Vector4D) => {
	const xDistance = cameraEye[0] - vector[0];
	const yDistance = cameraEye[1] - vector[1];
	const zDistance = cameraEye[2] - vector[2];

	return Math.sqrt(xDistance * xDistance + yDistance * yDistance + zDistance);
};

const isInFrontOrSame = (a: number, b: number) => {
	return a / b < 1.001;
};

export const Faces: React.FC<{
	elements: ThreeDElement[];
	camera: MatrixTransform4D;
}> = ({camera, elements}) => {
	const sortedElements = useMemo(() => {
		return elements.sort((a, b) => {
			const backBottomRightA = multiplyMatrix(
				camera,
				a.boundingBox.backBottomRight
			);
			const backBottomRightB = multiplyMatrix(
				camera,
				b.boundingBox.backBottomRight
			);

			const backTopLeftA = multiplyMatrix(camera, a.boundingBox.backTopLeft);
			const backTopLeftB = multiplyMatrix(camera, b.boundingBox.backTopLeft);

			const frontBottomRightA = multiplyMatrix(
				camera,
				a.boundingBox.frontBottomRight
			);
			const frontBottomRightB = multiplyMatrix(
				camera,
				b.boundingBox.frontBottomRight
			);

			const frontTopLeftA = multiplyMatrix(camera, a.boundingBox.backTopLeft);
			const frontTopLeftB = multiplyMatrix(camera, b.boundingBox.backTopLeft);

			const distanceBackBottomRightA = distanceToCameraEye(backBottomRightA);
			const distanceBackBottomRightB = distanceToCameraEye(backBottomRightB);

			const distanceBackTopLeftA = distanceToCameraEye(backTopLeftA);
			const distanceBackTopLeftB = distanceToCameraEye(backTopLeftB);

			const distanceFrontBottomRightA = distanceToCameraEye(frontBottomRightA);
			const distanceFrontBottomRightB = distanceToCameraEye(frontBottomRightB);

			const distanceFrontTopLeftA = distanceToCameraEye(frontTopLeftA);
			const distanceFrontTopLeftB = distanceToCameraEye(frontTopLeftB);

			const aInFrontTopLeft = isInFrontOrSame(
				distanceFrontTopLeftA,
				distanceFrontTopLeftB
			);
			const aInFrontBottomRight = isInFrontOrSame(
				distanceFrontBottomRightA,
				distanceFrontBottomRightB
			);
			const aInBackTopLeft = isInFrontOrSame(
				distanceBackTopLeftA,
				distanceBackTopLeftB
			);
			const aInBackBottomRight = isInFrontOrSame(
				distanceBackBottomRightA,
				distanceBackBottomRightB
			);

			if (
				aInBackTopLeft &&
				aInFrontBottomRight &&
				aInBackBottomRight &&
				aInFrontTopLeft
			) {
				return 1;
			}
			if (
				!aInBackTopLeft &&
				!aInFrontBottomRight &&
				!aInBackBottomRight &&
				!aInFrontTopLeft
			) {
				return -1;
			}

			throw new Error('overlapping');
		});
	}, [camera, elements]);

	return (
		<>
			{sortedElements.map((element) => {
				return (
					<ElementComp key={element.id} camera={camera} element={element} />
				);
			})}
		</>
	);
};
