import { Euler, Group, Interpolant, InterpolateSmooth, MathUtils, Object3D, Quaternion, Vector2, Vector3 } from 'three';
import * as THREE from 'three';
import type { Animation } from '../helpers/animator';
import type { Stager, StagerAction } from '../helpers/stager';
import type { Object } from '../helpers/object';
import { Interp, SmoothType } from '../helpers/interp';
import { moveTo } from './worlds';

export class Camera implements Object {
    name = 'Camera';
    objects: Map<String, Object3D<Event>> = new Map();
    animations: Map<String, Animation> = new Map();
    
    spawn: StagerAction = (stager: Stager) => {
        const endZ = 12;

        const camOrb = new Group();
        camOrb.add(stager.camera);

        this.objects.set('camOrb', camOrb as any);

        let end = new Quaternion().setFromEuler(new Euler(0, 0, 0));
        const maxAngle = 20;

        document.body.onmousemove = ((event: MouseEvent) => {
            const size = new Vector2();
            stager.renderer.getSize(size);

            const x = (event.clientX / (size.width / 2)) - 1; 
            const y = (event.clientY / (size.height / 2)) - 1; 

            end = new Quaternion().setFromEuler(new Euler(-y * maxAngle * MathUtils.DEG2RAD, -x * maxAngle * MathUtils.DEG2RAD, 0));
        });

        const mouseFloatAnimation: Animation = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                const angle = stager.camera.parent!.quaternion.angleTo(end);
                stager.camera.parent!.quaternion.rotateTowards(end, angle / (Math.PI * 2 * 4));
            }
        };
        this.animations.set('mouseFloatAnimation', mouseFloatAnimation);


        const startDirection = new Quaternion().setFromEuler(new Euler(0, MathUtils.DEG2RAD * -70, 0));
        const startPosition = new Vector3(-6, 0, -1);
        stager.camera.position.copy(startPosition);
        stager.camera.quaternion.copy(startDirection);

        const endDirection = new Quaternion().setFromEuler(new Euler(0, 0, 0));
        const endPosition = new Vector3(0, 0, endZ);

        const turn = new Interp(5, SmoothType.EASYALL);
        const move = new Interp(5, SmoothType.EASYALL);

        let triggerAnim1 = true;

        const sweepingAnimation: Animation = {
            loop: false,
            done: false,
            action: (deltaTime: number, stager: Stager) => {
                if (turn.percent() >= 1 && move.percent() >= 1) {
                    sweepingAnimation.done = true;
                    mouseFloatAnimation.done = false;
                    stager.objects.get('Worlds')!.animations.get('worldToTarget')!.done = false;
                }

                if (turn.percent() > 0.0 && triggerAnim1) {
                    stager.objects.get('G3')!.animations.get('anim1')!.done = false;
                    triggerAnim1 = false;
                }

                stager.camera.quaternion.slerpQuaternions(startDirection, endDirection, turn.increment(deltaTime));
                stager.camera.position.lerpVectors(startPosition, endPosition, move.increment(deltaTime));
            }
        }
        this.animations.set('sweep', sweepingAnimation);
    };


}