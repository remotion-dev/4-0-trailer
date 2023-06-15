import {Instruction, reduceInstructions} from '@remotion/paths';
import {getBoundingBoxFromInstructions} from '@remotion/paths/dist/get-bounding-box';
import {ThreeDReducedInstruction} from './3d-svg';
import {makeElement, ThreeDElement} from './element';
import {FaceType} from './face-type';
import {Vector4D} from './matrix';

export const turnInto3D = ({
	instructions,
	color,
	strokeWidth,
	strokeColor,
	description,
}: {
	instructions: Instruction[];
	color: string;
	strokeWidth: number;
	strokeColor: string;
	description: string;
}): ThreeDElement => {
	let lastMove: Vector4D = [0, 0, 0, 1];
	const newInstructions: ThreeDReducedInstruction[] = [];
	const reduced = reduceInstructions(instructions);
	// TODO: Not exposed by Remotion
	const boundingBox = getBoundingBoxFromInstructions(reduced);

	const centerX = (boundingBox.x2 - boundingBox.x1) / 2 + boundingBox.x1;
	const centerY = (boundingBox.y2 - boundingBox.y1) / 2 + boundingBox.y1;

	for (let i = 0; i < reduced.length; i++) {
		const instruction = reduced[i];

		if (instruction.type === 'Z') {
			newInstructions.push({
				type: 'L',
				point: lastMove,
			});
		} else if (instruction.type === 'M') {
			lastMove = [instruction.x, instruction.y, 0, 1];
			newInstructions.push({
				point: [instruction.x, instruction.y, 0, 1],
				type: 'M',
			});
		} else if (instruction.type === 'L') {
			newInstructions.push({
				type: 'L',
				point: [instruction.x, instruction.y, 0, 1],
			});
		} else if (instruction.type === 'C') {
			newInstructions.push({
				type: 'C',
				point: [instruction.x, instruction.y, 0, 1],
				cp1: [instruction.cp1x, instruction.cp1y, 0, 1],
				cp2: [instruction.cp2x, instruction.cp2y, 0, 1],
			});
		} else if (instruction.type === 'Q') {
			newInstructions.push({
				type: 'Q',
				cp: [instruction.cpx, instruction.cpy, 0, 1],
				point: [instruction.x, instruction.y, 0, 1],
			});
		} else {
			throw new Error('unknown');
		}
	}

	const face: FaceType = {
		centerPoint: [centerX, centerY, 0, 1],
		color,
		points: newInstructions,
		strokeColor,
		strokeWidth,
	};
	return makeElement(
		face,
		{
			backTopLeft: [boundingBox.x1, boundingBox.y1, 0, 1],
			frontBottomRight: [boundingBox.x2, boundingBox.y2, 0, 1],
			frontTopLeft: [boundingBox.x1, boundingBox.y1, 0, 1],
			backBottomRight: [boundingBox.x2, boundingBox.y2, 0, 1],
			normal: [0, 0, 1, 1],
		},
		description
	);
};
