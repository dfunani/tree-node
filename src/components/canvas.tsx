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
import { buildDate, generateImages } from "@/src/public/utils/factories";
import {
  Nodes,
  Position,
  Edges,
  Profile,
  StateReducer,
} from "@/src/public/utils/types";
import Image, { StaticImageData } from "next/image";
import CanvasItem from "@/src/components/canvas-item";
import SaveButton from "@/src/components/save-button";
import { signOut, useSession } from "next-auth/react";
import LogoutButton from "./logout-button";
import Error from "next/error";
import ProfilePicture from "./profile-picture";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE as userUpdate } from "@/lib/reducers/user";
import { UPDATE as profileUpdate } from "@/lib/reducers/profile";
import { UPDATE as editorUpdate } from "@/lib/reducers/editor";

const NodeComponents = {
  "Canvas-Item": CanvasItem,
};

export default function Canvas() {
  const { data: session } = useSession();

  const dispatch = useDispatch();
  const userState = useSelector((state: StateReducer) => state.user);
  const editorState = useSelector((state: StateReducer) => state.editor);
  const profileState = useSelector((state: StateReducer) => state.profile);

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [show, setShow] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!session || !session.user) {
    return <Error statusCode={403} />;
  }

  function toggleMenu() {
    setShow((prev: Boolean) => !prev);
  }
  function toggleProfile() {
    setshowProfile((prev: Boolean) => !prev);
  }

  const onConnect = useCallback(
    (params: any) => {
      dispatch(
        editorUpdate({
          edges: addEdge(params, editorState.edges ?? []),
          nodes: [...(editorState.nodes ?? [])],
        })
      );
    },
    [editorState]
  );

  function addNode(position: Position, src: StaticImageData | string) {
    let id = uuid4().toString();
    let node: Nodes = {
      id: id,
      position: position,
      type: "Canvas-Item",
      data: {
        name: "John",
        surname: "Doe",
        city: "Cape Town",
        country: "South Africa",
        dob: buildDate(new Date()),
        image: src,
        label: `Canvas-Node-${id}`,
      },
    };
    dispatch(
      editorUpdate({
        nodes: [...(editorState.nodes ?? []), node],
        edges: [...(editorState.edges ?? [])],
      })
    );
  }

  async function saveNodes() {
    try {
      let response = await fetch("/api/editor", {
        method: "POST",
        body: JSON.stringify({
          user_id: session?.user.id,
          nodes: editorState.nodes,
          edges: editorState.edges,
        }),
      });
      if (response.ok) {
        setSuccess(true);
        setError("Nodes/Edges Saved Successfully");
      } else {
        setError("Couldn't Save Editor. Try Again Later.");
      }
    } catch (error) {
      setError("Couldn't Save Editor. Try Again Later.");
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

  async function setEditor(id: string) {
    let response = await fetch(`/api/editor?id=${id}`, { method: "GET" });
    let data = await response.json();
    if (response.ok) {
      dispatch(
        editorUpdate({
          nodes: data.message.nodes,
          edges: data.message.edges,
        })
      );
    } else {
      dispatch(
        editorUpdate({
          nodes: [],
          edges: [],
        })
      );
    }
  }

  async function setProfile(id: string) {
    let response = await fetch(`/api/auth/user?id=${id}`, { method: "GET" });
    let profile = await response.json();
    if (response.ok) {
      dispatch(profileUpdate(profile.message.data));
    } else {
      setError("User Profile Failed to Load. Try Again Later.");
    }
  }

  useEffect(() => {
    if (session.user && session.user.id && session.user.email) {
      dispatch(userUpdate(session.user));
    }

    if (Object.values(profileState).every((state: unknown) => state === null)) {
      setProfile(session.user.id ?? userState.id);
    }

    if (Object.values(editorState).every((state: unknown) => state === null)) {
      setEditor(session.user.id ?? userState.id);
    }
  }, []);
  return (
    <div className={styles.canvas}>
      <ReactFlow
        nodes={editorState.nodes ?? []}
        edges={editorState.edges ?? []}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeComponents}
      >
        <Controls className={styles.controls} />
        <Panel>
          <ProfilePicture
            image={profileState?.image ?? ""}
            name={profileState?.name ?? ""}
            toggleMenu={toggleProfile}
          />
          {showProfile && (
            <MenuDropdown>
              <LogoutButton />
            </MenuDropdown>
          )}
          <MenuButton show={show} toggleMenu={toggleMenu} />
          {show && <MenuDropdown>{getMenuItems()}</MenuDropdown>}
          <SaveButton saveNodes={saveNodes} />
          {error && (
            <div
              className={`${styles["error"]} ${
                success ? styles["success"] : ""
              }`}
            >
              <span className={styles["error-text"]}>{error}</span>
              <span
                className={styles["error-close"]}
                onClick={() => {
                  setError(null);
                  setSuccess(false);
                }}
              >
                &times;
              </span>
            </div>
          )}
        </Panel>
        <MiniMap className={styles.controls} />
        <Background variant={BackgroundVariant.Dots} gap={15} size={2} />
      </ReactFlow>
    </div>
  );
}
