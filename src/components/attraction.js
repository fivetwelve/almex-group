import React from 'react';
import PropTypes from 'prop-types';
import { TimelineLite, CSSPlugin, Back } from 'gsap';
import shortid from 'shortid';

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
    this.textTweens = [];
  }

  componentDidMount() {
    this.attractAnimation
      .delay(0.8)
      .fromTo(
        this.innerCircleTween,
        0.7,
        { scale: 0.1, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          transformOrigin: '40 40',
          // svgOrigin: '40 40',
          ease: Back.easeOut.config(3),
        },
      )
      .fromTo(
        this.outerCircleTween,
        0.5,
        { scale: 0.1, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          transformOrigin: '70 70',
          // svgOrigin: '40 40',
          ease: Back.easeOut.config(1),
        },
        '-=0.5',
      )
      .from(
        this.circleTextTween,
        0.5,
        { scale: 2, autoAlpha: 0, transformOrigin: '70 70', ease: Back.easeOut.config(1) },
        // { scale: 1, autoAlpha: 1, transformOrigin: '0 0', ease: Circ.easeOut },
      )
      // .fromTo(this.gsapELement, 1.6, { x: 1000, y: 10 }, { x: 0, ease: Circ.easeOut }, '+=1')
      .staggerFromTo(
        this.textTweens,
        0.8,
        { x: 200, autoAlpha: 0 },
        { x: 10, autoAlpha: 1, ease: Back.easeOut.config(1) },
        1,
      )
      .play();
  }

  render() {
    const outerStyle = {
      fill: 'none',
      stroke: '#f2a900',
      strokeWidth: '2px',
      strokeMiterlimit: '1.5',
      strokeDasharray: '1, 2',
      transformOrigin: 'center',
    };

    const thisText1 = `What you need`;
    const thisText2 = `to know`;

    const { attractText } = this.props;
    return (
      <>
        <div className="svg-container">
          <svg
            width="144px"
            height="144px"
            viewBox="0 0 144 144"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
          >
            {/* <g id="outer" transform="matrix(1.45537,0,0,1.45537,-26.9133,-23.8768)">
            <circle cx="67.964" cy="65.878" r="48.098" style={outerStyle} />
          </g> */}
            <circle
              cx="72"
              cy="72"
              r="70"
              style={outerStyle}
              ref={elem => {
                this.outerCircleTween = elem;
              }}
            />
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
              style={{ transformOrigin: 'center' }}
              ref={elem => {
                this.circleTextTween = elem;
              }}
            >
              <text id="attractText1" textLength="180">
                <textPath xlinkHref="#textPath1">
                  <tspan dy="20px" dx="20">
                    {thisText1}
                  </tspan>
                </textPath>
              </text>
              <text id="attractText2" textLength="80">
                <textPath xlinkHref="#textPath2">
                  <tspan dy="5px" dx="45">
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
        </div>
        <div className="text-container">
          <ul>
            {attractText.map((elem, idx) => (
              <li
                key={shortid.generate()}
                ref={li => {
                  this.textTweens[idx] = li;
                }}
              >
                {elem}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

Attraction.defaultProps = {
  attractText: [],
};

Attraction.propTypes = {
  attractText: PropTypes.arrayOf(PropTypes.string),
};

export default Attraction;
