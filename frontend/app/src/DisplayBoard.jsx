import React from 'react'

const DisplayBoard = ({childComponent}) => {
  return (
    <div className='userData'>
        {childComponent}
    </div>
  )
}

export default DisplayBoard;