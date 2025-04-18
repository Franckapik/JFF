import * as YUKA from "yuka";

export class VehicleManager {
  constructor() {
    this.entityManager = new YUKA.EntityManager();
    this.vehicle = new YUKA.Vehicle();
    this.path = new YUKA.Path(); // Path for the vehicle
    this.path.loop = false; // Disable looping

    // Initialize the vehicle with a FollowPath behavior
    this.followPathBehavior = new YUKA.FollowPathBehavior(this.path);
    this.vehicle.steering.add(this.followPathBehavior);
    this.vehicle.maxSpeed = 0.05; // Set max speed
    this.entityManager.add(this.vehicle);
  }

  setPath(path) {
    // Validate points in the path
    const validPath = path.filter((point, index) => {
      if (index === 0) return true; // Always keep the first point
      const prevPoint = path[index - 1];
      const distance = point.distanceTo(prevPoint);
      if (distance > 10) {
        return false;
      }
      return true;
    });

    this.path.clear(); // Clear the existing path
    validPath.forEach((point) => {
      this.path.add(point); // Add new points to the path
    });
  }

  update(delta) {
    // Limit delta to avoid large updates
    const limitedDelta = Math.min(delta, 0.1); // Limit delta to 0.1 seconds
    if (this.path && this.path._waypoints.length > 0) {
      this.entityManager.update(limitedDelta);
    }
  }

  getVehiclePosition() {
    return this.vehicle.position;
  }

  clear() {
    this.entityManager.clear();
  }
}
