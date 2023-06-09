import {ThreeDReducedInstruction} from './3d-svg';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';
import {projectPoints} from './project-points';

export type FaceType = {
	color: string;
	points: ThreeDReducedInstruction[];
	shouldDrawLine: boolean;
	strokeWidth: number;
};

export const sortFacesZIndex = (face: FaceType[]): FaceType[] => {
	return face.slice().sort((a, b) => {
		let lowestDistancePair: null | {
			distance: number;
			instructions: [ThreeDReducedInstruction, ThreeDReducedInstruction];
		} = null;

		for (const aInstruction of a.points) {
			for (const bInstruction of b.points) {
				const bCenterPointX =
					(bInstruction.point[0] + bInstruction._startPoint[0]) / 2;
				const bCenterPointY =
					(bInstruction.point[1] + bInstruction._startPoint[1]) / 2;
				const bCenterPointZ =
					(bInstruction.point[2] + bInstruction._startPoint[2]) / 2;
				const aCenterPointX =
					(aInstruction.point[0] + aInstruction._startPoint[0]) / 2;
				const aCenterPointY =
					(aInstruction.point[1] + aInstruction._startPoint[1]) / 2;
				const aCenterPointZ =
					(aInstruction.point[2] + aInstruction._startPoint[2]) / 2;

				const distanceX = bCenterPointX - aCenterPointX;
				const distanceY = bCenterPointY - aCenterPointY;
				const distanceZ = bCenterPointZ - aCenterPointZ;

				const distance = Math.sqrt(
					distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ
				);

				if (
					lowestDistancePair === null ||
					distance < lowestDistancePair.distance
				) {
					lowestDistancePair = {
						distance,
						instructions: [aInstruction, bInstruction],
					};
				}
			}
		}

		if (lowestDistancePair === null) {
			throw new Error('No distance pair found');
		}

		const firstCenterPointZ =
			(lowestDistancePair.instructions[0].point[2] +
				lowestDistancePair.instructions[0]._startPoint[2]) /
			2;
		const secondCenterPointZ =
			(lowestDistancePair.instructions[1].point[2] +
				lowestDistancePair.instructions[1]._startPoint[2]) /
			2;

		return secondCenterPointZ - firstCenterPointZ;
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
	};
};

export const projectFaces = ({
	faces,
	transformations,
}: {
	faces: FaceType[];
	transformations: MatrixTransform4D[];
}) => {
	return faces.map((face) => {
		return projectPoints({face, transformations});
	});
};
