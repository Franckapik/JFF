import RAPIER from '@dimforge/rapier3d-compat';

import { BOT_IDS, worldPosition, type BotId, type Coord, type World } from './world';

export type PlaygroundShape = 'block' | 'ball';
export interface PhysicsBotPose { x: number; y: number; z: number; heading: number }

export interface PlaygroundBody {
  id: number;
  shape: PlaygroundShape;
  purpose: 'tower' | 'route' | 'projectile';
  color: string;
  active: boolean;
  body: RAPIER.RigidBody;
  colliderHandle?: number;
  size: [number, number, number];
}

const BLOCK_COLORS = ['#e9ad68', '#d97857', '#f2cf8b', '#7bb6a8', '#d99c74', '#edbf78'];
const BLOCK_SIZE: [number, number, number] = [0.82, 0.32, 0.56];
const BALL_RADIUS = 0.26;
const FIXED_STEP = 1 / 60;
let rapierReady: Promise<void> | null = null;

export class PhysicsPlaygroundWorld {
  static async create(tiles: World, coord: Coord): Promise<PhysicsPlaygroundWorld> {
    rapierReady ??= RAPIER.init();
    await rapierReady;
    return new PhysicsPlaygroundWorld(tiles, coord);
  }

  readonly world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  private readonly events = new RAPIER.EventQueue(true);
  private bodies: PlaygroundBody[] = [];
  private nextId = 1;
  private remainder = 0;
  private site: Coord;
  private disposed = false;
  private readonly botBodies = new Map<BotId, RAPIER.RigidBody>();
  private readonly botColliders = new Map<number, BotId>();
  private readonly botActive = new Set<BotId>();
  private readonly routeColliders = new Set<number>();
  private readonly impacts: Record<BotId, number> = { 'bot-0': 0, 'bot-1': 0 };

  private constructor(tiles: World, coord: Coord) {
    this.world.timestep = FIXED_STEP;
    for (const tile of Object.values(tiles)) {
      const [x, , z] = worldPosition(tile.coord);
      const obstacle = tile.kind === 'obstacle';
      const halfHeight = obstacle ? 0.24 : 0.08;
      const centerY = obstacle ? 0.24 : -0.02;
      const floor = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, centerY, z));
      this.world.createCollider(RAPIER.ColliderDesc.cylinder(halfHeight, 0.98).setFriction(0.9), floor);
    }
    for (const id of BOT_IDS) {
      const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, -20, 0));
      const collider = this.world.createCollider(RAPIER.ColliderDesc.cuboid(0.38, 0.18, 0.52).setFriction(0.7), body);
      this.botBodies.set(id, body);
      this.botColliders.set(collider.handle, id);
    }
    this.site = coord;
    this.stack(coord, tiles);
  }

  get objects(): readonly PlaygroundBody[] { return this.bodies; }
  get coord(): Coord { return this.site; }
  get active(): boolean { return !this.disposed; }
  get impactCounts(): Readonly<Record<BotId, number>> { return this.impacts; }

  stack(coord: Coord, tiles: World): void {
    if (this.disposed || !tiles[coord]) return;
    this.clear();
    this.site = coord;
    const [x, , z] = worldPosition(coord);
    const floorTop = tiles[coord].kind === 'obstacle' ? 0.48 : 0.06;
    for (let index = 0; index < 6; index++) {
      const offset = index % 2 === 0 ? -0.025 : 0.025;
      const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x + offset, floorTop + BLOCK_SIZE[1] * (index + 0.5) + index * 0.018, z)
        .setRotation({ x: 0, y: Math.sin(index % 2 ? Math.PI / 4 : 0), z: 0, w: Math.cos(index % 2 ? Math.PI / 4 : 0) })
        .setLinearDamping(0.12).setAngularDamping(0.16));
      this.world.createCollider(RAPIER.ColliderDesc.cuboid(BLOCK_SIZE[0] / 2, BLOCK_SIZE[1] / 2, BLOCK_SIZE[2] / 2)
        .setDensity(2).setFriction(0.78).setRestitution(0.05), body);
      this.bodies.push({ id: this.nextId++, shape: 'block', purpose: 'tower', color: BLOCK_COLORS[index], active: true, body, size: BLOCK_SIZE });
    }
  }

  dropCrates(coord: Coord, tiles: World): void {
    if (this.disposed || !tiles[coord]) return;
    const [x, , z] = worldPosition(coord);
    const floorTop = tiles[coord].kind === 'obstacle' ? 0.48 : 0.06;
    const offsets = [[-0.34, -0.16], [0.28, -0.14], [0, 0.28]];
    for (const [dx, dz] of offsets) {
      const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x + dx, floorTop + 0.22, z + dz)
        .setLinearDamping(0.18).setAngularDamping(0.24));
      const collider = this.world.createCollider(RAPIER.ColliderDesc.cuboid(0.2, 0.18, 0.2)
        .setDensity(0.65).setFriction(0.72).setRestitution(0.18)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), body);
      this.routeColliders.add(collider.handle);
      this.bodies.push({ id: this.nextId++, shape: 'block', purpose: 'route', color: '#7bb6a8', active: true,
        body, colliderHandle: collider.handle, size: [0.4, 0.36, 0.4] });
    }
    const routeCrates = this.bodies.filter(item => item.purpose === 'route');
    for (const item of routeCrates.slice(0, Math.max(0, routeCrates.length - 18))) this.remove(item);
  }

  syncBot(id: BotId, pose: PhysicsBotPose | null): void {
    if (this.disposed) return;
    const body = this.botBodies.get(id)!;
    if (!pose) {
      if (this.botActive.delete(id)) body.setTranslation({ x: 0, y: -20, z: 0 }, true);
      return;
    }
    const position = { x: pose.x, y: pose.y, z: pose.z };
    const rotation = { x: 0, y: Math.sin(pose.heading / 2), z: 0, w: Math.cos(pose.heading / 2) };
    if (!this.botActive.has(id)) {
      body.setTranslation(position, true);
      body.setRotation(rotation, true);
      this.botActive.add(id);
    }
    body.setNextKinematicTranslation(position);
    body.setNextKinematicRotation(rotation);
  }

  launch(): void {
    if (this.disposed) return;
    const [x, , z] = worldPosition(this.site);
    const ball = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x - 3.2, 1.4, z - 0.35)
      .setLinvel(8.4, 0.1, 0.8)
      .setCcdEnabled(true).setLinearDamping(0.06));
    this.world.createCollider(RAPIER.ColliderDesc.ball(BALL_RADIUS)
      .setDensity(11).setFriction(0.48).setRestitution(0.56), ball);
    this.bodies.push({ id: this.nextId++, shape: 'ball', purpose: 'projectile', color: '#69cadd', active: true, body: ball,
      size: [BALL_RADIUS * 2, BALL_RADIUS * 2, BALL_RADIUS * 2] });
    const balls = this.bodies.filter(item => item.shape === 'ball');
    if (balls.length > 8) this.remove(balls[0]);
  }

  shockwave(): void {
    if (this.disposed) return;
    const [x, , z] = worldPosition(this.site);
    for (const item of this.bodies) {
      const position = item.body.translation();
      const dx = position.x - x + 0.15;
      const dz = position.z - z + 0.12;
      const distance = Math.hypot(dx, dz);
      if (distance > 4) continue;
      const strength = 4 / (1 + distance);
      item.body.applyImpulseAtPoint({ x: dx / distance * strength, y: 1.9, z: dz / distance * strength },
        { x: position.x, y: position.y + 0.12, z: position.z }, true);
    }
  }

  push(id: number, camera: { x: number; z: number }): void {
    if (this.disposed) return;
    const item = this.bodies.find(candidate => candidate.id === id);
    if (!item?.active) return;
    const position = item.body.translation();
    const dx = position.x - camera.x;
    const dz = position.z - camera.z;
    const length = Math.hypot(dx, dz) || 1;
    item.body.applyImpulseAtPoint({ x: dx / length * 1.7, y: 0.45, z: dz / length * 1.7 },
      { x: position.x, y: position.y + 0.12, z: position.z }, true);
  }

  step(delta: number): void {
    if (this.disposed) return;
    this.remainder = Math.min(this.remainder + Math.min(delta, 0.05), 0.1);
    while (this.remainder >= FIXED_STEP) {
      this.world.step(this.events);
      this.events.drainCollisionEvents((first, second, started) => {
        if (!started) return;
        const bot = this.botColliders.get(first) ?? this.botColliders.get(second);
        if (bot && (this.routeColliders.has(first) || this.routeColliders.has(second))) this.impacts[bot] += 1;
      });
      this.remainder -= FIXED_STEP;
    }
  }

  clear(): void {
    for (const item of this.bodies) {
      item.active = false;
      if (item.colliderHandle !== undefined) this.routeColliders.delete(item.colliderHandle);
      this.world.removeRigidBody(item.body);
    }
    this.bodies = [];
  }

  free(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const item of this.bodies) item.active = false;
    this.events.free();
    this.world.free();
  }

  private remove(item: PlaygroundBody): void {
    item.active = false;
    if (item.colliderHandle !== undefined) this.routeColliders.delete(item.colliderHandle);
    this.world.removeRigidBody(item.body);
    this.bodies = this.bodies.filter(candidate => candidate !== item);
  }
}
