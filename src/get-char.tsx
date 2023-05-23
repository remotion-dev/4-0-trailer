import {useState} from 'react';
import {cancelRender, continueRender, delayRender} from 'remotion';
import {staticFile} from 'remotion';
import {BoundingBox, Font, load} from 'opentype.js';
import {useEffect} from 'react';

const fontSize = 100;

export const useText = (text: string) => {
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

		const path = font.getPaths(text, 0, 0, fontSize, {});

		setPath({
			boundingBox: font.getPath(text, 0, 0, fontSize, {}).getBoundingBox(),
			path: path
				.map((p) => {
					return p.toPathData(1);
				})
				.join(' '),
		});
		continueRender(handle);
	}, [font, handle, text]);

	return path;
};
