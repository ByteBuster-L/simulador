import Interactable from './Interactable.js';

export default class Grifo extends Interactable {
    constructor(nombreMesh, scene, gameManager) {
        super(nombreMesh, scene, gameManager);
        this.abierto = false;
        this.sistemaParticulas = null;
    }

    crearAgua() {
        // Crear un emisor de partículas (Agua)
        const particleSystem = new BABYLON.ParticleSystem("agua", 2000, this.scene);
        particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
        
        // Donde sale el agua (la posición del grifo)
        particleSystem.emitter = this.mesh.position; 
        
        particleSystem.color1 = new BABYLON.Color4(0.4, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.1;
        particleSystem.emitRate = 100; // Cuánta agua sale
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0); // Gravedad hacia abajo
        particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1); // Dirección aleatoria
        particleSystem.direction2 = new BABYLON.Vector3(1, -1, 1);

        this.sistemaParticulas = particleSystem;
    }

    interactuar() {
        if (!this.sistemaParticulas) {
            this.crearAgua();
        }

        this.abierto = !this.abierto;

        if (this.abierto) {
            this.sistemaParticulas.start();
            console.log("Grifo Abierto");
        } else {
            this.sistemaParticulas.stop();
            console.log("Grifo Cerrado");
        }

        // Avisar al GameManager para que cobre
        this.gameManager.registrarGrifo(this);
    }
}