import React from 'react';
import './loadingCat.sass'; // Ruta al archivo Sass

const LoadingCat = () => {
  return (
    <div className="loading-cat">
      <div className="cat-body"></div>
      <div className="cat-animation-mask"></div>
      <div className="cat-head">
        <div className="cat-face"></div>
        <div className="cat-ear"></div>
        <div className="cat-hand"></div>
        <div className="cat-eye"></div>
        <div className="cat-eye-light"></div>
        <div className="cat-mouth"></div>
        <div className="cat-beard left"></div>
        <div className="cat-beard right"></div>
      </div>
      <div className="cat-foot">
        <div className="cat-belly"></div>
        <div className="cat-leg"></div>
        <div className="cat-tail"></div>
      </div>
      <div>
        <div className='coin'></div>
      </div>
    </div>
  );
}

export default LoadingCat;
