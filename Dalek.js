//Variables de modelado
var scene, renderer, camera, model;
var textures = ["https://raw.githubusercontent.com/lepablito/PAG-Dalek/main/textures/aluminio.txt",
                "https://raw.githubusercontent.com/lepablito/PAG-Dalek/main/textures/cyberium.txt",
                "https://raw.githubusercontent.com/lepablito/PAG-Dalek/main/textures/daleknium.txt",
                "https://raw.githubusercontent.com/lepablito/PAG-Dalek/main/textures/plastic.txt",
                "https://raw.githubusercontent.com/lepablito/PAG-Dalek/main/textures/copper.txt",
                "https://raw.githubusercontent.com/lepablito/PAG-Dalek/main/textures/metalrugoso.txt"];

//variables de controles
var controls;
var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_camera_left = false;
var key_camera_right = false;

/**
 * Funcion de inicio
 **/
function init() {

    //Event controlers
    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)
    //Escena
    scene = new THREE.Scene();
    //Camara
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    //Creamos el render con tamaño ajustado a la ventana
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //Suelo
    var planeGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, shininess:20, map: getTexture(textures[0])
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0,0,0);
    plane.rotation.x-=Math.PI/2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);

    //<<<----- MODELADO DEL ROBOT ----->>>
    model = new THREE.Object3D();
    scene.add(model);
    // Cabeza
    var headGroup = createHead();
    headGroup.position.set(0, 13, 0);

    // Cuerpo
    var bodyGroup = createBody();
    bodyGroup.position.set(0, 8, 0);

    // Pistola
    var gunGroup = createGun();
    gunGroup.position.set(-4.2, 9.5, -2);

    // usb-brazo
    var usbGroup = createUSB();
    usbGroup.position.set(-4, 8, 0);

    //Camara
    camera.position.set(-30, 30, 60);
    camera.lookAt(model.position);

    //Luz ambiente
    var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add(ambientLight);

    //Luz direccional sobre el centro de la plataforma
    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(0, 80, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    //Sombreado
    spotLight.shadow.mapSize.width = 5120; // default
    spotLight.shadow.mapSize.height = 5120; // default
    spotLight.shadow.camera.near = 0.1; // default
    spotLight.shadow.camera.far = 500; // default
    spotLight.shadow.camera.top = -100 // default
    spotLight.shadow.camera.right = 100 // default
    spotLight.shadow.camera.left = -100 // default
    spotLight.shadow.camera.bottom = 100 // default

    document.getElementById("container").appendChild(renderer.domElement);

    createControls();

    renderer.render(scene, camera);
}

/**
 * Funcion que crea toda la agrupación de la cabeza
 **/
function createHead(){
    var headGroup = new THREE.Object3D();
    headGroup.name = "head";
    model.add(headGroup);

    var sphereHead = new THREE.SphereGeometry(3.8, 20, 20);
    var sphereMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0.9,
        roughness: 0.5,
        map: getTexture(textures[4])

    });
    var head = new THREE.Mesh(sphereHead, sphereMaterial);
    head.castShadow = true;
    headGroup.add(head);

    //capsulas cabeza con luces
    var capsuleHead= new THREE.CylinderGeometry(0.2,0.2,2.6,8);
    var capsuleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd7d7d7,
    })

    var capsule1=new THREE.Mesh(capsuleHead, capsuleMaterial);
    capsule1.rotation.z += 0.9;
    capsule1.position.set(-3,3,0);
    headGroup.add(capsule1);

    var capsule2=new THREE.Mesh(capsuleHead, capsuleMaterial);
    capsule2.rotation.z -= 0.9;
    capsule2.position.set(3,3,0);
    headGroup.add(capsule2);

    var capsuleLight1= new THREE.PointLight(0xffffff,1);
    capsuleLight1.position.set(5,3,0);
    headGroup.add(capsuleLight1);

    var capsuleLight2= new THREE.PointLight(0xffffff,1);
    capsuleLight2.position.set(-5,3,0);
    headGroup.add(capsuleLight2);

    //soporte ojo
    var cubeHead= new THREE.BoxGeometry(3,2,2,20);
    var cubo=new THREE.Mesh(cubeHead, sphereMaterial);
    cubo.position.set(0,0,4);
    headGroup.add(cubo);

    //cilindro ojo
    var cilinderHead= new THREE.CylinderGeometry(0.5, 0.5,7,10);
    var cilinderMaterial= new THREE.MeshPhysicalMaterial({
        metalness:0.8,
        roughness: 0.8,
        map: getTexture(textures[1])
    });
    var cilinder=new THREE.Mesh(cilinderHead,cilinderMaterial);
    cilinder.position.set(0,0,4.5);
    cilinder.rotation.x += 1.6;
    headGroup.add(cilinder);

    // Ojo
    var eyeCylinder = new THREE.CylinderGeometry(0.5, 0.5,0.2,20);
    var eyeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0000FB,
        metalness: 0,
        roughness: 1,
        envMapIntensity: 0.9,
        transparent: true,
        opacity: 1,
        reflectivity: 0.2,
        map: getTexture(textures[3])
    });
    var eye = new THREE.Mesh(eyeCylinder, eyeMaterial);
    eye.position.set(0, 0, 8);
    eye.rotation.x += 1.6;
    headGroup.add(eye);

    //Luz en ojos
    var spotLightEye = new THREE.SpotLight(0x0000ff,1);
    spotLightEye.position.set(0, 0, 6.5);
    spotLightEye.target = eye;
    headGroup.add(spotLightEye);
    spotLightEye.castShadow = true;

    return headGroup;
}

/**
 * Crear cuerpo
 **/
function createBody(){
    var bodyGroup = new THREE.Object3D();
    bodyGroup.name = "body";
    model.add(bodyGroup);

    var bodyMaterial = new THREE.MeshBasicMaterial({
        color: 0xBDAC9A,
        metalness: 1,
        reflectivity: 0.8,
        map: getTexture(textures[2])
    });

    var middleBodyCylinder = new THREE.CylinderGeometry(3.8, 6, 12, 20);
    var middleBody = new THREE.Mesh(middleBodyCylinder, bodyMaterial);
    middleBody.castShadow = true;
    middleBody.position.set(0, -2,0);
    bodyGroup.add(middleBody);

    var cinturonBody1=new THREE.CylinderGeometry(5,5,1.5,20);
    var cinturonMaterial=new THREE.MeshPhysicalMaterial({
        roughness: 1,
        envMapIntensity: 0.9,
        map: getTexture(textures[3])
    });

    var cinturon1= new THREE.Mesh(cinturonBody1, cinturonMaterial);
    cinturon1.position.set(0,2,0);  
    bodyGroup.add(cinturon1);

    var cinturonBody2=new THREE.CylinderGeometry(6,6,1.7,20);
    var cinturon2= new THREE.Mesh(cinturonBody2, cinturonMaterial);
    cinturon2.position.set(0,-7.3,0);  
    bodyGroup.add(cinturon2);

    return bodyGroup;
}

/**
 * Funcion para crear pistola
 **/
function createGun(){
    var gunGroup = new THREE.Object3D();
    model.add(gunGroup);

    var gunGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    var gunMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0.5,
        map: getTexture(textures[5])
    });
    var gun= new THREE.Mesh(gunGeo, gunMaterial);
    gun.castShadow = true;
    gun.position.set(6, 1, 7); 
    gun.rotation.x += 1.6;
    gunGroup.add(gun);

    return gunGroup;
}

/**
 * Funcion para crear el brazo-usb
 */
function createUSB(){
    var usbGroup = new THREE.Object3D();
    model.add(usbGroup);

    var usbCylinder = new THREE.CylinderGeometry(0.2, 0.2, 3);
    var usbMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0.5,
        map: getTexture(textures[5])
    });
    
    var usb1= new THREE.Mesh(usbCylinder,usbMaterial);
    usb1.castShadow= true;
    usb1.position.set(1.2,2,5);
    usb1.rotation.x += 1.6;
    usbGroup.add(usb1);

    var usb2= new THREE.Mesh(usbCylinder,usbMaterial);
    usb2.castShadow= true;
    usb2.position.set(1.2,2.5,7.2);
    usb2.rotation.x += 1;
    usbGroup.add(usb2);

    var usbBall= new THREE.SphereGeometry(0.5,0.5,10);
    var usbBallMaterial= new THREE.MeshPhysicalMaterial({
        color: 0x000000
    });

    var ball1=new THREE.Mesh(usbBall,usbBallMaterial);
    ball1.castShadow=true;
    ball1.position.set(1.2,2,6.1);
    usbGroup.add(ball1);

    var ball2=new THREE.Mesh(usbBall,usbBallMaterial);
    ball2.castShadow=true;
    ball2.position.set(1.2,3,8.2);
    usbGroup.add(ball2);

    return usbGroup;
}

/**
 * Funcion para pasar la imagen alojada en github en formato base64 a imagen en forma de textura
 **/
function getTexture(url){
    var image = new Image();
    fetch(url).then(function(response) {
        return response.text().then(function(text){
            image.src = 'data:image/png;base64,'+text;
        })
    });
    var texture = new THREE.Texture();
    texture.image = image;
    image.onload = function() {
        texture.needsUpdate = true;
    };

    return texture;
}

/**
 * Controles camara
 **/
function createControls() {

    controls = new OrbitControls( camera, renderer.domElement );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.5;
    controls.keys = [ 65, 83, 68 ];

}

/**
 * Grados a radianes
 **/
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/**
 * Animar la imagen constantemente
 **/
function animate() {

    requestAnimationFrame( animate );
    controls.update();
    movementHandler();
    render();
}

/**
 * Controlador del movimiento del robot segun las teclas pulsadas
 **/
function movementHandler(){
    var head = scene.getObjectByName("head");
    if(key_left){
        model.rotation.y += 0.025
    }
    if(key_right){
        model.rotation.y -= 0.025
    }
    if(key_up){
        var direction = new THREE.Vector3();
        model.getWorldDirection(direction);
        model.position.add(direction.multiplyScalar(0.25));
    }
    if(key_down){
        var direction = new THREE.Vector3();
        model.getWorldDirection(direction);
        model.position.add(direction.multiplyScalar(-0.25));
    }
    if(key_camera_left){
        if(head.rotation.y < 1.5)
            head.rotation.y += 0.04
    }
    if(key_camera_right){
        if(head.rotation.y > -1.5)
            head.rotation.y -=0.04
    }
}

/**
 * Controlador que guarda la tecla que esta siendo pulsada
 **/
function handleKeyDown(event)
    {
        if (event.keyCode == 65) 
            key_left = true;
        else if (event.keyCode == 87)
            key_up = true;
        else if (event.keyCode == 83)
            key_down = true;
        else if (event.keyCode == 68)
            key_right = true;
        else if (event.keyCode == 81)
            key_camera_left = true;
        else if (event.keyCode == 69)
            key_camera_right = true;
    }
/**
 * Controlador que registra si la tecla ya no esta siendo pulsada
 **/
function handleKeyUp(event)
    {
        if (event.keyCode == 65) 
            key_left = false;
        else if (event.keyCode == 87)
            key_up = false;
        else if (event.keyCode == 83)
            key_down = false;
        else if (event.keyCode == 68)
            key_right = false;
        else if (event.keyCode == 81)
            key_camera_left = false;
        else if (event.keyCode == 69)
            key_camera_right = false;
    }

/**
 * Render de la escena
 **/
function render() {
    renderer.render( scene, camera );
}
