import { Stager } from './helpers/stager';
import { Camera } from './objects/camera';
import { G3 } from './objects/g3';
import { Skybox } from './objects/skybox';

const stager = new Stager();

stager.createObject(new Camera());
stager.createObject(new Skybox());
stager.createObject(new G3());