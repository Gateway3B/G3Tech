import type { Stager } from './stager';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Clock, Object3D, AnimationMixer, type Event } from 'three';

export type AnimationAction = (deltaTime: number, stager: Stager) => void;

export interface Animation {
    loop: boolean;
    done: boolean;
    action: AnimationAction;
}

export class Animator {

    controls: OrbitControls;
    mixers: AnimationMixer[] = [];

    constructor(private stager: Stager) {
        this.controls = new OrbitControls(this.stager.camera, this.stager.renderer.domElement)
        this.controls.enableDamping = true;
        if (window.innerWidth / window.innerHeight <= 1.2) {
            this.controls.enabled = false;
        }
        this.animateBootstrap();
    }

    animateBootstrap() {
        const stager = this.stager;
        const mixers = this.mixers;
        const controls = this.controls;

        const clock = new Clock(false);

        function animate(time: number) {
            requestAnimationFrame(animate);
            if (stager.paused) {
                clock.stop();
                return;
            } else if (!clock.running) {
                clock.start();
            }

            const deltaTime = clock.getDelta();

            stager.objects?.forEach(object => {
                object.animations?.forEach(animation => {
                    if (animation.loop) animation.done = false;
                    if (animation.done) return;
                    animation.action(deltaTime, stager);
                });

                object.objects.forEach(object => {
                    updateMatrixWorldRecursive(object);
                });
            });
    
            mixers.forEach(mixer => {
                mixer.update(deltaTime);
            });
    
            controls.update();
            
            stager.render();
        }

        function updateMatrixWorldRecursive(object: Object3D) {
            object.children.forEach(child => {
                child.updateMatrixWorld();
                updateMatrixWorldRecursive(child);
            });
        }

        requestAnimationFrame(animate);
    }
}