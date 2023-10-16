import React, { useCallback, useState } from "react";

import styles from "./Tree.styles.module.css";
import FolderIcon from "../icons/Folder";
import FileIcon from "../icons/File";

interface INode {
  id: number;
  name: string;
  subNodes: INode[] | null;
}

interface IProps {
  fileTree: INode[];
}

const Tree: React.FC<IProps> = ({ fileTree }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => setIsOpen((cur) => !cur), []);

  if (!fileTree.length) {
    return null;
  }

  return (
    <div className={styles.tree}>
      {fileTree.map((t) => {
        if (t.subNodes) {
          return (
            <div
              className={`${styles.folder} ${
                isOpen ? styles.open : styles.collapsed
              }`}
              key={t.id}
            >
              <div onClick={toggleIsOpen} className={styles.labelContainer}>
                <span className={styles.folderControl} />
                <FolderIcon />
                <span className={styles.name}>{t.name}</span>
              </div>
              {isOpen ? <Tree fileTree={t.subNodes} /> : null}
            </div>
          );
        }

        return (
          <div key={t.id} className={styles.labelContainer}>
            <FileIcon />
            <span className={`${styles.fileName} ${styles.name}`}>
              {t.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Tree;
