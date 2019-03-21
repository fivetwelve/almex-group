import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { TimelineLite, CSSPlugin, Back, Circ, Elastic, Expo, Sine } from 'gsap';
import { DrawSVGPlugin } from '../utils/gsap/DrawSVGPlugin';

// eslint-disable-next-line no-unused-vars
const myPlugins = [CSSPlugin, DrawSVGPlugin];

class Attraction extends React.Component {
  constructor(props) {
    super(props);
    this.gsapELement = React.createRef();
    this.innerCircleTween = React.createRef();
    this.outerCircleTween = React.createRef();
    this.maskCircleTween = React.createRef();
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
          ease: Elastic.easeOut.config(2.5, 0.75),
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
          ease: Back.easeOut.config(1),
        },
        '-=0.5',
      )
      .from(this.circleTextTween, 0.5, {
        scale: 2,
        autoAlpha: 0,
        transformOrigin: '70 70',
        ease: Back.easeOut.config(1),
      })
      .to(this.circleTextTween, 1.2, { delay: 1.2, rotation: 360, ease: Expo.easeOut })
      .to(this.circleTextTween, 0.5, { autoAlpha: 0, ease: Circ.easeOut }, '-=1')
      .to(
        this.innerCircleTween,
        1,
        {
          scale: 0.11,
          autoAlpha: 0,
          ease: Back.easeOut.config(3),
        },
        '-=1.2',
      )
      .fromTo(
        this.maskCircleTween,
        0.8,
        { drawSVG: '0%' },
        { drawSVG: '100%', ease: Sine.easeIn },
        '-=1.4',
      )
      .staggerFromTo(
        this.textTweens,
        0.3,
        { x: 200, autoAlpha: 0 },
        { x: 10, autoAlpha: 1, ease: Circ.easeOut },
        1.2,
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

    const { attractText, locale, products } = this.props;

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
            <circle
              cx="72"
              cy="72"
              r="70"
              style={outerStyle}
              ref={elem => {
                this.outerCircleTween = elem;
              }}
            />
            <circle
              transform="rotate(-90 72,72)"
              r="70"
              cy="72"
              cx="72"
              strokeWidth="4px"
              stroke="#fff"
              fill="none"
              ref={elem => {
                this.maskCircleTween = elem;
              }}
            />
          </svg>
        </div>
        <div className="circular-text">
          <img
            src={`/img/circular-text-${locale}.svg`}
            alt={products.SHOULD_KNOW}
            width="144"
            height="144"
            ref={elem => {
              this.circleTextTween = elem;
            }}
          />
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
  locale: '',
  products: {},
};

Attraction.propTypes = {
  attractText: PropTypes.arrayOf(PropTypes.string),
  locale: PropTypes.string,
  products: PropTypes.shape({
    SHOULD_KNOW: PropTypes.string,
  }),
};

export default Attraction;
