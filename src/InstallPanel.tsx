import {AbsoluteFill, useVideoConfig} from 'remotion';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';

export const InstallPanel: React.FC = () => {
	const {height, width} = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				width: '50%',
				left: '50%',
				overflow: 'hidden',
				borderLeft: '10px solid black',
			}}
		>
			<AbsoluteFill style={{height, width, marginLeft: -500}}>
				<NpmIniVideo />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
