// De Casteljau algorithm

import {ReducedInstruction} from '@remotion/paths';

interface Point {
	x: number;
	y: number;
}

function lerp(t: number, a: Point, b: Point): Point {
	return {
		x: a.x + (b.x - a.x) * t,
		y: a.y + (b.y - a.y) * t,
	};
}

function splitBezier({
	t,
	startPoint,
	controlPoint1,
	controlPoint2,
	endPoint,
}: {
	t: number;
	startPoint: Point;
	controlPoint1: Point;
	controlPoint2: Point;
	endPoint: Point;
}): [Curve, Curve] {
	const ab = lerp(t, startPoint, controlPoint1);
	const bc = lerp(t, controlPoint1, controlPoint2);
	const cd = lerp(t, controlPoint2, endPoint);
	const abc = lerp(t, ab, bc);
	const bcd = lerp(t, bc, cd);
	const final = lerp(t, abc, bcd);

	return [
		{
			startPoint,
			endPoint: final,
			controlPoint1: ab,
			controlPoint2: abc,
		},
		{
			startPoint: final,
			endPoint,
			controlPoint1: bcd,
			controlPoint2: cd,
		},
	];
}

type Curve = {
	startPoint: Point;
	controlPoint1: Point;
	controlPoint2: Point;
	endPoint: Point;
};

const curveIntoLines = ({
	startPoint,
	instruction,
}: {
	startPoint: Point;
	instruction: ReducedInstruction;
}): ReducedInstruction[] => {
	if (instruction.type !== 'C') {
		throw new Error('Not a curve');
	}

	let curve: Curve = {
		startPoint,
		controlPoint1: {x: instruction.cp1x, y: instruction.cp1y},
		controlPoint2: {x: instruction.cp2x, y: instruction.cp2y},
		endPoint: {x: instruction.x, y: instruction.y},
	};

	const lines: ReducedInstruction[] = [];
	for (let i = 0; i < 10; i++) {
		const [left, right] = splitBezier({
			t: i / 10,
			startPoint: curve.startPoint,
			controlPoint1: curve.controlPoint1,
			controlPoint2: curve.controlPoint2,
			endPoint: curve.endPoint,
		});
		lines.push({type: 'L', x: left.endPoint.x, y: left.endPoint.y});
		curve = right;
	}
	lines.push({type: 'L', x: instruction.x, y: instruction.y});
	return lines;
};

export const replaceCurveByLines = (instructions: ReducedInstruction[]) => {
	let lastMove: Point = {x: 0, y: 0};
	return instructions
		.map((instruction) => {
			if (instruction.type !== 'Z') {
				lastMove = {x: instruction.x, y: instruction.y};
			}
			if (instruction.type === 'C') {
				return curveIntoLines({startPoint: lastMove, instruction});
			}
			return instruction;
		})
		.flat(1);
};
