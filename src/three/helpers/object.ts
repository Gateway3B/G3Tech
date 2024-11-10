import type { Object3D } from 'three';
import type { Animation } from './animator';
import type { StagerAction } from './stager';

export interface Object {
    name: String;
    objects: Map<String, Object3D>,
    spawn: StagerAction,
    animations: Map<String, Animation>
}