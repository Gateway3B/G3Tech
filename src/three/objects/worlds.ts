import { EquirectangularReflectionMapping, Group, Mesh, MeshPhysicalMaterial, Object3D, Raycaster, SphereGeometry, Sprite, SpriteMaterial, SRGBColorSpace, Texture, Vector2, Vector3, type ColorRepresentation } from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import type { Animation } from '../helpers/animator';
import type { StagerAction, Stager } from '../helpers/stager';

type World = {
    sphere: Object3D,
    world: Object3D,
    target: Object3D,
    offset: number,
    route: string
}

export class Worlds implements Object {
    name = 'Worlds';
    objects: Map<String, Object3D> = new Map();
    animations: Map<String, Animation> = new Map();

    worlds: World[] = [];

    spawn: StagerAction = (stager: Stager) => {
        let time = 0;
        let targeting = false;
        let targetingId = -1;
        let lastTime = 0;
        const debounceTime = 0.8;
        let worldsCreated = false;
        let mouseDownOnWorld = false;
        const worldToTarget: Animation = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {

                if (!worldsCreated) {
                    let height = 10;
                    if (window.innerHeight > window.innerWidth) {
                        height = 20
                    }
                    this.worlds.push(this.createWorld(stager, new Vector3(-20, 0, 0), new Vector3(-6, 0, 0), 0x710f89, 'Code'));
                    this.worlds.push(this.createWorld(stager, new Vector3(-2, -height, 0), new Vector3(-2, -4, 0), 0x7562bc, 'Videos'));
                    this.worlds.push(this.createWorld(stager, new Vector3(2, -height, 0), new Vector3(2, -4, 0), 0x56526f, 'Models'));
                    this.worlds.push(this.createWorld(stager, new Vector3(20, 0, 0), new Vector3(6, 0, 0), 0x013763, 'Piano'));
                    this.worlds.push(this.createWorld(stager, new Vector3(-2, height, 0), new Vector3(-2, 4, 0), 0x146466, 'Sites'));
                    this.worlds.push(this.createWorld(stager, new Vector3(2, height, 0), new Vector3(2, 4, 0), 0x346f61, 'Blog'));
                    worldsCreated = true;
                    document.body.onmousedown = (event) => {
                        if (targeting) {
                            mouseDownOnWorld = true;
                        }
                    }
                }

                time += deltaTime / 2;

                if (window.innerWidth / window.innerHeight <= 1.2) {
                    document.body.ontouchend = (event) => {
                        console.log(event);
                        this.worlds.forEach(({sphere, world, target, offset, route}) => {
                            const mouse = new Vector2();
                            mouse.x = (event.changedTouches[0].pageX / window.innerWidth) * 2 - 1
                            mouse.y = (1 - (event.changedTouches[0].pageY / window.innerHeight)) * 2 - 1
                        
                            const raycaster = new Raycaster();
                            raycaster.setFromCamera(mouse, stager.camera);
                            const intersected = raycaster.intersectObject(sphere).length > 0

                            if (intersected) {
                                setTimeout(() => {
                                    window.location.href = window.location.href + route;
                                }, 400);
                            }
                        });
                    };
                }

                this.worlds.forEach(({sphere, world, target, offset, route}) => {
                    moveTo(target.position, world);
                    
                    const timeOffset = time + offset;
                    sphere.position.y = Math.cos(timeOffset + 0.2) * Math.cos((timeOffset + 0.2) * 2) * 0.2;
                    sphere.position.x = Math.sin(timeOffset) * Math.sin(timeOffset * 2) * 0.2;

                    if (window.innerWidth / window.innerHeight <= 1.2) {
                        return
                    }
                
                    const hovering = mouseHovering(stager, sphere);
                    const debounce = time > debounceTime + lastTime;

                    if (hovering !== targeting && debounce && (!targeting || (targeting && targetingId == offset))) {
                        lastTime = time;
                        targeting = !targeting;
                        if (targeting)
                            targetingId = offset;
                    }
                    
                    if (targeting && targetingId == offset) {
                        const camOrb = stager.camera.parent!;
                        moveTo(target.position, camOrb, 3);
                        stager.camera.lookAt(camOrb.position);
                        stager.objects.get('Camera')!.animations.get('mouseFloatAnimation')!.done = true;
                        moveTo(new Vector3(0, 0, 5), stager.camera, 3);

                        if (mouseDownOnWorld) {
                            document.body.onmouseup = (event) => {
                                window.location.href = window.location.href + route;
                            };
                        }
                    } else if (!targeting) {
                        document.body.onmouseup = () => {}
                        mouseDownOnWorld = false;
                        document.body.onclick = () => {}
                        targetingId = -1;
                        const camOrb = stager.camera.parent!;
                        moveTo(new Vector3(0, 0, 0), camOrb, 0.3);
                        stager.camera.lookAt(camOrb.position);
                        stager.objects.get('Camera')!.animations.get('mouseFloatAnimation')!.done = false;
                        moveTo(new Vector3(0, 0, 12), stager.camera, 0.3);
                    }
                    
                })
            }
        };
        this.animations.set('worldToTarget', worldToTarget);
    }

    private createWorld(stager: Stager, start: Vector3, end: Vector3, color: ColorRepresentation, text: string): World {
        const hdr = new RGBELoader().load('../../../PureSky.hdr', () => {
            hdr.mapping = EquirectangularReflectionMapping;
        });
        hdr.colorSpace = SRGBColorSpace;
        const material = new MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 0.3,
            ior: 1.0,
            color: color,
            envMap: hdr,
            envMapIntensity: 2,
        });
        material.thickness = 15;


        var canvas = document.createElement('canvas');
        var size = 600;
        canvas.width = size;
        canvas.height = size;
        var context = canvas.getContext('2d')!;
        context.fillStyle = '#a5a5a0';
        context.textAlign = 'center';
        context.font = '150px Moonbeam';
        context.fillText(text, size / 2, size / 2);

        var amap = new Texture(canvas);
        amap.needsUpdate = true;

        var mat = new SpriteMaterial({
            map: amap,
            transparent: true,
            color: 0xffffff
        });

        var sp = new Sprite(mat);
        // sp.position.setZ(1);
        sp.scale.set(3, 3, 1);
        sp.material.depthTest = false;

        const geometry = new SphereGeometry(1);
        const sphere = new Mesh(geometry, material);
        sphere.add(sp);

        const world = new Group();
        world.position.copy(start);
        world.visible = false;
        setTimeout(() => world.visible = true, 300);
        world.add(sphere);
        stager.add(world);
        // this.objects.set('PianoWorld', world);
        
        const target = new Group();
        target.position.copy(end);
        stager.add(target);
        // this.objects.set('PianoWorldTarget', target);

        const offset = Math.random();

        const route = text.toLowerCase();

        return {
            sphere,
            world,
            target,
            offset,
            route
        }
    }
}

export function mouseHovering(stager: Stager, object: Object3D) {
    const mouse = new Vector2();
    mouse.x = (stager.mouse.x / window.innerWidth) * 2 - 1
    mouse.y = (1 - (stager.mouse.y / window.innerHeight)) * 2 - 1

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, stager.camera);
    return raycaster.intersectObject(object).length > 0;
}

export function moveTo(targetPosition: Vector3, mover: Object3D, speed = 1) {
    const targetNormalizedVector = new Vector3(0,0,0);
    targetNormalizedVector.x = targetPosition.x - mover.position.x;
    targetNormalizedVector.y = targetPosition.y - mover.position.y;
    targetNormalizedVector.z = targetPosition.z - mover.position.z;
    const magnitude = targetNormalizedVector.length();
    if (magnitude > 0.05) {
        targetNormalizedVector.normalize()
        mover.translateOnAxis(targetNormalizedVector, magnitude * 0.01 * speed);
    }
}

function flipY(position: Vector3) {
    return new Vector3().copy(position).setY(-position.y)
}
