//draw sphere at specified position of specified diameter
function createSphere(x, y, z, diam, scene) {
    // babylon built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: diam, segments: 32 }, scene);
    // Move the x, y, z position
    sphere.position = new BABYLON.Vector3(x, y, z);
    return sphere;
}

//draw box at specified position of specified length, width, depth
function createBox(x, y, z, w, h, d, scene) {
    // babylon built-in 'sphere' shape.
    var box = BABYLON.MeshBuilder.CreateBox("box", { height: h, width: w, depth: d }, scene);
    // Move the x, y, z position
    box.position = new BABYLON.Vector3(x, y, z);
    return box;
}

//create material from image file
function fileMat(file, scene) {
    //create material
    var mat = new BABYLON.StandardMaterial('material', scene);
    mat.diffuseTexture = new BABYLON.Texture(file, scene);
    return mat;
}

//create material from hex color
function hexMat(hex, scene) {
    var mat = new BABYLON.StandardMaterial('material', scene);
    mat.diffuseColor = BABYLON.Color3.FromHexString(hex, scene);
    return mat;
}

//recreates p5 lerpColor functionalith with babylon
function babLerpColor(c1, c2, lerp, scene) {
    //convert from hex if hashtag present in input
    if (c1.indexOf('#') == 0) {
        c1 = BABYLON.Color3.FromHexString(c1, scene);
    }
    if (c2.indexOf('#') == 0) {
        c2 = BABYLON.Color3.FromHexString(c2, scene);
    }
    let c = {};
    //interpolate r g and b  values
    for (let h of ['r', 'g', 'b']) {
        c[h] = c1[h] * lerp + c2[h] * (1 - lerp);
    }
    return new BABYLON.Color3(c.r, c.g, c.b);
}

class meshModel {
    //model constructor
    constructor(file, scale = 1, x = 0, y = 0, z = 0, name = "mesh", scene) {
        //gen position variable based on XYZ values
        var position = new BABYLON.Vector3(x, y, z);  
        this.position = position; 

        this.scale = scale; //scale based on user input
        this.name = name; //give mesh a name so it can be retrieved with getMeshes method
        //split file into file and folder variable to fit into Babylon native function
        var folder;
        if (file.lastIndexOf('/') >= 0) {
            folder = file.slice(0, file.lastIndexOf('/') + 1);
            file = file.slice(file.lastIndexOf('/') + 1)
        } else {
            folder = './'
        }
        //place and scale each mesh in model 
        let model = BABYLON.SceneLoader.ImportMesh(
            null,
            folder,
            file,
            scene,
            function (meshes) {
                for (const [i, mesh] of meshes.entries()) {
                    mesh.position = position;
                    mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
                    mesh.name = name + '-' + i;
                }
            }
        );
      
    }
    //assigns an array of this model's meshes to this.meshes and returns it
    //MUST BE EXECUTED IN scene.executeWhenReady(() => {})
    getMeshes(meshes) {
        this.meshes = meshes.filter(mesh => mesh.name.slice(0, this.name.length) == this.name);
        return this.meshes;
    } 

    //set x, y, and z rotation to values specified by
    rotate(x, y, z, scene) {
        var meshes = this.meshes;
        var mat = hexMat('#ff0000');
        meshes.map(m => m.rotation = new BABYLON.Vector3(x, y, z));
    }
}
