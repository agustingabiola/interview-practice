import Tree from "./components/Tree";

const FileTreeDemo = () => {
  return (
    <>
      <h3>Empty File Tree</h3>
      <Tree fileTree={[]} />
      <h3>One file</h3>
      <Tree fileTree={[{ id: 1, name: "One File.txt", subNodes: null }]} />
      <h3>One Empty folder</h3>
      <Tree fileTree={[{ id: 1, name: "Folder One", subNodes: [] }]} />
      <h3>Nested Folders and Files</h3>
      <Tree
        fileTree={[
          { id: 1, name: "One File.txt", subNodes: null },
          {
            id: 2,
            name: "Folder One",
            subNodes: [
              { id: 3, name: "Nested File 1.txt", subNodes: null },
              {
                id: 4,
                name: "Nested Folder 1",
                subNodes: [
                  { id: 5, name: "Nested Nested File 1.txt", subNodes: null },
                  {
                    id: 4,
                    name: "Nested Nested Folder 1",
                    subNodes: [
                      {
                        id: 7,
                        name: "Nested Nested Nested File 1.txt",
                        subNodes: null,
                      },
                    ],
                  },
                ],
              },
              { id: 6, name: "Nested File 3.txt", subNodes: null },
            ],
          },
        ]}
      />
    </>
  );
};

export default FileTreeDemo;
