import React from 'react';
import { TimelineLite, CSSPlugin, Circ, Back } from 'gsap';

// eslint-disable-next-line no-unused-vars
const myPlugins = [CSSPlugin];

class Attraction extends React.Component {
  constructor(props) {
    super(props);
    this.gsapELement = React.createRef();
    this.innerCircleTween = React.createRef();
    this.outerCircleTween = React.createRef();
    this.circleTextTween = React.createRef();
    this.attractAnimation = new TimelineLite({ paused: true });
  }

  componentDidMount() {
    this.attractAnimation
      .delay(0.8)
      .fromTo(
        this.innerCircleTween,
        0.5,
        { scale: 0.1, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          transformOrigin: '40 40',
          ease: Back.easeOut.config(3),
        },
      )
      // .fromTo(
      //   this.circleTextTween,
      //   0.5,
      //   { scale: 1.5, autoAlpha: 0 },
      //   { scale: 1, autoAlpha: 1, transformOrigin: '0 0', ease: Circ.easeOut },
      // )
      .fromTo(this.gsapELement, 1.6, { x: 1000, y: 10 }, { x: 0, ease: Circ.easeOut })
      // .to(this.gsapELement, 0.5, { y: 100, rotation: 90 })
      .play();
  }

  render() {
    const outerStyle = {
      fill: 'none',
      stroke: '#f2a900',
      strokeWidth: '1px',
      strokeMiterlimit: '1.5',
      strokeDasharray: '1, 2',
    };

    const thisText1 = `What you need`;
    const thisText2 = `to know`;

    return (
      <>
        <div
          className="attraction"
          ref={elem => {
            this.gsapELement = elem;
          }}
        >
          This is a line of text
        </div>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 144 144"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlSpace="preserve"
        >
          {/* <g id="outer" transform="matrix(1.45537,0,0,1.45537,-26.9133,-23.8768)">
            <circle cx="67.964" cy="65.878" r="48.098" style={outerStyle} />
          </g> */}
          <g id="outer">
            <circle cx="72" cy="72" r="72" style={outerStyle} />
          </g>
          <defs>
            <path
              id="textPath1"
              d="M2,72C2,38.353 29.554,1.798 72,2C118.787,2.223 142.308,42.272 142,72C141.668,103.976 117.973,142 72,142C28.135,142 2,105.647 2,72Z"
              style={{ fill: 'none', stroke: 'red' }}
            />
            <path
              id="textPath2"
              d="M306 621.25c131.971 0 224.006-105.615 225.25-225.25 1.251-119.635-94.938-224.627-225.25-225.25C183.308 170.166 80.75 272.729 80.75 396S185.337 621.25 306 621.25z"
              style={{ fill: 'none', stroke: 'blue' }}
              transform="matrix(0 .23529 -.23529 0 165.174 0)"
            />
          </defs>
          <g
            ref={elem => {
              this.circleTextTween = elem;
            }}
            style={{ transformOrigin: 'center' }}
          >
            <text id="attractText1">
              <textPath xlinkHref="#textPath1">
                <tspan dy="1.4rem" dx="20">
                  {thisText1}
                </tspan>
              </textPath>
            </text>
            <text id="attractText2">
              <textPath xlinkHref="#textPath2">
                <tspan dy="0.5rem" dx="45">
                  {thisText2}
                </tspan>
              </textPath>
            </text>
          </g>
          <circle
            id="core"
            cx="72"
            cy="72"
            r="40"
            style={{ fill: 'rgb(242, 169, 0)', transformOrigin: 'center' }}
            ref={elem => {
              this.innerCircleTween = elem;
            }}
          />
        </svg>
      </>
    );
  }
}

export default Attraction;
