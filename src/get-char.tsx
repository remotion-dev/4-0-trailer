import {BoundingBox, Font, load} from 'opentype.js';
import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

const fontSize = 100;

export const useText = (text: string, size = fontSize) => {
	const [font, setFont] = useState<Font | null>(() => {
		return null;
	});

	const [handle] = useState(() => {
		return delayRender();
	});

	const [path, setPath] = useState<{
		path: string;
		boundingBox: BoundingBox;
	} | null>(null);

	useEffect(() => {
		load(staticFile('gt-planar.otf'))
			.then((hi) => {
				setFont(hi);
			})
			.catch((err) => {
				cancelRender(err);
			});
	}, []);

	useEffect(() => {
		if (!font) {
			return;
		}

		const path = font.getPath(text, 0, 0, size, {});

		setPath({
			boundingBox: path.getBoundingBox(),
			path: path.toPathData(1),
		});
		continueRender(handle);
	}, [font, handle, size, text]);

	return path;
};
