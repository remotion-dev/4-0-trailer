import {ThreeDReducedInstruction} from './3d-svg';
import {
	MatrixTransform4D,
	multiplyMatrixAndSvgInstruction,
	rotated,
} from './multiply';

export type FaceType = {
	color: string;
	points: ThreeDReducedInstruction[];
	shouldDrawLine: boolean;
};

export const projectPoints = ({
	points,
	frame,
	camera,
	color,
	shouldDrawLine,
	depth,
	height,
	width,
}: {
	points: ThreeDReducedInstruction[];
	frame: number;
	camera: MatrixTransform4D;
	color: string;
	shouldDrawLine: boolean;
	width: number;
	height: number;
	depth: number;
}): FaceType => {
	const projected = points
		.map((p) => {
			return translateSvgInstruction(p, -width, -height / 4, depth / 2);
		})
		.map((p) => {
			return multiplyMatrixAndSvgInstruction(rotated([0, 1, 0], frame / 20), p);
		})
		.map((p) => {
			return multiplyMatrixAndSvgInstruction(rotated([1, 0, 0], frame / 40), p);
		})
		.map((p) => {
			return multiplyMatrixAndSvgInstruction(camera, p);
		});
	return {
		color,
		points: projected,
		shouldDrawLine,
	};
};

export const sortFacesZIndex = (face: FaceType[]): FaceType[] => {
	return face.slice().sort((a, b) => {
		const maxA = Math.max(...a.points.map((p) => p.point[2]));
		const maxB = Math.max(...b.points.map((p) => p.point[2]));

		const avgA =
			a.points.reduce((acc, p) => acc + p.point[2], 0) / a.points.length;
		const avgB =
			b.points.reduce((acc, p) => acc + p.point[2], 0) / b.points.length;

		return avgA + maxA - (avgB + maxB);
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
