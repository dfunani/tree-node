import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { v4 as uuid4 } from "uuid";

import styles from "@/src/components/canvas.module.css";
import { EdgeType, NodeDataType, NodeType } from "@/src/public/types/editor";
import { StateReducerType } from "@/src/public/types/states";
import Modal from "@/src/components/modal";
import { UPDATE } from "@/lib/reducers/editor";

type Props = {
  id: string;
  data: NodeDataType;
  isConnectable: boolean | undefined;
};

export default function CanvasItem(props: Props) {
  const dispatch = useDispatch();

  const userState = useSelector((state: StateReducerType) => state.user);
  const editorState = useSelector((state: StateReducerType) => state.editor);

  const [clicked, setClicked] = useState(false);
  const [modal, setModal] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);
  console.log(outcome);

  async function saveNodes(nodes: NodeType[], edges: EdgeType[]) {
    try {
      const response = await fetch("/api/editor", {
        method: "POST",
        body: JSON.stringify({
          user_id: userState.id,
          nodes: nodes,
          edges: edges,
        }),
      });
      if (response.ok) {
        setOutcome("Nodes/Edges Saved Successfully.");
        dispatch(UPDATE({ nodes: nodes ?? [], edges: edges ?? [] }));
      } else {
        setOutcome("Couldn't Save Editor. Try Again Later.");
      }
    } catch {
      setOutcome("Couldn't Save Editor. Try Again Later.");
    }
  }

  async function deleteNodes(id: string) {
    const nodes = editorState.nodes?.filter(
      (value: NodeType) => value.id !== id
    );
    const edges = editorState.edges?.filter(
      (value: EdgeType) => value.source !== id && value.target !== id
    );
    saveNodes(nodes ?? [], edges ?? []);
    setClicked(false);
  }

  async function updateNodes(id: string, new_node: NodeType | {}) {
    const nodes = editorState.nodes?.map((node: NodeType) => {
      if (node.id === id) {
        return {
          ...node,
          data: { ...node.data, ...new_node },
        };
      }
      return node;
    });
    saveNodes(nodes ?? [], editorState.edges ?? []);
    setClicked(false);
  }

  function renderHandlers() {
    const positions = [
      Position.Top,
      Position.Bottom,
      Position.Left,
      Position.Right,
    ];
    const result = [];

    for (const position of positions) {
      result.push(
        <Handle
          key={uuid4()}
          type="source"
          id={`${position.toString()}-1`}
          position={position}
          isConnectable={props.isConnectable}
        />
      );
      result.push(
        <Handle
          key={uuid4()}
          type="target"
          id={`${position.toString()}-1`}
          position={position}
          isConnectable={props.isConnectable}
        />
      );
    }

    return result;
  }

  return (
    <div
      className={`${styles["node-item"]} ${clicked ? "" : styles["rounded"]}`}
      onClick={() => setClicked((prev: boolean) => !prev)}
    >
      {renderHandlers()}

      {!clicked && (
        <Image
          className={styles["node-img"]}
          src={props.data.image as string}
          alt={props.data.label}
          width={40}
          height={40}
        />
      )}

      {clicked && (
        <div className={styles["node-content"]}>
          <div
            className={styles["node-name"]}
          >{`${props.data.name} ${props.data.surname}`}</div>
          <div className={styles["node-location"]}>
            {`${props.data.city}`}, {`${props.data.country}`}
          </div>
          <div className={styles["node-dob"]}>{props.data.dob}</div>
          <div className={styles["node-buttons"]}>
            <button
              onClick={() => {
                setModal(true);
                setClicked(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                deleteNodes(props.id);
                setClicked(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash3"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-download"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {modal && (
        <Modal
          setClicked={setClicked}
          setModal={setModal}
          updateNodes={updateNodes}
          id={props.id}
        />
      )}
    </div>
  );
}
