import type * as Phaser from "phaser";
import type { Bullet, Chest, Gem, Particle } from "../sim/entities";
import { CHEST_SHAPES, GEM_SHAPES } from "./pickup-shapes";
import { fillBoxes, setFill, setStroke } from "./paint";
import { drawShapesAt } from "./shape-drawing";

const BULLET = {
  coreAlpha: 0.55,
  coreInset: 2,
  coreLength: 0.45,
  glowAlpha: 0.25,
  glowWidth: 3,
  laserAlpha: 0.9,
  laserTrail: 3.5,
  laserWidth: 3.5,
  lengthFactor: 0.58,
  minimumLength: 5,
  orbRadius: 6.5,
  thickness: 5,
};
const GEM = { fadeTicks: 90 };
const CHEST = {
  arrowAlpha: 0.8,
  arrowAlphaSwing: 0.2,
  arrowBob: 5,
  arrowHalfWidth: 5,
  arrowHeight: 7,
  arrowTop: -24,
  glowAlpha: 0.18,
  glowRadius: 28,
  pulseBase: 0.32,
  pulseSpeed: 0.1,
  pulseSwing: 0.28,
  sparkleAlpha: 0.3,
  sparkleAlphaSwing: 0.2,
  sparkleOrbit: 18,
  sparkleSize: 3,
  sparkleSpeed: 0.05,
  sparkleSwing: 4,
  sparkleWobble: 0.08,
  sparkles: 4,
};
const RING_WIDTH = 3.5;
const OPAQUE = 1;
const HALF = 0.5;
const DOUBLE = 2;
const STEP = 1;
const FULL_TURN = Math.PI * DOUBLE;
const GOLD = "#ffd700";

const drawLaser = (
  graphics: Phaser.GameObjects.Graphics,
  bullet: Bullet,
): void => {
  const tailX = bullet.x - bullet.velocity.x * BULLET.laserTrail;
  const tailY = bullet.y - bullet.velocity.y * BULLET.laserTrail;

  setStroke(
    graphics,
    { alpha: BULLET.glowAlpha, color: bullet.color },
    BULLET.laserWidth * bullet.area * BULLET.glowWidth,
  );
  graphics.lineBetween(bullet.x, bullet.y, tailX, tailY);
  setStroke(
    graphics,
    { alpha: BULLET.laserAlpha, color: bullet.color },
    BULLET.laserWidth * bullet.area,
  );
  graphics.lineBetween(bullet.x, bullet.y, tailX, tailY);
};

const drawSlug = (
  graphics: Phaser.GameObjects.Graphics,
  bullet: Bullet,
): void => {
  const length = Math.max(
    BULLET.minimumLength,
    Math.hypot(bullet.velocity.x, bullet.velocity.y) * BULLET.lengthFactor,
  );
  const thickness = BULLET.thickness * bullet.area;

  graphics.save();
  graphics.translateCanvas(bullet.x, bullet.y);
  graphics.rotateCanvas(Math.atan2(bullet.velocity.y, bullet.velocity.x));
  fillBoxes(graphics, { color: bullet.color }, [
    {
      height: thickness,
      width: length,
      x: -length * HALF,
      y: -thickness * HALF,
    },
  ]);
  fillBoxes(graphics, { alpha: BULLET.coreAlpha, color: "#ffffff" }, [
    {
      height: bullet.area * DOUBLE,
      width: length * BULLET.coreLength,
      x: -length * HALF + BULLET.coreInset,
      y: -bullet.area,
    },
  ]);
  graphics.restore();
};

/** Draws lasers as beams, orbs as circles and everything else as oriented slugs. */
export const drawBullets = (
  graphics: Phaser.GameObjects.Graphics,
  bullets: ReadonlyArray<Bullet>,
): void => {
  for (const bullet of bullets) {
    if (bullet.isLaser) {
      drawLaser(graphics, bullet);
    } else if (bullet.orbit === null && !bullet.isBlackHole) {
      drawSlug(graphics, bullet);
    } else {
      setFill(graphics, { color: bullet.color });
      graphics.fillCircle(bullet.x, bullet.y, BULLET.orbRadius * bullet.area);
    }
  }
};

/** Draws experience crystals that fade out before they vanish. */
export const drawGems = (
  graphics: Phaser.GameObjects.Graphics,
  gems: ReadonlyArray<Gem>,
): void => {
  for (const gem of gems) {
    drawShapesAt(graphics, GEM_SHAPES, {
      alpha: Math.min(OPAQUE, gem.life / GEM.fadeTicks),
      x: Math.floor(gem.x),
      y: Math.floor(gem.y),
    });
  }
};

const drawChestSparkles = (
  graphics: Phaser.GameObjects.Graphics,
  chest: Chest,
): void => {
  const pulse = Math.sin(chest.animationTicks * CHEST.pulseSpeed);
  const arrowY = chest.y + CHEST.arrowTop + pulse * CHEST.arrowBob;

  setFill(graphics, {
    alpha: CHEST.arrowAlpha + pulse * CHEST.arrowAlphaSwing,
    color: GOLD,
  });
  graphics.fillTriangle(
    chest.x - CHEST.arrowHalfWidth,
    arrowY,
    chest.x + CHEST.arrowHalfWidth,
    arrowY,
    chest.x,
    arrowY + CHEST.arrowHeight,
  );

  for (let sparkle = 0; sparkle < CHEST.sparkles; sparkle += STEP) {
    const angle =
      (sparkle / CHEST.sparkles) * FULL_TURN +
      chest.animationTicks * CHEST.sparkleSpeed;
    const orbit =
      CHEST.sparkleOrbit +
      Math.sin(chest.animationTicks * CHEST.sparkleWobble + sparkle) *
        CHEST.sparkleSwing;
    const alpha =
      CHEST.sparkleAlpha +
      Math.sin(chest.animationTicks * CHEST.pulseSpeed + sparkle) *
        CHEST.sparkleAlphaSwing;

    fillBoxes(graphics, { alpha, color: GOLD }, [
      {
        height: CHEST.sparkleSize,
        width: CHEST.sparkleSize,
        x: Math.floor(chest.x + Math.cos(angle) * orbit) - STEP,
        y: Math.floor(chest.y + Math.sin(angle) * orbit) - STEP,
      },
    ]);
  }
};

/** Draws boss chests with a pulsing glow, a bobbing arrow and sparkles. */
export const drawChests = (
  graphics: Phaser.GameObjects.Graphics,
  chests: ReadonlyArray<Chest>,
): void => {
  for (const chest of chests) {
    const pulse =
      CHEST.pulseBase +
      Math.sin(chest.animationTicks * CHEST.pulseSpeed) * CHEST.pulseSwing;

    setFill(graphics, { alpha: pulse * CHEST.glowAlpha, color: GOLD });
    graphics.fillCircle(chest.x, chest.y, CHEST.glowRadius);
    drawShapesAt(graphics, CHEST_SHAPES, {
      alpha: OPAQUE,
      x: chest.x,
      y: chest.y,
    });
    drawChestSparkles(graphics, chest);
  }
};

/** Draws fading squares and expanding rings. */
export const drawParticles = (
  graphics: Phaser.GameObjects.Graphics,
  particles: ReadonlyArray<Particle>,
): void => {
  for (const particle of particles) {
    const alpha = particle.life / particle.maxLife;

    if (particle.isRing) {
      setStroke(graphics, { alpha, color: particle.color }, RING_WIDTH);
      graphics.strokeCircle(
        particle.x,
        particle.y,
        (OPAQUE - alpha) * particle.size * HALF,
      );
    } else {
      fillBoxes(graphics, { alpha, color: particle.color }, [
        {
          height: particle.size,
          width: particle.size,
          x: Math.floor(particle.x),
          y: Math.floor(particle.y),
        },
      ]);
    }
  }
};
