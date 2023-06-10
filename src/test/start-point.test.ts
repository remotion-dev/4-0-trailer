import {Instruction} from '@remotion/paths';
import {expect, test} from 'vitest';
import {turnInto3D} from '../fix-z';
import {extrudeInstructions} from '../join-inbetween-tiles';
import {subdivideInstructions} from '../subdivide-instruction';

test('start point should be right', () => {
	const instructions: Instruction[] = [
		{
			type: 'M',
			x: 0,
			y: 0,
		},
		{
			type: 'L',
			x: 10,
			y: 10,
		},
		{
			type: 'C',
			x: 20,
			y: 20,
			cp1x: 30,
			cp1y: 30,
			cp2x: 40,
			cp2y: 40,
		},
	];

	const threeD = turnInto3D(instructions);

	expect(threeD[0]._startPoint).toEqual([0, 0, 0, 1]);
	expect(threeD[1]._startPoint).toEqual([0, 0, 0, 1]);
	expect(threeD[2]._startPoint).toEqual([10, 10, 0, 1]);

	const subdivided = subdivideInstructions(threeD);
	expect(subdivided[2]._startPoint).toEqual([5, 5, 0, 1]);
});

test('Simple extrusion ', () => {
	const instructions: Instruction[] = [
		{
			type: 'M',
			x: 0,
			y: 0,
		},
		{
			type: 'L',
			x: 10,
			y: 10,
		},
		{
			type: 'L',
			x: 10,
			y: 0,
		},
		{
			type: 'Z',
		},
	];

	const extruded = extrudeInstructions({
		backFaceColor: 'red',
		depth: 10,
		frontFaceColor: 'blue',
		points: instructions,
		sideColor: 'black',
		strokeWidth: 0,
	});
	expect(extruded).toEqual([
		{
			points: [
				{
					type: 'M',
					point: [0, 0, 5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'L',
					point: [5, 5, 5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'L',
					point: [5, 5, -5, 1],
					_startPoint: [5, 5, 5, 1],
				},
				{
					type: 'L',
					point: [0, 0, -5, 1],
					_startPoint: [5, 5, -5, 1],
				},
				{
					type: 'L',
					point: [0, 0, 5, 1],
					_startPoint: [0, 0, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			points: [
				{
					type: 'M',
					point: [5, 5, 5, 1],
					_startPoint: [5, 5, 5, 1],
				},
				{
					type: 'L',
					point: [10, 10, 5, 1],
					_startPoint: [5, 5, 5, 1],
				},
				{
					type: 'L',
					point: [10, 10, -5, 1],
					_startPoint: [10, 10, 5, 1],
				},
				{
					type: 'L',
					point: [5, 5, -5, 1],
					_startPoint: [10, 10, -5, 1],
				},
				{
					type: 'L',
					point: [5, 5, 5, 1],
					_startPoint: [5, 5, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			points: [
				{
					type: 'M',
					point: [10, 10, 5, 1],
					_startPoint: [10, 10, 5, 1],
				},
				{
					type: 'L',
					point: [10, 5, 5, 1],
					_startPoint: [10, 10, 5, 1],
				},
				{
					type: 'L',
					point: [10, 5, -5, 1],
					_startPoint: [10, 5, 5, 1],
				},
				{
					type: 'L',
					point: [10, 10, -5, 1],
					_startPoint: [10, 5, -5, 1],
				},
				{
					type: 'L',
					point: [10, 10, 5, 1],
					_startPoint: [10, 10, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			points: [
				{
					type: 'M',
					point: [10, 5, 5, 1],
					_startPoint: [10, 5, 5, 1],
				},
				{
					type: 'L',
					point: [10, 0, 5, 1],
					_startPoint: [10, 5, 5, 1],
				},
				{
					type: 'L',
					point: [10, 0, -5, 1],
					_startPoint: [10, 0, 5, 1],
				},
				{
					type: 'L',
					point: [10, 5, -5, 1],
					_startPoint: [10, 0, -5, 1],
				},
				{
					type: 'L',
					point: [10, 5, 5, 1],
					_startPoint: [10, 5, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			points: [
				{
					type: 'M',
					point: [10, 0, 5, 1],
					_startPoint: [10, 0, 5, 1],
				},
				{
					type: 'L',
					point: [5, 0, 5, 1],
					_startPoint: [10, 0, 5, 1],
				},
				{
					type: 'L',
					point: [5, 0, -5, 1],
					_startPoint: [5, 0, 5, 1],
				},
				{
					type: 'L',
					point: [10, 0, -5, 1],
					_startPoint: [5, 0, -5, 1],
				},
				{
					type: 'L',
					point: [10, 0, 5, 1],
					_startPoint: [10, 0, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			points: [
				{
					type: 'M',
					point: [5, 0, 5, 1],
					_startPoint: [5, 0, 5, 1],
				},
				{
					type: 'L',
					point: [0, 0, 5, 1],
					_startPoint: [5, 0, 5, 1],
				},
				{
					type: 'L',
					point: [0, 0, -5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'L',
					point: [5, 0, -5, 1],
					_startPoint: [0, 0, -5, 1],
				},
				{
					type: 'L',
					point: [5, 0, 5, 1],
					_startPoint: [5, 0, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			points: [
				{
					type: 'M',
					point: [0, 0, 5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'M',
					point: [0, 0, 5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'L',
					point: [0, 0, -5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'M',
					point: [0, 0, -5, 1],
					_startPoint: [0, 0, -5, 1],
				},
				{
					type: 'L',
					point: [0, 0, 5, 1],
					_startPoint: [0, 0, -5, 1],
				},
			],
			color: 'black',
			centerPoint: [5, 5, 0, 1],
			strokeWidth: 0,
		},
		{
			centerPoint: [5, 5, -5, 1],
			points: [
				{
					type: 'M',
					point: [0, 0, -5, 1],
					_startPoint: [0, 0, -5, 1],
				},
				{
					type: 'L',
					point: [5, 5, -5, 1],
					_startPoint: [0, 0, -5, 1],
				},
				{
					type: 'L',
					point: [10, 10, -5, 1],
					_startPoint: [5, 5, -5, 1],
				},
				{
					type: 'L',
					point: [10, 5, -5, 1],
					_startPoint: [10, 10, -5, 1],
				},
				{
					type: 'L',
					point: [10, 0, -5, 1],
					_startPoint: [10, 5, -5, 1],
				},
				{
					type: 'L',
					point: [5, 0, -5, 1],
					_startPoint: [10, 0, -5, 1],
				},
				{
					type: 'L',
					point: [0, 0, -5, 1],
					_startPoint: [5, 0, -5, 1],
				},
			],
			strokeWidth: 0,
			color: 'blue',
		},
		{
			centerPoint: [5, 5, 5, 1],
			points: [
				{
					type: 'M',
					point: [0, 0, 5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'L',
					point: [5, 5, 5, 1],
					_startPoint: [0, 0, 5, 1],
				},
				{
					type: 'L',
					point: [10, 10, 5, 1],
					_startPoint: [5, 5, 5, 1],
				},
				{
					type: 'L',
					point: [10, 5, 5, 1],
					_startPoint: [10, 10, 5, 1],
				},
				{
					type: 'L',
					point: [10, 0, 5, 1],
					_startPoint: [10, 5, 5, 1],
				},
				{
					type: 'L',
					point: [5, 0, 5, 1],
					_startPoint: [10, 0, 5, 1],
				},
				{
					type: 'L',
					point: [0, 0, 5, 1],
					_startPoint: [5, 0, 5, 1],
				},
			],
			strokeWidth: 0,
			color: 'red',
		},
	]);
	console.log(JSON.stringify(extruded, null, 2));
});
