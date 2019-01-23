import Renderable from '../renderable.js';

const v = `#version 300 es
    precision mediump float;
    
    in vec2 vertex;
    
    out vec2 pos;
    
    void main(void) {
        pos = vertex;
    
        gl_Position = vec4(vertex, 0.0, 1.0);
    }
`;
const f = `#version 300 es
    precision mediump float;
    
    in vec2 pos;
    
    uniform sampler2D tex;
                
    out vec4 color;
    
    void main(void) {
        color = texelFetch(tex, ivec2(gl_FragCoord.xy), 0);
    }
`;

export default class Quad extends Renderable
{
    constructor(renderer)
    {
        super(renderer, v, f, [
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ], [
            0, 1, 2,
            1, 3, 2,
        ]);

        this.program.tex = 0;
    }
}