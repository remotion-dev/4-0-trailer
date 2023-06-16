import React, {useMemo} from 'react';
import {cameraEye} from './camera';
import {ThreeDElement} from './element';
import {ElementComp} from './ElementComp';
import {rayTracing} from './ray-tracing';

const biggerThanOrEqual = (a: number, b: number) => {
	const diff = a - b;
	return diff > 0.0000001;
};

export const Faces: React.FC<{
	elements: ThreeDElement[];
}> = ({elements}) => {
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
				const avgZA =
					a.faces.reduce((_a, _b) => _a + _b.centerPoint[2], 0) /
					a.faces.length;
				const avgZB =
					b.faces.reduce((_a, _b) => _a + _b.centerPoint[2], 0) /
					b.faces.length;

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

			console.log('a there', {
				aTopLeftIsCloserThanB,
				aBottomRightIsCloserThanB,
				bTopLeftIsCloserThanA,
				bIsCloserThanBottomRight,
				a,
				b,
			});

			if (aTopLeftIsCloserThanB && aBottomRightIsCloserThanB) {
				return 1;
			}
			if (bTopLeftIsCloserThanA && bIsCloserThanBottomRight) {
				return -1;
			}
			if (aTopLeftIsCloserThanB || aBottomRightIsCloserThanB) {
				return 1;
			}
			console.log({
				aTopLeftIsCloserThanB,
				aBottomRightIsCloserThanB,
				bTopLeftIsCloserThanA,
				bIsCloserThanBottomRight,
				hi: 'tie',
				a,
				b,
			});

			console.log({
				topLeftA: a.boundingBox.frontTopLeft[2],
				actual: ArayTracedFrontTopLeft.point[2],
			});

			// Ties can happen! Resort to Z difference
			console.log('tie');

			const smallestZA = Math.min(
				...a.faces.map((f) => f.points.map((p) => p.point[2])).flat(1)
			);
			const smallestZB = Math.min(
				...b.faces.map((f) => f.points.map((p) => p.point[2])).flat(1)
			);

			return smallestZB - smallestZA;
		});
	}, [elements]);

	return (
		<>
			{sortedElements.map((element) => {
				return <ElementComp key={element.id} element={element} />;
			})}
		</>
	);
};
