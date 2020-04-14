export function newEgg(): void {

    const instance = new Entity()
    instance.addComponent(new GLTFShape("models/visitors/low_poly_car/low_poly_car.gltf"));
    instance.addComponent(new CarBehavior)
    instance.addComponentOrReplace(new Transform({
        position: new Vector3(-13, 1, 42),
        scale: new Vector3(0.02, 0.02, 0.02)
    }))

}