export default class Departamento {
    constructor(scene) {
        this.scene = scene;

        this.crearSuelo();
        this.crearParedes();
        this.crearMuebles();
        this.decorarInteriores();
    }

    crearSuelo() {

        const suelo = new BABYLON.MeshBuilder.CreateBox("suelito", {width: 50, height: 70, depth: 0.1}, this.scene);
        suelo.rotation.x = Math.PI / 2
    };

    crearParedes() {
        const materialMuros = new BABYLON.PBRMaterial("materialMuros", this.scene);
        materialMuros.metallic = 0;
        materialMuros.roughness = 1;

        const rutaBase = "../Assets/mods/"; // O "../Assets/Textures/" según donde lo tengas
        const nombreTextura = "pared_blanca"; // Tu archivo base

        // Cargamos las texturas
        materialMuros.albedoTexture = new BABYLON.Texture(`${rutaBase}${nombreTextura}_color.jpg`, this.scene);
        materialMuros.bumpTexture = new BABYLON.Texture(`${rutaBase}${nombreTextura}_normal.jpg`, this.scene);
        materialMuros.microSurfaceTexture = new BABYLON.Texture(`${rutaBase}${nombreTextura}_rough.jpg`, this.scene);

        // Truco: Escalar la textura automáticamente para que no se vea estirada en paredes largas
        // (Esto es una aproximación, si quieres perfección hay que ajustar por pared)
        materialMuros.albedoTexture.uScale = 10; 
        materialMuros.albedoTexture.vScale = 2;
        materialMuros.bumpTexture.uScale = 10; 
        materialMuros.bumpTexture.vScale = 2;
        
        const paredOeste = new BABYLON.MeshBuilder.CreateBox("paredsitaOeste", {width: 50, height: 10, depth: 1}, this.scene);
        paredOeste.position.y = 5
        paredOeste.position.z = -34.5
        paredOeste.material = materialMuros

        const paredEste = new BABYLON.MeshBuilder.CreateBox("paredsitaEste", {width: 50, height: 10, depth: 1}, this.scene);
        paredEste.position.y = 5;
        paredEste.position.z = 34.5
        paredEste.material = materialMuros

        const paredNorte = new BABYLON.MeshBuilder.CreateBox("paredsitaNorte", {width: 70, height: 10, depth: 1}, this.scene);
        paredNorte.position.y = 5;
        paredNorte.rotation.y = Math.PI / 2;
        paredNorte.position.x = -24.5 
        paredNorte.material = materialMuros

        const paredSur = new BABYLON.MeshBuilder.CreateBox("paredsitaSur", {width: 70, height: 10, depth: 1}, this.scene);
        paredSur.position.y = 5;
        paredSur.rotation.y = Math.PI / 2
        paredSur.position.x = 24.5
        paredSur.material = materialMuros

        const paredSala = new BABYLON.MeshBuilder.CreateBox("paredSala", {width: 22, height: 10, depth: 1}, this.scene)
        paredSala.position.y = 5
        paredSala.rotation.y = Math.PI / 2
        paredSala.position.z = -23
        paredSala.material = materialMuros

        const paredCentro = new BABYLON.MeshBuilder.CreateBox("paredCentro0", {width: 30, height: 10, depth: 1}, this.scene);
        paredCentro.position.y = 5
        paredCentro.rotation.y = Math.PI / 2
        paredCentro.position.x = -6.5
        paredCentro.position.z = 20
        paredCentro.material = materialMuros

        const paredCentroC = new BABYLON.MeshBuilder.CreateBox("paredCentroC", {width: 14, height: 10, depth: 1}, this.scene);
        paredCentroC.position.y = 5
        paredCentroC.rotation.y = Math.PI / 2
        paredCentroC.position.x = -6.5
        paredCentroC.position.z = -6.5
        paredCentroC.material = materialMuros

        const paredBaño = new BABYLON.MeshBuilder.CreateBox("paredeBaño", {width: 18, height: 10, depth: 1}, this.scene);
        paredBaño.position.y = 5
        paredBaño.position.x = -15
        paredBaño.position.z = 16
        paredBaño.material = materialMuros

        const paredCuarto = new BABYLON.MeshBuilder.CreateBox("paredCuarto", {width: 18, height: 10, depth: 1}, this.scene)
        paredCuarto.position.y = 5
        paredCuarto.position.x = -15
        paredCuarto.material = materialMuros

        const paredes = [paredOeste, paredEste, paredNorte, paredSur, paredSala, paredCentro, paredCentroC, paredBaño, paredCuarto];
        paredes.forEach(pared => {
            pared.checkCollisions = true;
        });
    };

    async cargarObjeto(nombreArchivo, x, y, z, rotY, escala) {
        //Esta es para los objetos individuales ya que los paquetes requieren de desglosar la ruta
        const resultado = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            "../Assets/Models/",
            nombreArchivo,
            this.scene
        )

        const modelo = resultado.meshes[0]
        if(modelo){
            modelo.name = nombreArchivo;
            modelo.position = new BABYLON.Vector3(x, y, z);
            modelo.rotation.y = rotY;
            modelo.scaling = new BABYLON.Vector3(escala, escala, escala)
            modelo.rotationQuaternion = null
        }
    }

    async crearMuebles() {

        const resultado = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            "../Assets/Models/",
            "tinylivingpack.glb",
            this.scene
        )

        const configurarMueble = (nombreMueble, x, y, z, rotY, escala) => {
            /*Esta funcion nos ayuda a no estar guardando cada mueble en una variable diferente asi solo la guardamos en una
            y vamos configurando con el nombre y pasando las medidas */
            let mueble = resultado.meshes.find(mesh => mesh.name === nombreMueble);
            
            if(!mueble){
                mueble = resultado.transformNodes.find(node => node.name === nombreMueble)
            }
            if(mueble){
                mueble.rotationQuaternion = null
                mueble.position = new BABYLON.Vector3(x, y, z);
                mueble.rotation.y = rotY;
                mueble.scaling = new BABYLON.Vector3(escala, escala, escala); 
                mueble.setParent(null)
            }
        }

        configurarMueble("TinyLiving_LovelyLoveseat_12", -19, 0.1, -23, Math.PI /2, 4)
        configurarMueble("TinyLiving_LovelyArmchair_33", -14, 0.1, -28, 0, 4)
        configurarMueble("TinyLiving_MediaMarathoner_AllontheWall_10", -0.4, -4.3, -23.4, Math.PI/-2, 7)
        configurarMueble("TinyLiving_ContemporaryCarpet_40", -15, 0.1, -24, Math.PI / 2, 4);
        configurarMueble("TinyLiving_PowerTowerBookcase_47", 2, 0.1, -28, Math.PI /2, 4);
        configurarMueble("TinyLiving_NotATableEnd_43", 22.3, 0.1, -18, Math.PI / -2, 5);
        configurarMueble("TinyLiving_TheModernDeskLamp_23", 22.3, 3, -18, 0, 4)

        this.cargarObjeto("estufa.glb", 20.3, 3.5, 23.5, Math.PI / -2, 1.5);
        this.cargarObjeto("grifo.glb", 22, 4.52, 15.2, Math.PI / -2, 2);
        this.cargarObjeto("alacena.glb", 23.1, 0, -4, Math.PI/-2, 0.12)
        this.cargarObjeto("plantita.glb", 2, 0, -29, 0, 4)
        this.cargarObjeto("plantita2.glb", 2, 0, -18, 0, 4)
        this.cargarObjeto("alfombra.glb", -18, 0.1, -27, 0, 1)
        this.cargarObjeto("escritorio.glb", -26.2, 0, -22, 0, 0.004)
        this.cargarObjeto("cama.glb", -8, 0, -9, Math.PI, 4);

        this.crearCocina();
        this.crearBaño();

        const rootNode = resultado.meshes[0];

        rootNode.dispose();
    }

    async crearCocina() {
        const configurarItem = (padreBusqueda, nombre, x, y, z, rotY, escala) => {
            const item = padreBusqueda.getChildren().find(m => m.name === nombre);
            
            if (item) {
                item.setParent(null); 
                item.rotationQuaternion = null;
                item.position = new BABYLON.Vector3(x, y, z);
                item.rotation.y = rotY;
                item.scaling = new BABYLON.Vector3(escala, escala, escala);
            }
        };

        const resultadoCocina = await BABYLON.SceneLoader.ImportMeshAsync("", "../Assets/Models/", "CocinaPack.glb", this.scene);
        const rootCocina = resultadoCocina.meshes[0];
        
        const sketchfabCocina = rootCocina.getChildren().find(m => m.name === "Sketchfab_model");
        if (sketchfabCocina) {
            const colladaGroup = sketchfabCocina.getChildren().find(m => m.name === "Collada visual scene group");
            
            if (colladaGroup) {
                configurarItem(colladaGroup, "Heladera", 23, 0, 27, Math.PI / -2, 0.05);
                configurarItem(colladaGroup, "Mesada", 23, -0.1, 40.89, Math.PI / -2, 0.05);
            }
        }
        rootCocina.dispose();

        const resultadoComedor = await BABYLON.SceneLoader.ImportMeshAsync("", "../Assets/Models/", "comedor.glb", this.scene);
        const rootComedor = resultadoComedor.meshes[0];

        const sketchfabComedor = rootComedor.getChildren().find(m => m.name === "Sketchfab_model");
        if (sketchfabComedor) {
            const comedor = sketchfabComedor.getChildren().find(m => m.name === "9d6c630de2a14a3aa61d1f6e30350a58.fbx");
            
            if (comedor) {
                configurarItem(comedor, "RootNode", 12, 0, -4, 0, 4);
            }
        }
    }

    async crearBaño() {
        
        const resultado = await BABYLON.SceneLoader.ImportMeshAsync(
            "", 
            "../Assets/Models/", 
            "Ducha.glb",
            this.scene
        );

        const rootMesh = resultado.meshes[0];
        const sketchfabModel = rootMesh.getChildren().find(m => m.name === "Sketchfab_model");
        
        if (sketchfabModel) {
            const root = sketchfabModel.getChildren().find(m => m.name === "root");
            
            if (root) {
                const gltfNode = root.getChildren().find(m => m.name === "GLTF_SceneRootNode");

                if (gltfNode) {
                    const configurarItem = (nombre, x, y, z, rotX, rotY, rotZ, escala) => {
                        const item = gltfNode.getChildren().find(m => m.name === nombre);

                        if (item) {
                            item.setParent(null);
                            item.rotationQuaternion = null;
                            item.position = new BABYLON.Vector3(x, y, z);
                            item.rotation.x = rotX; 
                            item.rotation.y = rotY;
                            item.rotation.z = rotZ;
                            item.scaling = new BABYLON.Vector3(escala, escala, escala);
                        }
                    };
                    
                    configurarItem("Cube.025_5",  -22, 1.7, 13, 0, Math.PI / 2, 0, 6); // retrete
                    configurarItem("Cylinder.004_43", -20.5, 2.3, 15.1, 0, Math.PI / -2, Math.PI / 2, 8); // portaPapel 
                    configurarItem("Cube.033_9", -20.54, 3.58, 4.19, 0, Math.PI / 2, 0, 7);// MarcoPrincipal
                    configurarItem("Cube.041_17", -21, 5, 6, 0, Math.PI / 2, 0, 4.9);//Marco de los vidrios pequeño del lado norte
                    configurarItem("Cube.042_18", -21, 5, 6, 0, Math.PI / 2, 0, 5)// cristal del de lado izquierdo
                    configurarItem("Cube.039_15", -19.5, 5, 6, 0, Math.PI / 2, 0, 4.9)// marco grande lado izquirdo
                    configurarItem("Cube.040_16", -19.5, 5, 6, 0, Math.PI / 2, 0, 4.9)// cristal marco grande lado izquierdo
                    configurarItem("Cube.035_11", -18.4, 5, 1.5, 0, Math.PI, 0, 4.9)//Marco pequeño entrada
                    configurarItem("Cube.036_12", -18.4, 5, 1.5, 0, Math.PI, 0,  4.9)//Cristal pequeño entrada
                    configurarItem("Cube.037_13", -18.3, 5, 4.61, 0, Math.PI, 0,  4.9)//MRCO grande entrada
                    configurarItem("Cube.038_14", -18.3, 5, 4.6, 0, Math.PI, 0, 4.9)//Cristal grande entrada
                    configurarItem("Cube.029_6", -21.5, 0.1, 2, 0, 0, 0, 8)//coladera de la regadera
                    configurarItem("Cube.071_22", -21.5, 5, 0.66, Math.PI /2, 0, 0, 4.9) //regadera
                    configurarItem("Cylinder.003_42", -15, 6, 0.66, Math.PI / 2, Math.PI / 2, 0, 4.9)//Porta toallas 
                    configurarItem("Plane.012_53", -15, 4.5, 0.72, 0, 0, 0, 4.9)//Toalla
                    configurarItem("Cube.179_37", -8, 4, 11.5, 0, Math.PI / -2, 0, 4.9)//lavamanos
                    configurarItem("Plane.002_52", -7.3, 5.6, 11.5, 0, Math.PI / -2, 0, 4.9)// llave lavamanos
                    configurarItem("Cylinder.006_45", -7.2, 5.5, 12.2, Math.PI / 2, Math.PI / -2, 0, 4.9)//portavasos
                    configurarItem("Cylinder.016_49", -7.3, 5.5, 12.2, 0, 0, 0, 4.9)//vaso
                    configurarItem("Cylinder.015_48", -7.2, 5.5, 10.7, Math.PI / 2, Math.PI / -2, 0, 4.9) //porta jabon o algo asi
                    configurarItem("Cube.28720_38", -7.2, 7.5, 11.7, 0, Math.PI / -2, 0, 4.9) //espejo

                    const rootNode = resultado.meshes[0];
                    rootNode.dispose()
                }
            } 
        }
    }

    crearPisoHabitacion(nombreObjeto, nombreBaseTextura, ancho, largo, x, z, repeticion = 4) {
        
        const materialPiso = new BABYLON.PBRMaterial(nombreObjeto + "Mat", this.scene);
        materialPiso.metallic = 0; 
        materialPiso.roughness = 1;

        const rutaBase = "../Assets/mods/";
      
        materialPiso.albedoTexture = new BABYLON.Texture(`${rutaBase}${nombreBaseTextura}_color.jpg`, this.scene);
        materialPiso.bumpTexture = new BABYLON.Texture(`${rutaBase}${nombreBaseTextura}_normal.jpg`, this.scene);
        materialPiso.microSurfaceTexture = new BABYLON.Texture(`${rutaBase}${nombreBaseTextura}_rough.jpg`, this.scene);

        [materialPiso.albedoTexture, materialPiso.bumpTexture, materialPiso.microSurfaceTexture].forEach(tex => {
            tex.uScale = repeticion;
            tex.vScale = repeticion;
        });

        const piso = BABYLON.MeshBuilder.CreateGround(nombreObjeto, {width: ancho, height: largo}, this.scene);
        piso.material = materialPiso;
        piso.checkCollisions = true
        piso.position = new BABYLON.Vector3(x, 0.09, z);
    }

    decorarInteriores() {
        this.crearPisoHabitacion("pisoSala", "piso_maderaS", 24, 22, 12, -23);
        this.crearPisoHabitacion("pisoCocina", "piso_maderaC", 31, 46, 9.5, 11);
        this.crearPisoHabitacion("PisoCuarto", "piso_maderaH", 18, 34, -15, -17)
        this.crearPisoHabitacion("complementoCuarto", "piso_maderaH", 6, 22, -3, -23)
        this.crearPisoHabitacion("Baño", "piso_concretoB", 19, 16, -15.51, 8)

    }
}