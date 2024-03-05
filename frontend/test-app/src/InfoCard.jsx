import React from 'react'
import styles from './InfoCard.module.css'
const InfoCard = ({title,content}) => {
  return (
    <div className={styles.cardBody}>
         <React.Fragment>
                    <div ><h3>{title}</h3></div>
                    <hr />
                    <div >{content}</div>
                  </React.Fragment>
    </div>
  )
}

export default InfoCard;