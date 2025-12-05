import Interactable from './Interactable.js';

export default class Luz extends Interactable {
    constructor(nombreMesh, scene, gameManager) {
        super(nombreMesh, scene, gameManager);
        this.encendida = false;

        if (this.mesh) {
            const posicionTecho = this.mesh.position.clone();
            posicionTecho.y += 3; 
            this.lightSource = new BABYLON.PointLight(nombreMesh + "_luz", posicionTecho, this.scene);
            
            this.lightSource.intensity = 0; 
            this.lightSource.diffuse = new BABYLON.Color3(1, 1, 0.8);
            this.lightSource.range = 15; 
        }
    }

    interactuar() {
        this.encendida = !this.encendida;

        if (this.encendida) {
            this.lightSource.intensity = 500;
            console.log("Luz Encendida");
        } else {
            this.lightSource.intensity = 0;
            console.log("Luz Apagada");
        }
        this.gameManager.registrarLuz(this);
    }
}