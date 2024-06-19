// CatLoader.js

import React from "react";
import "./catLoader.css"; // Archivo CSS para estilos

const CatLoader = () => {
  return (
    <>
      <div class="box">
        <div class="cat">
          <div class="cat__body"></div>
          <div class="cat__body"></div>
          <div class="cat__tail"></div>
          <div class="cat__head"></div>
        </div>
      </div>
    </>
  );
};

export default CatLoader;
