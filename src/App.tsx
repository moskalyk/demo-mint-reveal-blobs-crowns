import { useState, useEffect } from 'react'
import './App.css'
import noise from './static_noise.gif'

let canvas: any;
let init: any;
let blob: any;
// let canMint: any;
let hasColor: any;

class Blob {
  points: any;
  _points: any;
  _radius: any;
  _position: any;
  _running: any;
  ctx: any;
  _color: any;
  _canvas: any;
  constructor() {
    this.points = [];
  }

  init() {
    for (let i = 0; i < this.numPoints; i++) {
      let point = new Point(this.divisional * (i + 1), this);
      // point.acceleration = -1 + Math.random() * 2;
      this.push(point);
    }
  }

  render() {
    let canvas = this.canvas;
    let ctx: any = this.ctx;
    // let position = this.position;
    let pointsArray: any = this.points;
    // let radius = this.radius;
    let points = this.numPoints;
    // let divisional = this.divisional;
    let center = this.center;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pointsArray[0].solveWith(pointsArray[points - 1], pointsArray[1]);

    let p0 = pointsArray[points - 1].position;
    let p1 = pointsArray[0].position;
    let _p2 = p1;

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

    for (let i = 1; i < points; i++) {

      pointsArray[i].solveWith(pointsArray[i - 1], pointsArray[i + 1] || pointsArray[0]);

      let p2 = pointsArray[i].position;
      var xc = (p1.x + p2.x) / 2;
      var yc = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      // ctx.lineTo(p2.x, p2.y);

      ctx.fillStyle = '#C0FFEE';
      // ctx.fillRect(p1.x-2.5, p1.y-2.5, 5, 5);

      p1 = p2;
    }

    var xc = (p1.x + _p2.x) / 2;
    var yc = (p1.y + _p2.y) / 2;
    ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
    // ctx.lineTo(_p2.x, _p2.y);

    // ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    // ctx.stroke();

    /*
        ctx.fillStyle = '#000000';
        if(this.mousePos) {
          let angle = Math.atan2(this.mousePos.y, this.mousePos.x) + Math.PI;
          ctx.fillRect(center.x + Math.cos(angle) * this.radius, center.y + Math.sin(angle) * this.radius, 5, 5);
        }
    */
    requestAnimationFrame(this.render.bind(this));
  }

  push(item: any) {
    if (item instanceof Point) {
      this.points.push(item);
    }
  }

  set color(value) {
    this._color = value;
  }
  get color() {
    return this._color || '#424242';
  }

  set canvas(value) {
    if (value instanceof HTMLElement && value.tagName.toLowerCase() === 'canvas') {
      this._canvas = canvas;
      this.ctx = this._canvas.getContext('2d');
    }
  }
  get canvas() {
    return this._canvas;
  }

  set numPoints(value) {
    if (value > 2) {
      this._points = value;
    }
  }
  get numPoints() {
    return this._points || 32;
  }

  set radius(value) {
    if (value > 0) {
      this._radius = value;
    }
  }
  get radius() {
    return this._radius || 150;
  }

  set position(value) {
    if (typeof value == 'object' && value.x && value.y) {
      this._position = value;
    }
  }
  get position() {
    return this._position || { x: 0.5, y: 0.5 };
  }

  get divisional() {
    return Math.PI * 2 / this.numPoints;
  }

  get center() {
    return { x: this.canvas.width * this.position.x, y: this.canvas.height * this.position.y };
  }

  set running(value) {
    this._running = value === true;
  }
  get running() : any{
    return this.running !== false;
  }}
class Point {
  parent: any;
  azimuth: any;
  _components: any;
  _acceleration: any;
  _speed: any;
  _radialEffect: any;
  _elasticity: any;
  _friction: any;
  constructor(azimuth: any, parent: any) {
    this.parent = parent;
    this.azimuth = Math.PI - azimuth;
    this._components = {
      x: Math.cos(this.azimuth),
      y: Math.sin(this.azimuth) };


    this.acceleration = -0.3 + Math.random() * 0.6;
  }

  solveWith(leftPoint: any, rightPoint: any) {
    this.acceleration = (-0.3 * this.radialEffect + (leftPoint.radialEffect - this.radialEffect) + (rightPoint.radialEffect - this.radialEffect)) * this.elasticity - this.speed * this.friction;
  }

  set acceleration(value) {
    if (typeof value == 'number') {
      this._acceleration = value;
      this.speed += this._acceleration * 2;
    }
  }
  get acceleration() {
    return this._acceleration || 0;
  }

  set speed(value) {
    if (typeof value == 'number') {
      this._speed = value;
      this.radialEffect += this._speed * 5;
    }
  }
  get speed() {
    return this._speed || 0;
  }

  set radialEffect(value) {
    if (typeof value == 'number') {
      this._radialEffect = value;
    }
  }
  get radialEffect() {
    return this._radialEffect || 0;
  }

  get position() {
    return {
      x: this.parent.center.x + this.components.x * (this.parent.radius + this.radialEffect),
      y: this.parent.center.y + this.components.y * (this.parent.radius + this.radialEffect) };

  }

  get components() {
    return this._components;
  }

  set elasticity(value) {
    if (typeof value === 'number') {
      this._elasticity = value;
    }
  }
  get elasticity() {
    return this._elasticity || 0.0002;
  }
  set friction(value) {
    if (typeof value === 'number') {
      this._friction = value;
    }
  }
  get friction() {
    return this._friction || 0.0085;
  }}
let count: any = 0;
function App() {
  const [canMint, setCanMint] = useState(false)
  const [showReveals, setShowReveals] = useState(false)
  // const [hasColor, setHasColor] = useState(false)
  init = function () {
    canvas = document.createElement('canvas');
    canvas.setAttribute('touch-action', 'none');
    canvas.id = 'canvas'
    document.getElementById('crowns')!.appendChild(canvas);
  
    let resize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  
    let oldMousePoint = { x: 0, y: 0 };
    let hover = false;
    let mouseMove = function (e: any) {
  
      let pos = blob.center;
      let diff = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      let dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      let angle = null;
  
      blob.mousePos = { x: pos.x - e.clientX, y: pos.y - e.clientY };
  
      if (dist < blob.radius && hover === false) {
        let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        angle = Math.atan2(vector.y, vector.x);
        hover = true;
        hasColor && setCanMint(true)
        // blob.color = '#77FF00';
      } else if (dist > blob.radius && hover === true) {
        let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        angle = Math.atan2(vector.y, vector.x);
        // hover = false;
        // blob.color = null;
      }
  
      if (typeof angle == 'number') {
  
        let nearestPoint: any = null;
        let distanceFromPoint = 10;
  
        blob.points.forEach((point: any) => {
          if (Math.abs(angle - point.azimuth) < distanceFromPoint) {
            // console.log(point.azimuth, angle, distanceFromPoint);
            nearestPoint = point;
            distanceFromPoint = Math.abs(angle - point.azimuth);
          }
  
        });
  
        if (nearestPoint) {
          let strength: any = { x: oldMousePoint.x - e.clientX, y: oldMousePoint.y - e.clientY };
          strength = Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;
          if (strength > 100) strength = 100;
          nearestPoint.acceleration = strength / 500 * (hover ? -1 : 1);
        }
      }
  
      oldMousePoint.x = e.clientX;
      oldMousePoint.y = e.clientY;
    };
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('pointermove', mouseMove);
  
    blob.canvas = canvas;
    blob.init();
    blob.render();
  };
  const [color, setColor] = useState('')
  useEffect(() => {
    if(count == 0){
      count++
      blob = new Blob();
      // setTimeout(() => {
      //   document.getElementById('canvas')?.remove()
      // blob = new Blob();
      // blob.color = 'blue'
      // init();

      // }, 2000)
      !showReveals && init();
    }

  }, [showReveals])

  const changeColor = (color: any) => {
    hasColor  = true
    blob = new Blob()
    blob.color = color
    setColor(color)
    document.getElementById('canvas')?.remove()
    init()
  }

  useEffect(() => {

  }, [color])

  const [items, setItems] = useState([])
  const [collectibles, _]: any = useState<any>([noise,noise,noise,noise,noise,noise,noise]);
  useEffect(() => {
    setItems(collectibles.map((item: any)=> {
      return <div className={`grid-item`} onClick={() => {
      }}>
        <>
        <img className='item' src={item}
        />
      </>
        </div>
    }))
  }, [])
  useEffect(() => {

  }, [items])
  
  return (
    <>
      {
        !showReveals ? <>
        <div style={{position: 'fixed', top: '30px', right: '10px', cursor: 'pointer'}}>
        <h1 onClick={() => setShowReveals(true)}>see reveals</h1>
      </div>
        <h1>metadata reveal: on supply</h1>
      <h1>fluid crowns ERC1155 edition</h1>
        <div id="crowns">
      </div>
      <div className='button-container'>
        <button onClick={() => changeColor('yellow')}>Hilighter Crown</button>
        <button onClick={() => changeColor('gold')}>Yellow Crown</button>
        <button onClick={() => changeColor('red')}>Red Crown</button>
        <button onClick={() => changeColor('orange')}>Orange Crown</button>
        <button onClick={() => changeColor('green')}>Green Crown</button>
        <button onClick={() => changeColor('aqua')}>Aqua Crown</button>
        <button onClick={() => changeColor('#B026FF')}>Purple Crown</button>
      </div>
      <br/>
      <br/></> : <>
      <div style={{position: 'fixed', top: '-23px', cursor: 'pointer', right: '10px'}}>
        <h1 onClick={() => {count = 0; setShowReveals(false)}}>see colors</h1>
      </div>
      <div className='grid-container'>
        {items}
      </div>
      </> }
      {canMint && <button style={{background: color, color: color == 'yellow' ? 'black' : 'white'}}>mint</button>}

    </>
  )
}

export default App
