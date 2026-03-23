import { useEffect, useRef } from 'react'

// ── 定数 ────────────────────────────────────────────
const CANVAS_W = 700
const CANVAS_H = 500
const WANDER_STRENGTH = 0.35
const RETURN_NOISE = 0.15
const FOOD_DETECT_R = 14
const NEST_DETECT_R = 20

// フェロモン関連
const CELL_SIZE = 10
const GRID_W = Math.ceil(CANVAS_W / CELL_SIZE)
const GRID_H = Math.ceil(CANVAS_H / CELL_SIZE)
const EVAPORATION = 0.991
const DEPOSIT = 0.85

// センサー関連
const SENSOR_DIST = 20
const SENSOR_ANGLE = Math.PI / 5
const FOLLOW_PROB = 0.72

// ── 型定義 ──────────────────────────────────────────
type AntState = 'searching' | 'returning'

type Ant = {
  x: number
  y: number
  angle: number
  state: AntState
}

type Nest = { x: number; y: number; radius: number }
type Food = { x: number; y: number; radius: number }
type Grid = number[][]

// ── 初期化 ───────────────────────────────────────────
function createAnts(nest: Nest, count: number): Ant[] {
  return Array.from({ length: count }, () => ({
    x: nest.x,
    y: nest.y,
    angle: Math.random() * Math.PI * 2,
    state: 'searching' as AntState,
  }))
}

function createFoods(): Food[] {
  return [
    { x: 110, y: 90,  radius: 12 },
    { x: 590, y: 80,  radius: 12 },
    { x: 350, y: 420, radius: 12 },
  ]
}

function createGrid(): Grid {
  return Array.from({ length: GRID_H }, () => new Array(GRID_W).fill(0) as number[])
}

// ── フェロモン操作 ────────────────────────────────────
function depositPheromone(grid: Grid, ant: Ant): void {
  const col = Math.floor(ant.x / CELL_SIZE)
  const row = Math.floor(ant.y / CELL_SIZE)
  if (row >= 0 && row < GRID_H && col >= 0 && col < GRID_W) {
    grid[row][col] = Math.min(1.0, grid[row][col] + DEPOSIT)
  }
}

function evaporateGrid(grid: Grid): void {
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      grid[r][c] *= EVAPORATION
    }
  }
}

function samplePheromone(grid: Grid, x: number, y: number, angle: number): number {
  const col = Math.floor((x + Math.cos(angle) * SENSOR_DIST) / CELL_SIZE)
  const row = Math.floor((y + Math.sin(angle) * SENSOR_DIST) / CELL_SIZE)
  if (row < 0 || row >= GRID_H || col < 0 || col >= GRID_W) return 0
  return grid[row][col]
}

// ── アリ更新ロジック ─────────────────────────────────
function calcDist(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}

function updateAnt(ant: Ant, nest: Nest, foods: Food[], grid: Grid, speed: number): Ant {
  let angle = ant.angle
  let state = ant.state

  if (state === 'searching') {
    const pL = samplePheromone(grid, ant.x, ant.y, angle - SENSOR_ANGLE)
    const pC = samplePheromone(grid, ant.x, ant.y, angle)
    const pR = samplePheromone(grid, ant.x, ant.y, angle + SENSOR_ANGLE)
    const totalP = pL + pC + pR

    if (totalP > 0.08 && Math.random() < FOLLOW_PROB) {
      if (pC >= pL && pC >= pR) {
        angle += (Math.random() - 0.5) * WANDER_STRENGTH * 0.4
      } else if (pL > pR) {
        angle -= SENSOR_ANGLE * 0.6
      } else {
        angle += SENSOR_ANGLE * 0.6
      }
    } else {
      angle += (Math.random() - 0.5) * WANDER_STRENGTH
    }

    for (const food of foods) {
      if (calcDist(ant.x, ant.y, food.x, food.y) < FOOD_DETECT_R + food.radius) {
        state = 'returning'
        angle = Math.atan2(nest.y - ant.y, nest.x - ant.x)
        break
      }
    }
  } else {
    const targetAngle = Math.atan2(nest.y - ant.y, nest.x - ant.x)
    angle = targetAngle + (Math.random() - 0.5) * RETURN_NOISE
    if (calcDist(ant.x, ant.y, nest.x, nest.y) < NEST_DETECT_R) {
      state = 'searching'
      angle = Math.random() * Math.PI * 2
    }
  }

  let x = ant.x + Math.cos(angle) * speed
  let y = ant.y + Math.sin(angle) * speed

  if (x < 0 || x > CANVAS_W) {
    angle = Math.PI - angle
    x = Math.max(0, Math.min(CANVAS_W, x))
  }
  if (y < 0 || y > CANVAS_H) {
    angle = -angle
    y = Math.max(0, Math.min(CANVAS_H, y))
  }

  return { x, y, angle, state }
}

// ── 描画ヘルパー ─────────────────────────────────────
function drawPheromones(ctx: CanvasRenderingContext2D, grid: Grid): void {
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      const val = grid[r][c]
      if (val < 0.01) continue
      ctx.fillStyle = `rgba(90, 40, 0, ${(val * 0.5).toFixed(2)})`
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
  }
}

function drawNest(ctx: CanvasRenderingContext2D, nest: Nest) {
  ctx.beginPath()
  ctx.arc(nest.x, nest.y, nest.radius, 0, Math.PI * 2)
  ctx.fillStyle = '#6b3a1f'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(nest.x - 4, nest.y - 4, nest.radius * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#8b4513'
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 12px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('巣', nest.x, nest.y + nest.radius + 14)
}

function drawFood(ctx: CanvasRenderingContext2D, food: Food) {
  ctx.beginPath()
  ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2)
  ctx.fillStyle = '#2d7a2d'
  ctx.fill()
  ctx.strokeStyle = '#5fba5f'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(food.x - 3, food.y - 3, food.radius * 0.35, 0, Math.PI * 2)
  ctx.fillStyle = '#7fff7f'
  ctx.fill()
  ctx.fillStyle = '#cfc'
  ctx.font = '10px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('餌', food.x, food.y + food.radius + 12)
}

function drawAnt(ctx: CanvasRenderingContext2D, ant: Ant) {
  const bodyColor = ant.state === 'returning' ? '#cc2200' : '#111111'
  const headColor = ant.state === 'returning' ? '#991a00' : '#000000'
  ctx.save()
  ctx.translate(ant.x, ant.y)
  ctx.rotate(ant.angle)
  ctx.beginPath()
  ctx.ellipse(0, 0, 4, 2.5, 0, 0, Math.PI * 2)
  ctx.fillStyle = bodyColor
  ctx.fill()
  ctx.beginPath()
  ctx.arc(5, 0, 2, 0, Math.PI * 2)
  ctx.fillStyle = headColor
  ctx.fill()
  ctx.restore()
}

// ── Props ────────────────────────────────────────────
type Props = {
  antCount: number
  speed: number
}

// ── コンポーネント ───────────────────────────────────
export default function AntCanvas({ antCount, speed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const antsRef = useRef<Ant[]>([])
  const gridRef = useRef<Grid>([])
  const rafRef = useRef<number>(0)
  const speedRef = useRef(speed)
  const antCountRef = useRef(antCount)

  useEffect(() => {
    speedRef.current = speed
    antCountRef.current = antCount
  }, [speed, antCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const nest: Nest = { x: CANVAS_W / 2, y: CANVAS_H / 2, radius: 18 }
    const foods: Food[] = createFoods()

    antsRef.current = createAnts(nest, antCountRef.current)
    gridRef.current = createGrid()

    function tick() {
      const grid = gridRef.current
      const target = antCountRef.current
      if (antsRef.current.length > target) {
        antsRef.current = antsRef.current.slice(0, target)
      } else if (antsRef.current.length < target) {
        const add: Ant[] = Array.from(
          { length: target - antsRef.current.length },
          () => ({ x: nest.x, y: nest.y, angle: Math.random() * Math.PI * 2, state: 'searching' as AntState })
        )
        antsRef.current = [...antsRef.current, ...add]
      }

      ctx!.fillStyle = '#c8a96e'
      ctx!.fillRect(0, 0, CANVAS_W, CANVAS_H)

      evaporateGrid(grid)

      antsRef.current = antsRef.current.map((ant) => {
        const next = updateAnt(ant, nest, foods, grid, speedRef.current)
        if (next.state === 'returning') depositPheromone(grid, next)
        return next
      })

      drawPheromones(ctx!, grid)
      foods.forEach((f) => drawFood(ctx!, f))
      drawNest(ctx!, nest)
      antsRef.current.forEach((ant) => drawAnt(ctx!, ant))

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        border: '1px solid #333',
        borderRadius: 8,
        display: 'block',
        width: 'min(700px, calc(100vw - 32px))',
        height: 'auto',
      }}
    />
  )
}
