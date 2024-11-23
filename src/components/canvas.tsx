"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { buildDate, generateImages } from "@/public/utils/factories";
import { Nodes, Position, Edges } from "@/public/utils/types";
import { StaticImageData } from "next/image";
import CanvasItem from "@/src/components/canvas-item";
import SaveButton from "@/src/components/save-button";
import { signOut, useSession } from "next-auth/react";

const NodeComponents = {
  "Canvas-Item": CanvasItem
}

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [show, setShow] = useState(false);

  function toggleMenu() {
    setShow((prev: Boolean) => !prev);
  }

  const onConnect = useCallback(
    (params: any) => setEdges((eds: Edges[]) => addEdge(params, eds)),
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
          dob: buildDate(new Date()),
          image: src,
          label: `Canvas-Node-${nodes.length + 1}`
        }
      }
      return [...nodes, node];
    });
  }

  async function saveNodes() {
    try {
      let response = await fetch("/api", { method: "POST", body: JSON.stringify({ user_id: '9b1b7bdb-6ca5-40af-8e37-98bc8cee22eb', nodes: nodes, edges: edges }) })
      console.log(await response.json())
    } catch (error) {

    }
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

  useEffect(() => {
    let local_nodes = localStorage.getItem("nodes")
    let local_edges = localStorage.getItem("edges")
    if (local_nodes) {
      setNodes(JSON.parse(local_nodes))
    }
    if (local_edges) {
      setEdges(JSON.parse(local_edges))
    }

  }, [])

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes))
    localStorage.setItem("edges", JSON.stringify(edges))
  }, [nodes, edges])
  const {data: session, status} = useSession()
  return (
    <div className={styles.canvas} onClick={() => signOut()}>
      {JSON.stringify(session)}
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
          <SaveButton saveNodes={saveNodes} />
        </Panel>
        <MiniMap className={styles.controls} />
        <Background variant={BackgroundVariant.Dots} gap={15} size={2} />
      </ReactFlow>

    </div>
  );
}
