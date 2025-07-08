'use client';

import styles from './LabelEditor.module.css';
import Editor from './Editor';

interface LabelEditorProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  required?: boolean;
}

export default function LabelEditor({
  label,
  required = false,
  name,
  value,
  onChange,
}: LabelEditorProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label_box}>
        <div className={styles.label_text}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </div>
      </label>
      <Editor
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}