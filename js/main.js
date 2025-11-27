import Departamento from './Environments/Departamento.js';
import Jugador from './jugador.js';

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
scene.collisionsEnabled = true;

// Luz y camara temporales para trabjar el departamento
const luz = new BABYLON.HemisphericLight("Luz", new BABYLON.Vector3(0,1,0), scene);
luz.intensity = 1.5
const jugador = new Jugador(scene, canvas);

const departamento = new Departamento(scene);

engine.runRenderLoop( function() {
    scene.render();
});