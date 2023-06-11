import {Font, load} from 'opentype.js';
import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

const fontSize = 750;

export const useFont = () => {
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		load(staticFile('gt-planar.otf'))
			.then((hi) => {
				setFont(hi);
				continueRender(handle);
			})
			.catch((err) => {
				cancelRender(err);
			});
	}, [handle]);

	const [font, setFont] = useState<Font | null>(() => {
		return null;
	});
	return font;
};

export const getText = ({
	font,
	text,
	size = fontSize,
}: {
	font: Font;
	text: string;
	size?: number;
}) => {
	const path = font.getPath(text, 0, 0, size, {});

	return {
		boundingBox: path.getBoundingBox(),
		path: path.toPathData(1),
	};
};
