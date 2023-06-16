import {invert4d} from './camera';
import {FaceType} from './face-type';
import {makeId} from './make-id';
import {transformFace} from './map-face';
import {
	MatrixTransform4D,
	multiplyMatrix,
	transposeMatrix,
	Vector4D,
} from './matrix';
import {subdivideInstructions} from './subdivide-instruction';

export type ThreeDElement = {
	faces: FaceType[];
	id: string;
	description: string;
	boundingBox: ThreeDBoundingBox;
};

type ThreeDBoundingBox = {
	frontTopLeft: Vector4D;
	frontBottomRight: Vector4D;
	backTopLeft: Vector4D;
	backBottomRight: Vector4D;
	normal: Vector4D;
};

export const makeElement = (
	face: FaceType | FaceType[],
	boundingBox: ThreeDBoundingBox,
	description: string
): ThreeDElement => {
	return {
		faces: Array.isArray(face) ? face : [face],
		id: makeId(),
		boundingBox,
		description,
	};
};

export const transformElements = (
	elements: ThreeDElement[],
	transformations: MatrixTransform4D[]
) => {
	return elements.map((element) => {
		return transformElement(element, transformations);
	});
};

export const transformElement = (
	element: ThreeDElement,
	transformations: MatrixTransform4D[]
): ThreeDElement => {
	return {
		...element,
		faces: element.faces.map((face) => {
			return transformFace(face, transformations);
		}),
		id: makeId(),
		boundingBox: {
			normal: transformations.reduce((point, transformation) => {
				// Should not multiply normal the same way:
				// https://chat.openai.com/share/4850831c-804e-4abd-b65a-59b4df17f32d
				const inversed = invert4d(transformation);
				const transposed = transposeMatrix(inversed);
				return multiplyMatrix(transposed, point);
			}, element.boundingBox.normal),
			backBottomRight: transformations.reduce(
				(point, transformation) => multiplyMatrix(transformation, point),
				element.boundingBox.backBottomRight
			),
			backTopLeft: transformations.reduce(
				(point, transformation) => multiplyMatrix(transformation, point),
				element.boundingBox.backTopLeft
			),
			frontBottomRight: transformations.reduce(
				(point, transformation) => multiplyMatrix(transformation, point),
				element.boundingBox.frontBottomRight
			),
			frontTopLeft: transformations.reduce(
				(point, transformation) => multiplyMatrix(transformation, point),
				element.boundingBox.frontTopLeft
			),
		},
	};
};

export const subdivideElement = (
	element: ThreeDElement,
	iterations = 1
): ThreeDElement => {
	const subdivided = {
		...element,
		faces: element.faces.map((face): FaceType => {
			return {
				...face,
				points: subdivideInstructions(face.points),
			};
		}),
	};
	if (iterations === 1) {
		return subdivided;
	}
	return subdivideElement(subdivided, iterations - 1);
};
