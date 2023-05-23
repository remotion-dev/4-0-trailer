// De Casteljau algorithm

import {ReducedInstruction} from '@remotion/paths';

interface Point {
	x: number;
	y: number;
}

function linearInterpolation(t: number, a: Point, b: Point): Point {
	return {
		x: (1 - t) * a.x + b.x * t,
		y: (1 - t) * a.y + b.y * t,
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
}): Curve {
	const a = linearInterpolation(t, startPoint, controlPoint1);
	const b = linearInterpolation(t, controlPoint1, controlPoint2);
	const c = linearInterpolation(t, controlPoint2, endPoint);
	const d = linearInterpolation(t, a, b);
	const e = linearInterpolation(t, b, c);
	const final = linearInterpolation(t, d, e);

	return {
		startPoint,
		endPoint: final,
		controlPoint1: a,
		controlPoint2: d,
	};
}

type Curve = {
	startPoint: Point;
	controlPoint1: Point;
	controlPoint2: Point;
	endPoint: Point;
};

export type InstructionWithDrawInfo = ReducedInstruction & {
	shouldDrawLine: boolean;
};

const curveIntoLines = ({
	startPoint,
	instruction,
}: {
	startPoint: Point;
	instruction: ReducedInstruction;
}): InstructionWithDrawInfo[] => {
	if (instruction.type !== 'C') {
		throw new Error('Not a curve');
	}

	const curve: Curve = {
		startPoint,
		controlPoint1: {x: instruction.cp1x, y: instruction.cp1y},
		controlPoint2: {x: instruction.cp2x, y: instruction.cp2y},
		endPoint: {x: instruction.x, y: instruction.y},
	};

	const lines: InstructionWithDrawInfo[] = [];
	const steps = 10;
	for (let i = 0; i < steps; i++) {
		const segment = splitBezier({
			t: (i + 1) / (steps + 1),
			startPoint: curve.startPoint,
			controlPoint1: curve.controlPoint1,
			controlPoint2: curve.controlPoint2,
			endPoint: curve.endPoint,
		});
		lines.push({
			type: 'L',
			x: segment.endPoint.x,
			y: segment.endPoint.y,
			shouldDrawLine: false,
		});
	}
	lines.push({
		type: 'L',
		x: instruction.x,
		y: instruction.y,
		shouldDrawLine: true,
	});
	return lines;
};

export const replaceCurveByLines = (
	instructions: ReducedInstruction[]
): InstructionWithDrawInfo[] => {
	let lastMove: Point = {x: 0, y: 0};
	return instructions
		.map((instruction): InstructionWithDrawInfo[] => {
			if (instruction.type === 'C') {
				const newCurve = curveIntoLines({startPoint: lastMove, instruction});
				lastMove = {x: instruction.x, y: instruction.y};
				return newCurve;
			}
			if (instruction.type !== 'Z') {
				lastMove = {x: instruction.x, y: instruction.y};
			}
			return [{...instruction, shouldDrawLine: true}];
		})
		.flat(1);
};
