import {FaceType} from './face-type';
import {makeId} from './make-id';
import {transformFace} from './map-face';
import {MatrixTransform4D} from './matrix';
import {subdivideInstructions} from './subdivide-instruction';

export type ThreeDElement = {
	faces: FaceType[];
	id: string;
};

export const makeElement = (face: FaceType | FaceType[]): ThreeDElement => {
	return {
		faces: Array.isArray(face) ? face : [face],
		id: makeId(),
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
