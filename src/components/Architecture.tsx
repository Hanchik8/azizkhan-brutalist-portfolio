import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion } from 'framer-motion'
import { architectureNodes, architectureEdges } from '../data/architecture'
import {
  EntryNode,
  GatewayNode,
  ServiceNode,
  InfraNode,
  DbNode,
  BrokerNode,
  ObserveNode,
} from './architecture/ArchitectureNodes'
import { AnimatedEdge, KafkaEdge, DashedEdge } from './architecture/ArchitectureEdges'

/* ─── Register custom types ─── */
const nodeTypes: NodeTypes = {
  entryNode: EntryNode,
  gatewayNode: GatewayNode,
  serviceNode: ServiceNode,
  infraNode: InfraNode,
  dbNode: DbNode,
  brokerNode: BrokerNode,
  observeNode: ObserveNode,
}

const edgeTypes: EdgeTypes = {
  animatedEdge: AnimatedEdge,
  kafkaEdge: KafkaEdge,
  dashedEdge: DashedEdge,
}

/* ─── Legend item ─── */
function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-6 h-0.5 flex-shrink-0"
        style={{
          background: color,
          borderTop: dashed ? `2px dashed ${color}` : 'none',
          height: dashed ? 0 : 2,
        }}
      />
      <span>{label}</span>
    </div>
  )
}

function LegendNode({ color, char, label }: { color: string; char: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-5 h-5 flex items-center justify-center border text-[8px] font-bold font-mono"
        style={{ borderColor: color, color }}
      >
        {char}
      </span>
      <span>{label}</span>
    </div>
  )
}

export default function Architecture() {
  const [nodes, , onNodesChange] = useNodesState(architectureNodes)
  const [edges, , onEdgesChange] = useEdgesState(architectureEdges)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const defaultViewport = useMemo(() => ({ x: 20, y: 20, zoom: 0.78 }), [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[100] bg-background'
    : 'relative border-2 border-border bg-card overflow-hidden'

  const graphHeight = isFullscreen ? '100vh' : '700px'

  return (
    <section id="architecture" aria-label="System Architecture" className="py-24 px-6 md:px-12 lg:px-20">
      {/* Section heading */}
      <div className="mb-12">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="font-mono text-sm tracking-widest text-primary uppercase block mb-3"
        >
          {'// 04'}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground"
        >
          ARCHITECTURE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 font-mono text-sm text-muted-foreground"
        >
          MegaSegaShop — Microservices System Design
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      {/* Graph Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={containerClass}
      >
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-10 border-2 border-border bg-card hover:border-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-150"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? '[ EXIT ]' : '[ EXPAND ]'}
        </button>

        <div style={{ height: graphHeight }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={defaultViewport}
            fitView={!isFullscreen}
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            panOnDrag={true}
            zoomOnScroll={true}
            className="architecture-flow"
          >
            <Background
              gap={40}
              size={1}
              color="hsl(0, 0%, 15%)"
            />
            <Controls
              showInteractive={false}
              className="architecture-controls"
            />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'gatewayNode':
                  case 'serviceNode': return 'hsl(72, 90%, 62%)'
                  case 'dbNode': return 'hsl(200, 80%, 55%)'
                  case 'brokerNode': return 'hsl(0, 72%, 51%)'
                  case 'observeNode': return 'hsl(280, 70%, 55%)'
                  default: return 'hsl(0, 0%, 30%)'
                }
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              style={{ background: 'hsl(0, 0%, 5%)' }}
              className="architecture-minimap"
            />
          </ReactFlow>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 border-2 border-border bg-card p-4 md:p-6"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          LEGEND
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[11px] text-muted-foreground">
          <div className="space-y-2">
            <div className="text-[9px] uppercase tracking-widest text-foreground/50 mb-1">Nodes</div>
            <LegendNode color="hsl(72, 90%, 62%)" char="GW" label="Gateway / Service" />
            <LegendNode color="hsl(200, 80%, 55%)" char="DB" label="Database" />
            <LegendNode color="hsl(0, 72%, 51%)" char="MQ" label="Message Broker" />
            <LegendNode color="hsl(280, 70%, 55%)" char="OB" label="Observability" />
          </div>
          <div className="space-y-2">
            <div className="text-[9px] uppercase tracking-widest text-foreground/50 mb-1">Edges</div>
            <LegendItem color="hsl(72, 90%, 62%)" label="HTTP / REST" />
            <LegendItem color="hsl(0, 72%, 51%)" label="Kafka Async" dashed />
            <LegendItem color="hsl(0, 0%, 30%)" label="Infra / Config" dashed />
          </div>
          <div className="col-span-2 md:col-span-2">
            <div className="text-[9px] uppercase tracking-widest text-foreground/50 mb-2">Controls</div>
            <div className="space-y-1 text-muted-foreground/70">
              <p>• Hover nodes for tech stack details</p>
              <p>• Drag nodes to rearrange layout</p>
              <p>• Scroll to zoom, drag canvas to pan</p>
              <p>• Click [EXPAND] for fullscreen view</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
