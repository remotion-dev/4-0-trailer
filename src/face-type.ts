import {ThreeDReducedInstruction} from './3d-svg';
import {Vector4D} from './matrix';

export type FaceType = {
	color: string;
	points: ThreeDReducedInstruction[];
	centerPoint: Vector4D;
	normal: Vector4D;
	strokeWidth: number;
	strokeColor: string;
};
