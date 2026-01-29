export default class Jugador {
    constructor(scene, canvas, GameManager) {
        this.scene = scene;
        this.canvas = canvas;
        this.GameManager = GameManager;
        
        // IMPORTANTE: Asegúrate de asignar esto desde tu Main o GameManager después de crear el jugador
        // Ej: jugador.departamento = departamento;
        this.departamento = null; 

        // 1. Crear la cámara
        this.crearCamaraPrimeraPersona();

        this.uiInteraccion = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI_E");
        this.iconoInteractuar = new BABYLON.GUI.Image("iconoE", "../assets/Resources/boton_E.png"); 
        // ^^^ Asegúrate que la ruta coincida con tu carpeta ^^^

        this.iconoInteractuar.width = "300px";  // Ajusta el tamaño según tu imagen
        this.iconoInteractuar.height = "300px";
        this.iconoInteractuar.isVisible = false; // Empieza oculto
        this.uiInteraccion.addControl(this.iconoInteractuar);

        // 2. Rayo de interacción (Radar constante)
        this.scene.registerBeforeRender(() => {
            // --- CORRECCIÓN 2: Llamamos a la función todo el tiempo ---
            this.checarRadar();
        });

        this.scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.intentarInteractuar();
        };

        window.addEventListener("keydown", (evt) => {
            const letra = evt.key;
            if(letra == "e" || letra == "E"){
                this.intentarInteractuar();
            }
        })
    }

    crearCamaraPrimeraPersona() {
        const camara = new BABYLON.UniversalCamera("camaraJugador", new BABYLON.Vector3(10, 4, 0), this.scene);

        camara.attachControl(this.canvas, true);
        camara.speed = 3.0;
        camara.angularSensibility = 1000; 
        camara.inertia = 0.1;

        // --- TECLAS WASD ---
        camara.keysUp = [87];    // W
        camara.keysDown = [83];  // S
        camara.keysLeft = [65];  // A
        camara.keysRight = [68]; // D

        // Fisica
        camara.checkCollisions = true; 
        camara.applyGravity = true;    

        camara.ellipsoid = new BABYLON.Vector3(1, 2.5, 1); 
        camara.ellipsoidOffset = new BABYLON.Vector3(0, -1.5, 1)

        // Evitar recortes visuales
        camara.minZ = 0.1;

        this.canvas.addEventListener("click", () => {
            this.canvas.requestPointerLock();
        })

        this.camera = camara;
    }

    // --- NUEVA FUNCIÓN: EL RADAR VISUAL ---
    checarRadar() {
        // Seguridad: Si no hemos definido el departamento o no hay objetos, no hagas nada
        if (!this.departamento || !this.departamento.interactuables) return;

        let algunObjetoCerca = false;

        // Revisamos todos los objetos. Si al menos UNO está cerca, mostramos la E
        this.departamento.interactuables.forEach(objeto => {
            if (objeto.mesh) { // Asegurar que el objeto tiene malla
                const distancia = BABYLON.Vector3.Distance(this.camera.position, objeto.mesh.position);
                if (distancia <= 5) {
                    algunObjetoCerca = true;
                }
            }
        });
        this.iconoInteractuar.isVisible = algunObjetoCerca;
    }

    intentarInteractuar() {
        // Seguridad por si intentas interactuar antes de que cargue el nivel
        if (!this.departamento || !this.departamento.interactuables) return;

        this.departamento.interactuables.forEach(objeto => {
            const distancia = BABYLON.Vector3.Distance(this.camera.position, objeto.mesh.position)
            if(distancia <= 5){
                objeto.interactuar(); // <--- Esto llama a la función del objeto (Refri, Luz, etc)
            }
        });
    }
}