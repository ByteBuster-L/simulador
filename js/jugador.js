export default class Jugador{
    constructor(scene, canvas){
        this.scene = scene
        this.canvas = canvas

        this.crearCamaraPrimeraPersona();
        this.scene.registerBeforeRender(() => {
            this.detectarObjeto();
        });
    }

    crearCamaraPrimeraPersona() {
        const camera = new BABYLON.UniversalCamera("Camara", new BABYLON.Vector3(0, 7, 0), this.scene)
        camera.checkCollisions = true
        camera.minZ = 0.1

        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysUp.push(87);
        camera.keysRight.push(68);

        this.camera = camera
        this.camera.attachControl(this.canvas, true);
    }

    detectarObjeto(){
        const ray = this.camera.getForwardRay(3)
        const hit = this.scene.pickWithRay(ray)

        if (hit.hit === true) {
            console.log(hit.pickedMesh.name)
        }
    }
}