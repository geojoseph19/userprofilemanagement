import React from 'react'

const InfoCard = ({title,content}) => {
  return (
    <div>
         <React.Fragment>
                    <div ><h3>{title}</h3></div>
                    <hr />
                    <div >{content}</div>
                    <hr />
                  </React.Fragment>
    </div>
  )
}

export default InfoCard;