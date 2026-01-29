import Departamento from './Environments/Departamento.js';
import Jugador from './jugador.js';
import GameManager from './gameManager.js';
import SistemaDialogos from './interacciones/sistemaDialogos.js';
import { dialogoTutorial } from './interacciones/Dialogos.js';

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
scene.collisionsEnabled = true;

const luz = new BABYLON.HemisphericLight("Luz", new BABYLON.Vector3(0,1,0), scene);
luz.intensity = 0.01;

const gameManager = new GameManager(); 

const jugador = new Jugador(scene, canvas, gameManager);

const departamento = new Departamento(scene, gameManager);

jugador.departamento = departamento;

// 1. Instanciar (Haz esto una sola vez al inicio)
const sistemaDialogos = new SistemaDialogos(scene);

// 2. Trigger para empezar (ej. al iniciar el nivel)
sistemaDialogos.iniciar(dialogoTutorial);

// 3. Input para avanzar (Agrégalo a tu listener de teclado existente)
window.addEventListener("keydown", (ev) => {
    // Si hay un diálogo activo, la tecla ENTER avanza el texto
    if (sistemaDialogos.dialogoActivo && (ev.key === "Enter" || ev.key === " ")) {
        sistemaDialogos.siguiente();
    }
});

engine.runRenderLoop( function() {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});