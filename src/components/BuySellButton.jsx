import React from 'react'

function BuySellButton() {
  return (
      <div className='mt-5 m-auto w-1/2 h-54  flex justify-center items-center z-10 '>
   
        <button className='btn btn-primary   mr-5 w-25 '>
          Buy
        </button>

        <button className='btn btn-primary  mr-5 w-25'> 
          Donate
        </button>
      
    </div>

  )
}

export default BuySellButton