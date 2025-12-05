export default class Interactable {
    constructor(nombreMesh, scene, gameManager) {
        this.scene = scene;
        this.gameManager = gameManager;
        
        this.mesh = this.scene.getMeshByName(nombreMesh);

        if (this.mesh) {
            this.mesh.metadata = { interactable: this };
            this.mesh.getChildMeshes().forEach(hijo => {
                hijo.metadata = { interactable: this };
            });

        } else {
            console.error("No encontré la malla: " + nombreMesh);//Algo de debuggin para no perder las buenas costumbres :D
        }
    }

    interactuar() {
        console.log("Interaccion");
    }
}