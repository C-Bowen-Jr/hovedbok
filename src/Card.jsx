import { useState } from 'react'
import './App.css'

function Card() {

  return (
    <div className="card">
      <div className="header">
        <div className="img"></div>
        <div className="details">
            <span className="name"></span>
            <span className="about"></span>
        </div>
      </div>
      <div className="description">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </div>
      <div className="btns">
        <div className="btn bt-1"></div>
        <div className="btn bt-2"></div>
      </div>
    </div>
  )
}

export default Card