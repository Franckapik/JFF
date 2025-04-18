import * as YUKA from "yuka";

export class VehicleManager {
  constructor() {
    this.entityManager = new YUKA.EntityManager();
    this.vehicle = new YUKA.Vehicle();
    this.target = new YUKA.Vector3(); // Target position

    // Initialize the vehicle with a Seek behavior
    this.seekBehavior = new YUKA.SeekBehavior(this.target);
    this.vehicle.steering.add(this.seekBehavior);
    this.vehicle.maxSpeed = 0.001; // Set max speed for visible movement
    this.entityManager.add(this.vehicle);

    // Set an initial random target
    this.setRandomTarget();
  }

  setRandomTarget() {
    this.target.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5); // Random target within a 10x10 area
  }

  update(delta) {
    this.entityManager.update(delta);

    // Check if the vehicle is close to the target
    if (this.vehicle.position.distanceTo(this.target) < 0.2) {
      this.setRandomTarget(); // Set a new random target
    }
  }

  getVehiclePosition() {
    return this.vehicle.position;
  }

  clear() {
    this.entityManager.clear();
  }
}
