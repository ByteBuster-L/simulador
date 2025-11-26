import Departamento from './Environments/Departamento.js';

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

// Luz y camara temporales para trabjar el departamento
const luz = new BABYLON.HemisphericLight("Luz", new BABYLON.Vector3(0,1,0), scene);
luz.intensity = 0.4
const camara = new BABYLON.ArcRotateCamera("Camarita", 0, 0, 20, new BABYLON.Vector3.Zero(), scene);
camara.attachControl(canvas, true)

const departamento = new Departamento(scene);

engine.runRenderLoop( function() {
    scene.render();
});