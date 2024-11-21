"use client";

import React, { useCallback, useState } from "react";
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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { v4 as uuid4 } from "uuid";

import styles from "@/src/components/canvas.module.css";
import MenuButton from "@/src/components/menu-button";
import MenuDropdown from "@/src/components/menu-dropdown";
import MenuItem from "@/src/components/menu-item";
import { generateImages } from "@/public/utils/factories";
import { Nodes, Position } from "@/public/utils/types";
import { StaticImageData } from "next/image";
import CanvasItem from "@/src/components/canvas-item";



const NodeComponents = {
  "Canvas-Item": CanvasItem
}

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [show, setShow] = useState(false);

  function toggleMenu() {
    setShow((prev: Boolean) => !prev);
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function addNode(position: Position, src: StaticImageData | string) {
    setNodes((nodes: Nodes[]) => {
      let id = uuid4().toString()
      let node: Nodes = {
        id: id,
        position: position,
        type: "Canvas-Item",
        data: {
          fullName: ["John", "Doe"],
          location: ["Cape Town", "South Africa"],
          dob: new Date(),
          image: src,
          label: "Canvas-Node"
        }
      }
      return [...nodes, node];
    });
  }

  function getMenuItems() {
    let images = generateImages("dark");
    let result = [];
    for (let image in images) {
      result.push(
        <MenuItem
          key={uuid4()}
          src={images[image]}
          label={image}
          onDragItem={addNode}
        />
      );
    }
    return result;
  }

  return (
    <div className={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeComponents}
      >
        <Controls className={styles.controls} />
        <Panel>
          <MenuButton show={show} toggleMenu={toggleMenu} />
          {show && <MenuDropdown>{getMenuItems()}</MenuDropdown>}
        </Panel>
        <MiniMap className={styles.controls} />
        <Background variant={BackgroundVariant.Dots} gap={15} size={2} />
      </ReactFlow>
    </div>
  );
}
