import React from 'react';

export default ({value, onClick}) => (
  <button className='restart' onClick={onClick}>
    {value}
  </button>
)
