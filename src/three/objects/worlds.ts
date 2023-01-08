import { EquirectangularReflectionMapping, Euler, Mesh, MeshPhysicalMaterial, Object3D, SphereGeometry } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import type { StagerAction, Stager } from '../helpers/stager';

export class Worlds implements Object {
    name = 'Worlds';
    objects: Map<String, Object3D<Event>> = new Map();
    animations: Map<String, Animation> = new Map();
    
    spawn: StagerAction = (stager: Stager) => {
        const color = 0xf00c00;
        const hdr = new RGBELoader().load('../../../PureSky.hdr', () => {
            hdr.mapping = EquirectangularReflectionMapping;
        });
        const material = new MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 1,
            ior: 1.450,
            color: color,
            envMap: hdr,
            envMapIntensity: 2,
        });
        material.thickness = 10;

        const geometry = new SphereGeometry(1);
        const sphere = new Mesh(geometry, material);
        sphere.position.set(-20, 0, 0);

        stager.add(sphere);
    }
}