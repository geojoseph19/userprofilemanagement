import React from 'react';
import styles from './Modal.module.css'; // Assuming you have a CSS module for styling

const Modal = ({ isOpen, closeModal, content }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={closeModal}>Close</button>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default Modal;