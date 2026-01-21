import Departamento from './Environments/Departamento.js';
import Jugador from './jugador.js';
import GameManager from './gameManager.js';

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
scene.collisionsEnabled = true;

const luz = new BABYLON.HemisphericLight("Luz", new BABYLON.Vector3(0,1,0), scene);
luz.intensity = 0.001;

const gameManager = new GameManager(); 

const jugador = new Jugador(scene, canvas, gameManager);

const departamento = new Departamento(scene, gameManager);

jugador.departamento = departamento;

engine.runRenderLoop( function() {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});