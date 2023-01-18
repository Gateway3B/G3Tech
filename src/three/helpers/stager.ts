import type { Object3D } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Object } from './object';
import { Animator } from './animator';

export type StagerAction = (stager: Stager) => void;

export class Stager {
	
    paused = true;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#bg') as HTMLCanvasElement
	});
	loader = new GLTFLoader();
	animator = new Animator(this);

	objects: Map<String, Object> = new Map();
	
	constructor() {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		
        const pointLight = new THREE.PointLight(0xfffff);
        pointLight.position.set(5, 5, 5);
        this.add(pointLight);
		
		document.body.onresize = ((event) => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	getRenderer() { return this.renderer }
	getScene() { return this.scene }
	getCamera() { return this.camera }
	render() { this.renderer.render(this.scene, this.camera) }
	add(...object: Object3D[]) { this.scene.add(...object) }
	load(path: string) {
		this.loader.load(path, (gltf) => {
			this.scene.add(gltf.scene);

            if (gltf.animations.length == 0) return;

            const mixer = new THREE.AnimationMixer(gltf.scene);

            this.animator.mixers.push(mixer);
            gltf.animations.forEach(anim => {
                mixer.clipAction(anim).play();
            });
		}, 
        (event) => {
            event.target
        }
        , (err) => console.log(err));
	}
	createObject(object: Object) {
		object.spawn(this);
		this.objects.set(object.name, object);
	}
}
