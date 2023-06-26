import {AbsoluteFill, Freeze} from 'remotion';
import {z} from 'zod';
import {TriangleOut} from './3DRemotionLogo';

export const ogImageSchema = z.object({
	dark: z.boolean(),
});

export const OgImage: React.FC<z.infer<typeof ogImageSchema>> = ({dark}) => {
	return (
		<AbsoluteFill style={{}}>
			<AbsoluteFill style={{}}>
				<Freeze frame={175}>
					<TriangleOut dark={dark} background="transparent" />
				</Freeze>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
