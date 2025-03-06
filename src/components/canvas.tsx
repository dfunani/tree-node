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
  NodeChange,
  OnNodesChange,
  EdgeChange,
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
type ResolveType = {
  text: string;
  status: "error" | "success";
};

export default function Canvas() {
  const { data: session } = useSession();

  const dispatch = useDispatch();
  const userState = useSelector((state: StateReducerType) => state.user);
  const editorState = useSelector((state: StateReducerType) => state.editor);
  const profileState = useSelector((state: StateReducerType) => state.profile);

  const [show, setShow] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const [resolve, setReolve] = useState<ResolveType | null>(null);
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

  const onNodesChange = useCallback(
    (changes: NodeChange<NodeType>[]) =>
      dispatch(
        editorUpdate({
          nodes: applyNodeChanges(changes, editorState.nodes ?? []),
          edges: editorState.edges ?? [],
        })
      ),
    [dispatch, editorState.nodes, editorState.edges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<EdgeType>[]) =>
      dispatch(
        editorUpdate({
          edges: applyEdgeChanges(changes, editorState.edges ?? []),
          nodes: editorState.nodes ?? [],
        })
      ),
    [dispatch, editorState.nodes, editorState.edges]
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
        setReolve({
          text: "Nodes/Edges Saved Successfully",
          status: "success",
        });
      } else {
        setReolve({
          text: "Couldn't Save Editor. Try Again Later.",
          status: "error",
        });
      }
    } catch (error) {
      setReolve({
        text: "Couldn't Save Editor. Try Again Later.",
        status: "error",
      });
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
        setReolve({
          text: "Nodes/Edges Saved Successfully",
          status: "success",
        });
      } else {
        setReolve({
          text: "Couldn't Delete Editor. Try Again Later.",
          status: "error",
        });
      }
    } catch (error) {
      setReolve({
        text: "Couldn't Delete Editor. Try Again Later.",
        status: "error",
      });
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
    const response = await fetch(`/api/auth/user?id=${id}`, { method: "GET" });
    const profile = await response.json();
    if (response.ok) {
      dispatch(profileUpdate(profile.message));
    } else {
      setReolve({
        text: "User Profile Failed to Load. Try Again Later.",
        status: "error",
      });
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
          {resolve && (
            <div className={`${styles["error"]} ${styles[resolve.status]}`}>
              <span className={styles["error-text"]}>{resolve.text}</span>
              <span
                className={styles["error-close"]}
                onClick={() => {
                  setReolve(null);
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
