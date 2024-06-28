// CatLoader.js

import React from "react";
import "./catLoader.css"; // Archivo CSS para estilos
import CatImage from "../../assets/catLoader.png";

const CatLoader = () => {
  return (
    <div>
      <img src={CatImage} alt="loader" className="rotated-image" />
      <div className="loaderCoin"></div>
    </div>
  );
};

export default CatLoader;
