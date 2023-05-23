import {Vector4D} from './multiply';

export type ThreeDReducedInstruction =
	| {
			type: 'M';
			point: Vector4D;
	  }
	| {
			type: 'L';
			point: Vector4D;
	  }
	| {
			type: 'C';
			cp1: Vector4D;
			cp2: Vector4D;
			point: Vector4D;
	  }
	| {
			type: 'Q';
			cp: Vector4D;
			point: Vector4D;
	  };
