import { Euler, Group, Interpolant, InterpolateSmooth, MathUtils, Object3D, Quaternion, Vector2, Vector3 } from 'three';
import * as THREE from 'three';
import type { Animation } from '../helpers/animator';
import type { Stager, StagerAction } from '../helpers/stager';
import type { Object } from '../helpers/object';
import { Interp, SmoothType } from '../helpers/interp';

export class Camera implements Object {
    name = 'Camera';
    objects: Map<String, Object3D<Event>> = new Map();
    animations: Map<String, Animation> = new Map();
    spawn: StagerAction = (stager: Stager) => {

        const camOrb = new Group();
        camOrb.add(stager.camera);

        let camInterp = new Interp(0.5, SmoothType.EASYOUT);

        let start = new Quaternion().setFromEuler(new Euler(0, 0, 0));
        let end = new Quaternion().setFromEuler(new Euler(0, 0, 0));
        const maxAngle = 20;
        document.body.onmousemove = ((event: MouseEvent) => {
            const size = new Vector2();
            stager.renderer.getSize(size);

            const x = (event.clientX / (size.width / 2)) - 1; 
            const y = (event.clientY / (size.height / 2)) - 1; 

            start.copy(new Quaternion().slerpQuaternions(start, end, camInterp.percent()));
            end = new Quaternion().setFromEuler(new Euler(-y * maxAngle * MathUtils.DEG2RAD, -x * maxAngle * MathUtils.DEG2RAD, 0));
            camInterp = new Interp(0.5, SmoothType.EASYOUT);
        });

        const mouseFloatAnimation: Animation = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {
                camOrb.quaternion.slerpQuaternions(start, end, camInterp.increment(deltaTime));
            }
        };
        this.animations.set('mouseFloatAnimation', mouseFloatAnimation);


        const startDirection = new Quaternion().setFromEuler(new Euler(0, MathUtils.DEG2RAD * 80, 0));
        const startPosition = new Vector3(-7, 0, 0);
        stager.camera.position.setX(-7);
        stager.camera.quaternion.copy(startDirection);

        const endDirection = new Quaternion().setFromEuler(new Euler(0, 0, 0));
        const endPosition = new Vector3(0, 0, 10);

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
                }

                if (turn.percent() > 0.2 && triggerAnim1) {
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