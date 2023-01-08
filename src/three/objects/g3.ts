import { Clock, Euler, Event, Group, MathUtils, Mesh, Object3D, Quaternion, Scene, Vector3 } from 'three';
import type { Animation } from '../helpers/animator';
import type { Stager, StagerAction } from '../helpers/stager';
import type { Object } from '../helpers/object';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Interp, SmoothType } from '../helpers/interp';

interface Offset {
    top: number,
    left: number
}

interface Size {
    width: number, 
    height: number
}

export class G3 implements Object {
    name = 'G3';
    objects: Map<String, Object3D<Event>> = new Map();
    animations: Map<String, Animation> = new Map();
    
    spawn: StagerAction = (stager: Stager) => {

        const top = this.spawnBeam(stager, 'top', undefined,
            { width: 8, height: 1 }, 
            { top: 2, left: 0 }, 
            { top: 0, left: 0 });

        const left1 = this.spawnBeam(stager, 'left1', top,
            { width: 1, height: 5 }, 
            { top: 0,  left: 3.5 }, 
            { top: -2, left: 0},
            false);
        const left2 = this.spawnBeam(stager, 'left2', left1, 
            { width: 4, height: 1 }, 
            { top: -2, left: 0 }, 
            { top: 0, left: -1.5},
            false);
        const left3 = this.spawnBeam(stager, 'left3', left2, 
            { width: 1, height: 3 }, 
            { top: 0, left: -1.5 }, 
            { top: 1, left: 0},
            false);
        const left4 = this.spawnBeam(stager, 'left4', left3, 
            { width: 2, height: 1 }, 
            { top: 1, left: 0 }, 
            { top: 0, left: 0.5},
            false);
        
        const right1 = this.spawnBeam(stager, 'right1', top, 
            { width: 1, height: 5 }, 
            { top: 0, left: -3.5 }, 
            { top: -2, left: 0},
            true);
        const right2 = this.spawnBeam(stager, 'right2', right1, 
            { width: 3, height: 1 }, 
            { top: 0, left: 0 }, 
            { top: 0, left: 1},
            true);
        const right3 = this.spawnBeam(stager, 'right3', right1, 
            { width: 3, height: 1 }, 
            { top: -2, left: 0 }, 
            { top: 0, left: 1},
            true);

        const end = new Quaternion().setFromEuler(new Euler(0, 0, 0));
        const duration = 0.9;
    
        const left4Start = new Quaternion().copy(left4.parent!.quaternion);
        const interp4 = new Interp(duration, SmoothType.EASYALL);
        const anim4 = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                if (interp4.done()) {
                    anim4.done = true;
                }
                left4.parent?.quaternion.slerpQuaternions(left4Start, end, interp4.increment(deltaTime));
            }
        };
        this.animations.set('anim4', anim4);

        const left3Start = new Quaternion().copy(left3.parent!.quaternion);
        const right2Start = new Quaternion().copy(right2.parent!.quaternion);
        const interp3R = new Interp(duration, SmoothType.EASYALL);
        const interp3L = new Interp(duration, SmoothType.EASYALL);
        const anim3 = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                if (interp3L.done() && interp3R.done()) {
                    anim3.done = true;
                    anim4.done = false;
                }
                right2.parent?.quaternion.slerpQuaternions(right2Start, end, interp3R.increment(deltaTime));
                left3.parent?.quaternion.slerpQuaternions(left3Start, end, interp3L.increment(deltaTime));
            }
        };
        this.animations.set('anim3', anim3);

        const right3Start = new Quaternion().copy(right3.parent!.quaternion);
        const left2Start = new Quaternion().copy(left2.parent!.quaternion);
        const interp2L = new Interp(duration, SmoothType.EASYALL);
        const interp2R = new Interp(duration, SmoothType.EASYALL);
        const anim2 = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                if (interp2R.done() && interp2L.done()) {
                    anim2.done = true;
                    anim3.done = false;
                }
                right3.parent?.quaternion.slerpQuaternions(right3Start, end, interp2R.increment(deltaTime));
                left2.parent?.quaternion.slerpQuaternions(left2Start, end, interp2L.increment(deltaTime));
            }
        };
        this.animations.set('anim2', anim2);

        const right1Start = new Quaternion().copy(right1.parent!.quaternion);
        const left1Start = new Quaternion().copy(left1.parent!.quaternion);
        const interp1L = new Interp(duration, SmoothType.EASYALL);
        const interp1R = new Interp(duration, SmoothType.EASYALL);
        const anim1 = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                if (interp1L.done() && interp1R) {
                    anim1.done = true;
                    anim2.done = false;
                }
                right1.parent?.quaternion.slerpQuaternions(right1Start, end, interp1R.increment(deltaTime));
                left1.parent?.quaternion.slerpQuaternions(left1Start, end, interp1L.increment(deltaTime));
            }
        };
        this.animations.set('anim1', anim1);
    };

    private spawnBeam(stager: Stager, name: String, parent: Object3D<Event> | undefined, 
        { width, height }: Size,
        pivotOffset: Offset,
        centerOffset: Offset,
        rotDir?: boolean
    ) {
        const color = 0x00cc00;
        const hdr = new RGBELoader().load('../../../PureSky.hdr', () => {
            hdr.mapping = THREE.EquirectangularReflectionMapping;
        });
        const material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 1,
            ior: 1.450,
            color: color,
            envMap: hdr,
            envMapIntensity: 2,
        });
        material.thickness = 10;

        const geometry = new RoundedBoxGeometry(width, height, 1, undefined, 0.2);

        const pivot = new Group();
        pivot.position.set(-pivotOffset.left, pivotOffset.top, 0);
        const mesh = new Mesh(geometry, material);
        mesh.position.set(-centerOffset.left, centerOffset.top, 0);
        pivot.add(mesh);

        if (rotDir != undefined) {
            const quat = new Quaternion().setFromEuler(new Euler(0, 0, MathUtils.DEG2RAD * 90 * (rotDir ? -1 : 1)));
            pivot.quaternion.copy(quat);
        }

        if (parent)
            parent.add(pivot);
        else
            stager.scene.add(pivot);
        this.objects.set(name, pivot);
        return mesh;
    }
}
