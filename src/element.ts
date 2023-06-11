import {FaceType} from './face-type';
import {makeId} from './make-id';
import {transformFace} from './map-face';
import {MatrixTransform4D} from './matrix';

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
	};
};
