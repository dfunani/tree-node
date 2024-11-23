import { v4 } from "uuid";

export const MockPostData = {
  user_id: v4(),
  nodes: [
    {
      id: "a0ad6eb1-68e9-45f3-a8e8-cd3c684b9951",
      position: {
        x: 789,
        y: 363,
      },
      type: "Canvas-Item",
      data: {
        fullName: ["John", "Doe"],
        location: ["Cape Town", "South Africa"],
        dob: "2024-11-21T11:15:16.165Z",
        image: {
          src: "/_next/static/media/female-dark-1.853360a4.png",
          height: 200,
          width: 150,
          blurDataURL:
            "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffemale-dark-1.853360a4.png&w=6&q=70",
          blurWidth: 6,
          blurHeight: 8,
        },
        label: "Canvas-Node",
      },
      measured: {
        width: 350,
        height: 212,
      },
    },
    {
      id: "67103441-b995-4d32-89bb-89e26101b4b8",
      position: {
        x: 394,
        y: 149,
      },
      type: "Canvas-Item",
      data: {
        fullName: ["John", "Doe"],
        location: ["Cape Town", "South Africa"],
        dob: "2024-11-21T11:15:17.414Z",
        image: {
          src: "/_next/static/media/female-dark-1.853360a4.png",
          height: 200,
          width: 150,
          blurDataURL:
            "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffemale-dark-1.853360a4.png&w=6&q=70",
          blurWidth: 6,
          blurHeight: 8,
        },
        label: "Canvas-Node",
      },
      measured: {
        width: 350,
        height: 212,
      },
      selected: true,
    },
    {
      id: "1a8d4fb9-9f1b-427a-996d-3c7adf09538e",
      position: {
        x: 1333,
        y: 741,
      },
      type: "Canvas-Item",
      data: {
        fullName: ["John", "Doe"],
        location: ["Cape Town", "South Africa"],
        dob: "2024-11-21T11:15:18.462Z",
        image: {
          src: "/_next/static/media/male-dark-1.c8f19d21.png",
          height: 200,
          width: 150,
          blurDataURL:
            "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmale-dark-1.c8f19d21.png&w=6&q=70",
          blurWidth: 6,
          blurHeight: 8,
        },
        label: "Canvas-Node",
      },
      measured: {
        width: 350,
        height: 212,
      },
    },
    {
      id: "d8b9495a-cf19-4b8f-a84d-8eb7ce1d351e",
      position: {
        x: 389,
        y: 432,
      },
      type: "Canvas-Item",
      data: {
        fullName: ["John", "Doe"],
        location: ["Cape Town", "South Africa"],
        dob: "Thu, 21 Nov 2024",
        image: {
          src: "/_next/static/media/female-dark-1.853360a4.png",
          height: 200,
          width: 150,
          blurDataURL:
            "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffemale-dark-1.853360a4.png&w=6&q=70",
          blurWidth: 6,
          blurHeight: 8,
        },
        label: "Canvas-Node",
      },
      measured: {
        width: 334,
        height: 212,
      },
    },
    {
      id: "4fc9845b-af4e-4b56-bfbe-b7bbe092b243",
      position: {
        x: 1135,
        y: 158,
      },
      type: "Canvas-Item",
      data: {
        fullName: ["John", "Doe"],
        location: ["Cape Town", "South Africa"],
        dob: "Thu, 21 Nov 2024",
        image: {
          src: "/_next/static/media/female-dark-1.853360a4.png",
          height: 200,
          width: 150,
          blurDataURL:
            "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffemale-dark-1.853360a4.png&w=6&q=70",
          blurWidth: 6,
          blurHeight: 8,
        },
        label: "Canvas-Node",
      },
      measured: {
        width: 334,
        height: 212,
      },
    },
  ],
  edges: [
    {
      source: "d8b9495a-cf19-4b8f-a84d-8eb7ce1d351e",
      sourceHandle: "top-1",
      target: "67103441-b995-4d32-89bb-89e26101b4b8",
      targetHandle: "top-1",
      id: "xy-edge__d8b9495a-cf19-4b8f-a84d-8eb7ce1d351etop-1-67103441-b995-4d32-89bb-89e26101b4b8top-1",
    },
    {
      source: "a0ad6eb1-68e9-45f3-a8e8-cd3c684b9951",
      sourceHandle: "left-1",
      target: "67103441-b995-4d32-89bb-89e26101b4b8",
      targetHandle: "right-1",
      id: "xy-edge__a0ad6eb1-68e9-45f3-a8e8-cd3c684b9951left-1-67103441-b995-4d32-89bb-89e26101b4b8right-1",
    },
    {
      source: "4fc9845b-af4e-4b56-bfbe-b7bbe092b243",
      sourceHandle: "left-1",
      target: "a0ad6eb1-68e9-45f3-a8e8-cd3c684b9951",
      targetHandle: "top-1",
      id: "xy-edge__4fc9845b-af4e-4b56-bfbe-b7bbe092b243left-1-a0ad6eb1-68e9-45f3-a8e8-cd3c684b9951top-1",
    },
  ],
};
