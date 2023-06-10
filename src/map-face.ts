import {ThreeDReducedInstruction} from './3d-svg';
import {
	MatrixTransform4D,
	multiplyMatrix,
	multiplyMatrixAndSvgInstruction,
	Vector4D,
} from './matrix';
import {projectPoints} from './project-points';

export type FaceType = {
	color: string;
	points: ThreeDReducedInstruction[];
	shouldDrawLine: boolean;
	centerPoint: Vector4D;
	strokeWidth: number;
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
			_startPoint: [
				instruction._startPoint[0] + x,
				instruction._startPoint[1] + y,
				instruction._startPoint[2] + z,
				instruction._startPoint[3],
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
			_startPoint: [
				instruction._startPoint[0] + x,
				instruction._startPoint[1] + y,
				instruction._startPoint[2] + z,
				instruction._startPoint[3],
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
			_startPoint: [
				instruction._startPoint[0] + x,
				instruction._startPoint[1] + y,
				instruction._startPoint[2] + z,
				instruction._startPoint[3],
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
			_startPoint: [
				instruction._startPoint[0] + x,
				instruction._startPoint[1] + y,
				instruction._startPoint[2] + z,
				instruction._startPoint[3],
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

export const transformInstructions = (
	face: Omit<FaceType, 'color'>,
	transformations: MatrixTransform4D[]
): Omit<FaceType, 'color'> => {
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

export type ThreeDelement = {
	faces: FaceType[];
};

export const projectFaces = ({
	faces,
	transformations,
}: {
	faces: FaceType[];
	transformations: MatrixTransform4D[];
}): ThreeDelement => {
	return {
		faces: sortFacesZIndex(
			faces.map((face) => {
				return projectPoints({face, transformations});
			})
		),
	};
};

export const getBoundingBox = (
	element: ThreeDelement
): [Vector4D, Vector4D, Vector4D, Vector4D] => {
	const allX = element.faces.map((e) => {
		return e.points.map((p) => p.point[0]);
	});
	const allY = element.faces.map((e) => {
		return e.points.map((p) => p.point[1]);
	});
	const allZ = element.faces.map((e) => {
		return e.points.map((p) => p.point[2]);
	});

	const minX = Math.min(...allX.flat());
	const maxX = Math.max(...allX.flat());
	const minY = Math.min(...allY.flat());

	const maxY = Math.max(...allY.flat());
	const minZ = Math.min(...allZ.flat());
	const maxZ = Math.max(...allZ.flat());

	return [
		// TODO: Sketchy
		[minX, minY, minZ, 1],
		[minX, minY, maxZ, 1],
		[maxX, maxY, maxZ, 1],
		[maxX, maxY, minZ, 1],
	];
};

export const sortElements = (elements: ThreeDelement[]) => {
	return elements.slice().sort((a, b) => {
		// Const firstQuad = getBoundingBox(a);
		// const secondQuad = getBoundingBox(b);

		// Const overlap = quadrilateralsOverlap(
		// 	new Quad3D(firstQuad),
		// 	new Quad3D(secondQuad)
		// );

		const aZ =
			a.faces.reduce((acc, f) => {
				return acc + f.centerPoint[2];
			}, 0) / a.faces.length;
		const bZ =
			b.faces.reduce((acc, f) => {
				return acc + f.centerPoint[2];
			}, 0) / b.faces.length;

		return bZ - aZ;
	});
};

export const projectElements = ({
	threeDElements,
	transformations,
}: {
	threeDElements: ThreeDelement[];
	transformations: MatrixTransform4D[];
}) => {
	return threeDElements.map(({faces}) => {
		return projectFaces({faces, transformations});
	});
};
