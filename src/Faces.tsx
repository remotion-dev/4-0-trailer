import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {ThreeDElement} from './element';
import {ElementComp} from './ElementComp';
import {MatrixTransform4D} from './matrix';
import {rayTracing} from './ray-tracing';

const tolerance = 0.0001;
const biggerThanOrEqual = (a: number, b: number) => {
	const diff = a - b;
	return diff > -0.0001;
};

export const Faces: React.FC<{
	elements: ThreeDElement[];
	camera: MatrixTransform4D;
}> = ({camera, elements}) => {
	const sortedElements = useMemo(() => {
		return elements.sort((a, b) => {
			const ArayTracedFrontTopLeft = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: a.boundingBox.frontTopLeft,
				secondPlaneNormal: b.boundingBox.normal,
				secondPlanePoint: b.boundingBox.frontTopLeft,
			});

			const ArayTracedFrontBottomRight = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: a.boundingBox.frontBottomRight,
				secondPlaneNormal: b.boundingBox.normal,
				secondPlanePoint: b.boundingBox.frontBottomRight,
			});

			const BrayTracedFrontTopLeft = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: b.boundingBox.frontTopLeft,
				secondPlaneNormal: a.boundingBox.normal,
				secondPlanePoint: a.boundingBox.frontTopLeft,
			});
			const BrayTracedFrontBottomRight = rayTracing({
				camera: cameraEye,
				firstPlaneCorner: b.boundingBox.frontBottomRight,
				secondPlaneNormal: a.boundingBox.normal,
				secondPlanePoint: a.boundingBox.frontBottomRight,
			});
			// TODO:
			if (
				ArayTracedFrontTopLeft.type === 'parallel' ||
				ArayTracedFrontBottomRight.type === 'parallel' ||
				BrayTracedFrontTopLeft.type === 'parallel' ||
				BrayTracedFrontBottomRight.type === 'parallel'
			) {
				console.log('parallel');
				const avgZA = a.faces.reduce((_a, _b) => _a + _b.centerPoint[2], 0);
				const avgZB = b.faces.reduce((_a, _b) => _a + _b.centerPoint[2], 0);

				return avgZB - avgZA;
			}
			const aTopLeftIsCloserThanB = biggerThanOrEqual(
				a.boundingBox.frontTopLeft[2],
				ArayTracedFrontTopLeft.point[2]
			);
			const aBottomRightIsCloserThanB = biggerThanOrEqual(
				a.boundingBox.frontBottomRight[2],
				ArayTracedFrontBottomRight.point[2]
			);
			const bTopLeftIsCloserThanA = biggerThanOrEqual(
				b.boundingBox.frontTopLeft[2],
				BrayTracedFrontTopLeft.point[2]
			);
			const bIsCloserThanBottomRight = biggerThanOrEqual(
				b.boundingBox.frontBottomRight[2],
				BrayTracedFrontBottomRight.point[2]
			);

			if (aTopLeftIsCloserThanB && aBottomRightIsCloserThanB) {
				return 1;
			}

			console.log('we dont know', {
				aBottomRightIsCloserThanB,
				aTopLeftIsCloserThanB,
				bIsCloserThanBottomRight,
				bTopLeftIsCloserThanA,
				a: a.description,
				b: b.description,
				ArayTracedFrontTopLeft,
				ArayTracedFrontBottomRight,
				BrayTracedFrontTopLeft,
				BrayTracedFrontBottomRight,
				aBackTopLeft: a.boundingBox.frontTopLeft,
			});

			return -1;
		});
	}, [elements]);

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
