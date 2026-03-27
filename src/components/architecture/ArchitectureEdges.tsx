import { memo } from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

/* ─── Animated data-flow edge (solid, with moving dot) ─── */
export const AnimatedEdge = memo(({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: 'hsl(72, 90%, 62%)', strokeWidth: 1.5, opacity: 0.3 }}
      />
      <circle r="3" fill="hsl(72, 90%, 62%)" opacity="0.9">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
})
AnimatedEdge.displayName = 'AnimatedEdge'

/* ─── Kafka async edge (red, dashed, moving dot) ─── */
export const KafkaEdge = memo(({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: 'hsl(0, 72%, 51%)',
          strokeWidth: 1.5,
          strokeDasharray: '6 4',
          opacity: 0.4,
        }}
      />
      <circle r="3" fill="hsl(0, 72%, 51%)" opacity="0.8">
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
})
KafkaEdge.displayName = 'KafkaEdge'

/* ─── Dashed utility edge (infra / config / observability) ─── */
export const DashedEdge = memo(({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: 'hsl(0, 0%, 30%)',
        strokeWidth: 1,
        strokeDasharray: '4 4',
        opacity: 0.5,
      }}
    />
  )
})
DashedEdge.displayName = 'DashedEdge'
