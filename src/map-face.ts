import {ThreeDReducedInstruction} from './3d-svg';
import {
	MatrixTransform4D,
	multiplyMatrix,
	multiplyMatrixAndSvgInstruction,
	Vector4D,
} from './matrix';

export type FaceType = {
	color: string;
	points: ThreeDReducedInstruction[];
	centerPoint: Vector4D;
	strokeWidth: number;
	strokeColor: string;
};

export const sortFacesZIndex = (face: FaceType[]): FaceType[] => {
	return face.slice().sort((a, b) => {
		return b.centerPoint[2] - a.centerPoint[2];
	});
};

export const translateSvgInstruction = (
	instruction: ThreeDReducedInstruction,
	x: number,
	y: number,
	z: number
): ThreeDReducedInstruction => {
	if (instruction.type === 'M') {
		return {
			type: 'M',
			point: [
				instruction.point[0] + x,
				instruction.point[1] + y,
				instruction.point[2] + z,
				instruction.point[3],
			],
		};
	}
	if (instruction.type === 'L') {
		return {
			type: 'L',
			point: [
				instruction.point[0] + x,
				instruction.point[1] + y,
				instruction.point[2] + z,
				instruction.point[3],
			],
		};
	}
	if (instruction.type === 'C') {
		return {
			type: 'C',
			point: [
				instruction.point[0] + x,
				instruction.point[1] + y,
				instruction.point[2] + z,
				instruction.point[3],
			],
			cp1: [
				instruction.cp1[0] + x,
				instruction.cp1[1] + y,
				instruction.cp1[2] + z,
				instruction.cp1[3],
			],
			cp2: [
				instruction.cp2[0] + x,
				instruction.cp2[1] + y,
				instruction.cp2[2] + z,
				instruction.cp2[3],
			],
		};
	}
	if (instruction.type === 'Q') {
		return {
			type: 'Q',
			point: [
				instruction.point[0] + x,
				instruction.point[1] + y,
				instruction.point[2] + z,
				instruction.point[3],
			],
			cp: [
				instruction.cp[0] + x,
				instruction.cp[1] + y,
				instruction.cp[2] + z,
				instruction.cp[3],
			],
		};
	}
	throw new Error('Unknown instruction type: ' + JSON.stringify(instruction));
};

export const transformFace = (
	face: FaceType,
	transformations: MatrixTransform4D[]
): FaceType => {
	return {
		...face,
		points: face.points.map((p) => {
			return transformations.reduce((acc, t) => {
				return multiplyMatrixAndSvgInstruction(t, acc);
			}, p);
		}),
		centerPoint: transformations.reduce((acc, t) => {
			const result = multiplyMatrix(t, acc);
			return result;
		}, face.centerPoint),
	};
};

export const transformFaces = ({
	faces,
	transformations,
}: {
	faces: FaceType[];
	transformations: MatrixTransform4D[];
}) => {
	return faces.map((face) => {
		return transformFace(face, transformations);
	});
};
