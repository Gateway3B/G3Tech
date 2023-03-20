import { ColorRepresentation, EquirectangularReflectionMapping, Euler, Event, Group, Mesh, MeshPhysicalMaterial, Object3D, Raycaster, SphereGeometry, Sprite, SpriteMaterial, Texture, Vector2, Vector3 } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import type { Animation } from '../helpers/animator';
import type { StagerAction, Stager } from '../helpers/stager';

type World = {
    sphere: Object3D<Event>,
    world: Object3D<Event>,
    target: Object3D<Event>,
    offset: number,
    route: string
}

export class Worlds implements Object {
    name = 'Worlds';
    objects: Map<String, Object3D<Event>> = new Map();
    animations: Map<String, Animation> = new Map();

    worlds: World[] = [];

    spawn: StagerAction = (stager: Stager) => {
        let time = 0;
        let targeting = false;
        let targetingId = -1;
        let lastTime = 0;
        const debounceTime = 0.6;
        let worldsCreated = false;
        const worldToTarget: Animation = {
            loop: false,
            done: true,
            action: (deltaTime: number, stager: Stager) => {

                if (!worldsCreated) {
                    this.worlds.push(this.createWorld(stager, new Vector3(-20, 0, 0), new Vector3(-6, 0, 0), 0x710f89, 'Coding'));
                    this.worlds.push(this.createWorld(stager, new Vector3(-2, -10, 0), new Vector3(-2, -4, 0), 0x7562bc, 'Videos'));
                    this.worlds.push(this.createWorld(stager, new Vector3(2, -10, 0), new Vector3(2, -4, 0), 0x56526f, 'Modeling'));
                    this.worlds.push(this.createWorld(stager, new Vector3(20, 0, 0), new Vector3(6, 0, 0), 0x013763, 'Piano'));
                    this.worlds.push(this.createWorld(stager, new Vector3(-2, 10, 0), new Vector3(-2, 4, 0), 0x146466, 'Websites'));
                    this.worlds.push(this.createWorld(stager, new Vector3(2, 10, 0), new Vector3(2, 4, 0), 0x346f61, 'Blog'));
                    worldsCreated = true;
                }

                time += deltaTime / 2;

                this.worlds.forEach(({sphere, world, target, offset, route}) => {
                    moveTo(target.position, world);
                    
                    const timeOffset = time + offset;
                    sphere.position.y = Math.cos(timeOffset + 0.2) * Math.cos((timeOffset + 0.2) * 2) * 0.2;
                    sphere.position.x = Math.sin(timeOffset) * Math.sin(timeOffset * 2) * 0.2;
                
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

                        document.body.onmouseup = (event) => {
                            window.location.href = window.location.href + route;
                        };

                    } else if (!targeting) {
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
        const material = new MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 0.3,
            ior: 0.450,
            color: color,
            envMap: hdr,
            envMapIntensity: 2,
        });
        material.thickness = 10;


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

export function mouseHovering(stager:Stager, object: Object3D<Event>) {
    const mouse = new Vector2();
    mouse.x = (stager.mouse.x / window.innerWidth) * 2 - 1
    mouse.y = (1 - (stager.mouse.y / window.innerHeight)) * 2 - 1

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, stager.camera);
    return raycaster.intersectObject(object).length > 0;
}

export function moveTo(targetPosition: Vector3, mover: Object3D<Event>, speed = 1) {
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
