/* eslint-disable react/no-unknown-property -- React Three Fiber material props */
import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

import { revealedTileKind } from '../../engine/visibility';
import { worldPosition, type Coord, type TileKind, type World } from '../../engine/world';

type GlyphKind = TileKind | 'depleted';

function drawGlyph(kind: GlyphKind): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = '#263941';
  ctx.fillStyle = '#263941';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const path = (...points: number[]) => {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let index = 2; index < points.length; index += 2) ctx.lineTo(points[index], points[index + 1]);
    ctx.stroke();
  };
  const circle = (x: number, y: number, radius: number) => {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
  };
  switch (kind) {
    case 'resource':
      path(64, 92, 63, 42); path(64, 70, 43, 55, 36, 41); path(64, 62, 82, 47, 89, 34);
      path(47, 72, 37, 62, 34, 49); path(77, 76, 87, 65, 92, 52);
      circle(62, 37, 6); circle(36, 39, 5); circle(90, 32, 5);
      break;
    case 'depleted':
      path(37, 86, 91, 41); path(40, 41, 88, 87); circle(64, 64, 31);
      break;
    case 'obstacle':
      path(28, 86, 53, 43, 66, 64, 75, 39, 101, 86, 28, 86);
      path(49, 51, 55, 68, 65, 72); path(81, 51, 75, 67); path(43, 79, 51, 70); path(78, 78, 84, 70);
      break;
    case 'danger':
      path(64, 31, 72, 53, 96, 46, 83, 67, 99, 84, 73, 79, 64, 99, 55, 79, 29, 84, 45, 67, 32, 46, 56, 53, 64, 31);
      circle(64, 65, 8);
      break;
    case 'base':
      path(37, 88, 37, 48, 64, 34, 91, 48, 91, 88, 37, 88);
      path(49, 88, 49, 61, 78, 61, 78, 88); path(64, 34, 64, 22); path(64, 22, 83, 26, 64, 31);
      break;
    case 'fuel':
      path(48, 88, 48, 47, 55, 40, 79, 40, 84, 47, 84, 88, 48, 88);
      path(49, 52, 83, 52); path(84, 52, 94, 58, 94, 81); path(59, 72, 72, 59, 69, 72, 75, 72, 62, 86, 65, 73);
      break;
    case 'repair':
      circle(64, 65, 31); path(64, 47, 64, 83); path(46, 65, 82, 65);
      path(64, 27, 64, 20); path(64, 103, 64, 110); path(26, 65, 19, 65); path(102, 65, 109, 65);
      break;
    case 'empty':
      path(37, 58, 48, 54); path(71, 47, 82, 49); path(55, 77, 66, 74); path(84, 83, 90, 80);
      break;
  }
  // A light second pass makes the icon feel like a corrected pencil drawing.
  ctx.globalAlpha = 0.22;
  path(33, 99, 92, 99);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function TileGlyphs({ world, current, explored, known, scanned, depleted, developer, selected }: {
  world: World; current: string; explored: string; known: string; scanned: string;
  depleted: string; developer: boolean; selected: Coord | null;
}) {
  const textures = useMemo(() => Object.fromEntries(
    (['resource', 'empty', 'obstacle', 'danger', 'base', 'fuel', 'repair', 'depleted'] as GlyphKind[])
      .map(kind => [kind, drawGlyph(kind)])
  ) as Record<GlyphKind, CanvasTexture>, []);
  useEffect(() => () => Object.values(textures).forEach(texture => texture.dispose()), [textures]);
  const currentSet = new Set(current.split('|'));
  const exploredSet = new Set(explored.split('|'));
  const knownSet = new Set(known.split('|') as Coord[]);
  const scannedSet = new Set(scanned.split('|') as Coord[]);
  const depletedSet = new Set(depleted.split('|') as Coord[]);
  return <>{Object.values(world).map(tile => {
    const visible = currentSet.has(tile.coord);
    const seen = visible || exploredSet.has(tile.coord);
    if (!seen) return null;
    const revealed = revealedTileKind(tile, knownSet, scannedSet, visible, developer);
    const kind: GlyphKind = depletedSet.has(tile.coord) ? 'depleted' : revealed === 'terrain' ? 'empty' : revealed;
    const [x, , z] = worldPosition(tile.coord);
    const height = tile.coord === selected ? 0.16 : tile.kind === 'obstacle' ? 0.24 : 0;
    const top = height + (tile.kind === 'obstacle' ? 0.24 : 0.06);
    return <mesh key={tile.coord} position={[x, top + 0.014, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.94, 0.94]} />
      <meshBasicMaterial map={textures[kind]} transparent opacity={visible ? 0.8 : 0.46} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
    </mesh>;
  })}</>;
}
