import { EquirectangularReflectionMapping, Euler, Event, Group, Mesh, MeshPhysicalMaterial, Object3D, SphereGeometry, Vector3 } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import type { Animation } from '../helpers/animator';
import type { StagerAction, Stager } from '../helpers/stager';

export class Worlds implements Object {
    name = 'Worlds';
    objects: Map<String, Object3D<Event>> = new Map();
    animations: Map<String, Animation> = new Map();
    
    spawn: StagerAction = (stager: Stager) => {
        const color = 0x2fafa3;
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
        const world = new Group();
        world.add(sphere);
        this.objects.set('PianoWorld', world);
        
        const target = new Group();
        stager.add(target);
        this.objects.set('PianoWorldTarget', target);

        const worldToTarget: Animation = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                const targetPosition = target.position;
                const targetNormalizedVector = new Vector3(0,0,0);
                targetNormalizedVector.x = targetPosition.x - world.position.x;
                targetNormalizedVector.y = targetPosition.y - world.position.y;
                targetNormalizedVector.z = targetPosition.z - world.position.z;
                targetNormalizedVector.normalize()
                // group.add(objectToMove);
            }
        };
        this.animations.set('worldToTarget', worldToTarget);



    }
}