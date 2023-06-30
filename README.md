# Remotion 4.0 Trailer

See the result at https://remotion.dev/4!

```
npm i
npm start
```

## License disclaimer

This repository is unlicensed - you may not use the assets in it, it is solely for reference and exploration. This in particular affects the music, the font and our brand assets.

The 3D engine will be extracted and made available for use at a later stage.

Remotion itself is released under the [Remotion license](https://remotion.dev/license).

## How does the 3D engine work?

The 3D animations that you find in this example are based on SVG manipulation and [`@remotion/paths`](https://remotion.dev/paths).

The idea behind the engine is to take what SVG has to offer and enhance it with another dimension.

**Guiding pricinciples:**

- SVG Paths in 3D: A 2D path `M 0 0 L 100 100` becomes `M 0 0 0 L 100 100 0` in 3D. After the conversion, a shape can be scaled, translated and rotated using matrix transformations.
- Reduced instructions: For simplicity, `M`, `L`, `C`, `Q`, `Z` are used internally. Other instructions will be converted to these.
- Flat extrusion: When extruded, a front and back surface will be generated, and inbetween, tiles in uniform colors are calculated that are orthogonal to the faces.
- Strokes: SVG only supports strokes drawn from the center of the line, so strokes would overlap the side tiles. To prevent this, the stroke width is halfed by applying a mask.

**Current Limitations**:

- No perspective: Perspective is currently not implemented.
- Only flat extrusions: Shapes like a sphere or a torus are not supported.

**Current bugs:**

- Borders are either not antialiased, or show a white line, depending on the `crispEdges` attribute.
- z-index sorting is extremely primitive and not correct.

**Not planned / not possible:**

- Lighting, shaders, materials, shadows etc - this engine is only good for these types of animations.
