import { memo, useState, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { serviceDetails } from '../../data/architecture'

/* ─── Tooltip Card ─── */
function TooltipCard({ nodeId, x, y }: { nodeId: string; x: 'left' | 'right'; y: 'top' | 'bottom' }) {
  const details = serviceDetails[nodeId]
  if (!details) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className={`absolute z-50 w-64 border-2 border-primary bg-card p-4 font-mono text-xs
        ${x === 'right' ? 'left-full ml-3' : 'right-full mr-3'}
        ${y === 'bottom' ? 'top-0' : 'bottom-0'}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
      <p className="text-foreground/80 mb-3 leading-relaxed">{details.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {details.stack.map((tech) => (
          <span
            key={tech}
            className="border border-primary/40 text-primary px-2 py-0.5 text-[10px] uppercase tracking-wider"
          >
            {tech}
          </span>
        ))}
      </div>
      {details.port && (
        <div className="mt-2 text-muted-foreground text-[10px]">
          PORT: <span className="text-accent">{details.port}</span>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Base Node Wrapper ─── */
function BaseNode({
  id,
  label,
  sublabel,
  borderColor,
  iconChar,
  iconBg,
}: {
  id: string
  label: string
  sublabel: string
  borderColor: string
  iconChar: string
  iconBg: string
}) {
  const [hovered, setHovered] = useState(false)
  const onEnter = useCallback(() => setHovered(true), [])
  const onLeave = useCallback(() => setHovered(false), [])

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !border-none !w-1.5 !h-1.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !border-none !w-1.5 !h-1.5" />
      <Handle type="target" position={Position.Left} className="!bg-primary !border-none !w-1.5 !h-1.5" />
      <Handle type="source" position={Position.Right} className="!bg-primary !border-none !w-1.5 !h-1.5" />

      <div
        className="relative border-2 bg-card px-4 py-3 min-w-[120px] transition-all duration-150 cursor-pointer group"
        style={{ borderColor }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] transition-all duration-200 group-hover:h-[3px]" style={{ background: borderColor }} />

        <div className="flex items-center gap-2.5">
          <span
            className="flex-shrink-0 flex items-center justify-center w-7 h-7 font-mono text-[10px] font-bold border"
            style={{ borderColor, background: iconBg, color: borderColor }}
          >
            {iconChar}
          </span>
          <div className="min-w-0">
            <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wide truncate">
              {label}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider truncate">
              {sublabel}
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ boxShadow: `inset 0 0 20px ${borderColor}15, 0 0 15px ${borderColor}10` }}
        />
      </div>

      <AnimatePresence>
        {hovered && <TooltipCard nodeId={id} x="right" y="top" />}
      </AnimatePresence>
    </div>
  )
}

/* ─── Specific Node Types ─── */

export const EntryNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <div className="relative">
    <Handle type="source" position={Position.Bottom} className="!bg-primary !border-none !w-1.5 !h-1.5" />
    <div className="border-2 border-primary/60 bg-card px-5 py-3 font-mono">
      <div className="text-xs font-bold text-primary uppercase tracking-widest">{data.label}</div>
      <div className="text-[10px] text-muted-foreground">{data.sublabel}</div>
    </div>
  </div>
))
EntryNode.displayName = 'EntryNode'

export const GatewayNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <BaseNode id={id} label={data.label} sublabel={data.sublabel} borderColor="hsl(72, 90%, 62%)" iconChar="GW" iconBg="hsl(72, 90%, 62%, 0.1)" />
))
GatewayNode.displayName = 'GatewayNode'

export const ServiceNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <BaseNode id={id} label={data.label} sublabel={data.sublabel} borderColor="hsl(72, 90%, 62%)" iconChar="μS" iconBg="hsl(72, 90%, 62%, 0.08)" />
))
ServiceNode.displayName = 'ServiceNode'

export const InfraNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <BaseNode id={id} label={data.label} sublabel={data.sublabel} borderColor="hsl(0, 0%, 45%)" iconChar="IF" iconBg="hsl(0, 0%, 45%, 0.1)" />
))
InfraNode.displayName = 'InfraNode'

export const DbNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <BaseNode id={id} label={data.label} sublabel={data.sublabel} borderColor="hsl(200, 80%, 55%)" iconChar="DB" iconBg="hsl(200, 80%, 55%, 0.1)" />
))
DbNode.displayName = 'DbNode'

export const BrokerNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <BaseNode id={id} label={data.label} sublabel={data.sublabel} borderColor="hsl(0, 72%, 51%)" iconChar="MQ" iconBg="hsl(0, 72%, 51%, 0.1)" />
))
BrokerNode.displayName = 'BrokerNode'

export const ObserveNode = memo(({ id, data }: { id: string; data: { label: string; sublabel: string } }) => (
  <BaseNode id={id} label={data.label} sublabel={data.sublabel} borderColor="hsl(280, 70%, 55%)" iconChar="OB" iconBg="hsl(280, 70%, 55%, 0.1)" />
))
ObserveNode.displayName = 'ObserveNode'
