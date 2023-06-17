import {makeId} from './make-id';
import {FaceType, transformFace} from './map-face';
import {MatrixTransform4D, multiplyMatrix, Vector4D} from './matrix';

export type ThreeDElement = {
	faces: FaceType[];
	id: string;
	description: string;
	centerPoint: Vector4D;
};

export const makeElement = (
	face: FaceType | FaceType[],
	centerPoint: Vector4D,
	description: string
): ThreeDElement => {
	return {
		faces: Array.isArray(face) ? face : [face],
		id: makeId(),
		centerPoint,
		description,
	};
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
		centerPoint: transformations.reduce(
			(point, transformation) => multiplyMatrix(transformation, point),
			element.centerPoint
		),
	};
};
