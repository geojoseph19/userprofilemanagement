import React from 'react'
import styles from './DisplayBoard.module.css'

const DisplayBoard = ({childComponent}) => {
  return (
    <div className={styles.userData}>
        {childComponent}
    </div>
  )
}

export default DisplayBoard;