import { Matrix4, Vector3 } from '../../math/exports.js';
import Renderable from './renderable.js';

const v = `#version 300 es
    precision mediump float;
    
    in vec3 vertex;
    in vec3 normal;
    
    uniform mat4 world;
    
    uniform camera{
        mat4 view;
        mat4 projection;
    };
    
    out vec3 v_normal;
    
    void main(void) {
        v_normal = (world * vec4(normal, 1.0)).xyz;
        
        gl_Position = projection * view * world * vec4(vertex, 1.0);
    }
`;
const f = `#version 300 es
    precision mediump float;
    
    in vec3 v_normal;
    
    const vec3 baseColor = vec3(.8, .5, .8);
    const vec3 posLight = vec3(4.0, 3.0, 2.0);
    const vec3 lightColor = vec3(0.25, 0.25, 0.25);
                
    out vec4 color;
    
    void main(void) {
        float diffAngle = max(dot(v_normal, normalize(posLight - v_normal)), 0.0);
        color = vec4(baseColor + lightColor * diffAngle, 1.0);
    }
`;
const parse = content => {
    let vertices = [];
    let UVs = [];
    let normals = [];
    let faces = [];

    for(const [type, ...args] of content.split('\n').map(l => l.split(' ')))
    {
        switch(type)
        {
            case 'v':
                vertices.push(args.map(a => Number.parseFloat(a)));
                break;

            case 'vt':
                UVs.push(args.map(a => Number.parseFloat(a)));
                break;

            case 'vn':
                normals.push(args.map(a => Number.parseFloat(a)));
                break;

            case 'f':
                faces.push(args.map(a => a.split('/').map(i => Number.parseInt(i) - 1)));
                break;
        }
    }

    return [ vertices, UVs, normals, faces ];
};

export default class Obj extends Renderable
{
    constructor(renderer, content)
    {
        const [ vertices, UVs, normals, faces ] = parse(content);

        let buffer = [];
        let indices = [];
        let i = 0;

        for(const set of faces)
        {
            for(const [ v, vt, vn ] of set)
            {
                indices.push(i);
                buffer.push(...vertices[v]);

                if(Number.isNaN(vt) === false)
                {
                    buffer.push(...UVs[vt]);
                }

                buffer.push(...normals[vn]);

                i++;
            }
        }

        super(renderer, v, f, buffer, indices);
    }

    render(renderer)
    {
        this.program.world = Matrix4.identity
            .translate(new Vector3(0, 1.5, 0))
            .rotate(22.5 * Math.sin(performance.now() * .0025), new Vector3(1, 0, 0))
            .points;

        super.render(renderer);
    }
}