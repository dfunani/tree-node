"use client"

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import styles from "@/components/canvas.module.css"
import MenuButton from '@/components/menu-button';
import MenuDropdown from '@/components/menu-dropdown';


const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [show, setShow] = useState(false);

  function toggleMenu() {
    setShow((prev: Boolean) => !prev)
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls className={styles.controls} />
        <Panel>
          <MenuButton show={show} toggleMenu={toggleMenu} />
          {show && <MenuDropdown />}
        </Panel>
        <MiniMap className={styles.controls} />
        <Background variant={BackgroundVariant.Dots} gap={15} size={2} />
      </ReactFlow>
    </div>
  );
}