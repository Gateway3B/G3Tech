import type { Event, Object3D } from 'three';
import type { Animation } from '../helpers/animator';
import type { Stager, StagerAction } from '../helpers/stager';
import type { Object } from '../helpers/object';
import * as THREE from 'three';

export class Skybox implements Object {
    name = 'Skybox';
    objects: Map<String, Object3D> = new Map();
    animations: Map<String, Animation> = new Map();
    
    spawn: StagerAction = (stager: Stager) => {
        const nebula = new THREE.TextureLoader().load('../../../Nebula.png', () => {
            // setTimeout(() => stager.paused = false, 500);
        });
        nebula.colorSpace = THREE.SRGBColorSpace;
        
        const materal = new THREE.MeshBasicMaterial({
            map: nebula,
            side: THREE.BackSide
        });

        const sphere = new THREE.SphereGeometry(100, 100, 100);
        const skybox = new THREE.Mesh(sphere, materal);
        sphere.rotateY(-10);
        stager.add(skybox);
    };

}