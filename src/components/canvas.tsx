"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  BackgroundVariant,
  Panel,
  Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { v4 as uuid4 } from "uuid";

import styles from "@/src/components/canvas.module.css";
import MenuButton from "@/src/components/menu-button";
import MenuDropdown from "@/src/components/menu-dropdown";
import MenuItem from "@/src/components/menu-item";
import { buildDate, generateImages } from "@/src/public/utils/factories";
import { EdgeType, NodeType, PositionType } from "@/src/public/types/editor";
import { StateReducerType } from "../public/types/states";
import { StaticImageData } from "next/image";
import CanvasItem from "@/src/components/canvas-item";
import SaveButton from "@/src/components/save-button";
import { useSession } from "next-auth/react";
import LogoutButton from "./logout-button";
import DeleteButton from "./delete-button";
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
  const userState = useSelector((state: StateReducerType) => state.user);
  const editorState = useSelector((state: StateReducerType) => state.editor);
  const profileState = useSelector((state: StateReducerType) => state.profile);

  const [nodes, setNodes] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType>([]);
  const [show, setShow] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const onConnect = useCallback(
    (params: Connection) => {
      const new_edge = addEdge(params, editorState.edges ?? []);
      dispatch(
        editorUpdate({
          edges: new_edge,
          nodes: editorState.nodes ?? [],
        })
      );
    },
    [dispatch, editorState.edges, editorState.nodes]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => dispatch(
      editorUpdate({
        nodes: applyNodeChanges(changes, editorState.nodes ?? []),
      })
    ),
    [dispatch, editorState.nodes],
  );

  if (!session || !session.user) {
    return <Error statusCode={403} />;
  }

  function toggleMenu() {
    setShow((prev: boolean) => !prev);
  }
  function toggleProfile() {
    setshowProfile((prev: boolean) => !prev);
  }

  function addNode(
    position: PositionType,
    src: StaticImageData | string | null
  ) {
    const id = uuid4().toString();
    const node: NodeType = {
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
      draggable: true
    };
    dispatch(
      editorUpdate({
        nodes: [...(editorState.nodes ?? []), node],
        edges: [...(editorState.edges ?? [])],
      })
    );
  }

  async function saveNodes() {
    console.log(editorState.edges?.length);
    try {
      const response = await fetch("/api/editor", {
        method: "POST",
        body: JSON.stringify({
          user_id: userState.id,
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

  async function deleteEditor(user_id: string | null) {
    try {
      const response = await fetch("/api/editor", {
        method: "DELETE",
        body: JSON.stringify({
          user_id: user_id,
        }),
      });
      if (response.ok) {
        setSuccess(true);
        setError("Nodes/Edges Deleted Successfully");
      } else {
        setError("Couldn't Delete Editor. Try Again Later.");
      }
    } catch (error) {
      setError("Couldn't Delete Editor. Try Again Later.");
    }
  }

  function getMenuItems() {
    const images = generateImages(theme);

    const result = [];
    for (const image in images) {
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
    const response = await fetch(`/api/editor?id=${id}`, { method: "GET" });
    const data = await response.json();
    if (response.ok) {
      dispatch(
        editorUpdate({
          nodes: data.message.data.nodes,
          edges: data.message.data.edges,
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
    const response = await fetch(`/api/auth/user?id=${id}`, { method: "GET" });
    const profile = await response.json();
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

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) setTheme("dark");
    else setTheme("light");
  }, [dispatch, editorState, profileState, session.user, userState.id]);

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
              <DeleteButton id={userState.id} delete={deleteEditor} />
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
