import { Stager } from './helpers/stager';
import { Camera } from './objects/camera';
import { G3 } from './objects/g3';
import { Skybox } from './objects/skybox';
import { Worlds } from './objects/worlds';



const stager = new Stager();

stager.createObject(new Camera());
stager.createObject(new Skybox());
stager.createObject(new G3());
stager.createObject(new Worlds());

stager.paused = true;

const runChecker = setInterval(function () {
    const title = document.querySelector('h1')!;
    const description = document.querySelector('h2')!;

    if (title.getAttribute('done') && description.getAttribute('done')) {
        clearInterval(runChecker);
        stager.paused = false;
        (document.querySelector('#bg') as HTMLElement)!.style.display = 'block';
    }

}, 100);