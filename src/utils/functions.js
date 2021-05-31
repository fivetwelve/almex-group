import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { SOURCE_TYPE_NAMES } from '../constants';

const apiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost'
      ? 'http://localhost:8000/.netlify/functions'
      : `https://${window.location.hostname}/.netlify/functions`;
  }
  return false;
};

const countryFlag = countryCode => (
  <img className="flag" src={`/img/flag-${countryCode}.png`} alt="" />
);
const createLink = (location, slug) => {
  /*
    - Have established that URLs will always be formed as: /region/locale/slug/
    - No further hierarchy expected to pollute URLs or future link creation.
    - Slugs expected to be unique, coming from CMS.
    - location passed in expected to be the prop coming from @reach/router Location
    - accounts for when there is no slug (homepage) so url may end in /region/locale
      and no trailing slash
    - updated redirect rules may result in double-trailing slash, added extra step
      to clean it
  */
  const reg = /\/(.*?)\/\w+\//;
  const match = reg.exec(location.pathname);
  const linkPrefix = (match && match[0]) || `${location.pathname}/`;
  const newLink = `${linkPrefix}${slug}/`;
  /* strip extra trailing slash resulting from empty slug, indicating homepage link */
  return newLink.replace('//', '/');
};

const createLinkFromPage = (location, page, language) => {
  /* Given a page object with multiple slugs, return language-specific URL. */
  const slug = page[`slug${language.toUpperCase()}`] || page.slug || '';
  return createLink(location, slug);
};

const getSlug = pathname => {
  /*
    Get slug from pathname; do not include origin attribute.
    e.g. path = /northamerica/en/presses/, slug = presses
  */
  if (pathname === null) {
    return '';
  }
  const reg = /^(?:[^/]*\/){3}([^/]*)/;
  const slug = reg.exec(pathname)[1] || '';
  return slug;
};

const getTitle = page => {
  /*
    Get title from staticQuery from forms of titleEN, titleES, etc. or
    simply from page object when query is already language-filtered.
  */
  let title = '';
  switch (page.contentSource.sourceType) {
    case SOURCE_TYPE_NAMES.ABOUT:
      title = (page.about && page.about.title) || '';
      break;
    case SOURCE_TYPE_NAMES.CAREERS:
      title = (page.careers && page.careers.title) || '';
      break;
    case SOURCE_TYPE_NAMES.CONTACT:
      title = (page.contact && page.contact.title) || '';
      break;
    case SOURCE_TYPE_NAMES.EVENTS:
      title = (page.events && page.events.title) || '';
      break;
    case SOURCE_TYPE_NAMES.HISTORY:
      title = (page.history && page.history.title) || '';
      break;
    case SOURCE_TYPE_NAMES.INSTITUTE:
      title = (page.institute && page.institute.title) || '';
      break;
    case SOURCE_TYPE_NAMES.LANDING:
      title = (page.landing && page.landing.title) || '';
      break;
    case SOURCE_TYPE_NAMES.NEWS:
      title = (page.news && page.news.title) || '';
      break;
    case SOURCE_TYPE_NAMES.PRODUCT:
      title = (page.product && page.product.title) || '';
      break;
    case SOURCE_TYPE_NAMES.PROMO:
      title = (page.promo && page.promo.title) || '';
      break;
    case SOURCE_TYPE_NAMES.RESOURCES:
      title = (page.resources && page.resources.title) || '';
      break;
    case SOURCE_TYPE_NAMES.SERVICES:
      title = (page.services && page.services.title) || '';
      break;
    case SOURCE_TYPE_NAMES.SIMPLE:
      title = (page.simpleContent && page.simpleContent.title) || '';
      break;
    case SOURCE_TYPE_NAMES.USED:
      title = (page.usedEquipment && page.usedEquipment.title) || '';
      break;
    default:
      break;
  }
  return title;
};

const makeid = (length = 5) => {
  /* from https://stackoverflow.com/a/1349426 */
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Clone a date object.
 *
 * @export
 * @param  {Date} d The date to clone
 * @return {Date} The cloned date
 */
const clone = d => new Date(d.getTime());

/**
 * Return `true` if two dates are the same day, ignoring the time.
 *
 * @export
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
const isSameDay = (d1, d2) => {
  if (!d1 || !d2) {
    return false;
  }
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

/**
 * Returns `true` if the first day is before the second day.
 *
 * @export
 * @param {Date} d1
 * @param {Date} d2
 * @returns {Boolean}
 */

const isDayBefore = (d1, d2) => {
  const day1 = clone(d1).setHours(0, 0, 0, 0);
  const day2 = clone(d2).setHours(0, 0, 0, 0);
  return day1 < day2;
};

/**
 * Returns `true` if the first day is after the second day.
 *
 * @export
 * @param {Date} d1
 * @param {Date} d2
 * @returns {Boolean}
 */
const isDayAfter = (d1, d2) => {
  const day1 = clone(d1).setHours(0, 0, 0, 0);
  const day2 = clone(d2).setHours(0, 0, 0, 0);
  return day1 > day2;
};

/**
 * Return `true` if day `d` is between days `d1` and `d2`,
 * without including them.
 *
 * @export
 * @param  {Date}  d
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
const isDayBetween = (d, d1, d2) => {
  const date = clone(d);
  date.setHours(0, 0, 0, 0);
  return (
    (isDayAfter(date, d1) && isDayBefore(date, d2)) ||
    (isDayAfter(date, d2) && isDayBefore(date, d1))
  );
};

/**
 * Return `true` if a day is included in a range of days.
 *
 * @export
 * @param  {Date}     day
 * @param  {Object}   range
 * @return {Boolean}
 */
const isDayInRange = (day, range) => {
  const { from, to } = range;

  return (
    (from && isSameDay(day, from)) ||
    (to && isSameDay(day, to)) ||
    (from && to && isDayBetween(day, from, to))
  );
};

/**
 * Return `true` if the difference is greater than the gap.
 *
 * @export
 * @param  {Date}     dt1
 * @param  {Date}     dt1
 * @param  {Number}   gap
 * @return {Boolean}
 */
const daysPassed = (dt1, dt2, gap) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate());
  const utc2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY) > gap;
};

/**
 * Return `true` if the difference is greater than the gap.
 *
 * @export
 * @param  {Date}     dt1
 * @param  {Date}     dt1
 * @param  {Number}   gap
 * @return {Boolean}
 */
const hoursPassed = (dt1, dt2, gap) => {
  const MS_PER_HOUR = 1000 * 60 * 60;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), dt1.getHours());
  const utc2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(), dt2.getHours());

  return Math.floor((utc2 - utc1) / MS_PER_HOUR) > gap;
};

/**
 * @export
 * @param  {String}   countryCode
 * @param  {Array}    offices
 * @return {String}
 */
const mapToOffice = (countryCode, offices) => {
  // let supportOffice = null;
  // for (let i = 0; i < offices.length; i += 1) {
  //   if (offices[i].supportedCountryCodes.countries.includes(countryCode)) {
  //     supportOffice = countryCode;
  //     break;
  //   }
  // }
  // return supportOffice;
  return offices.filter(office => office.supportedCountryCodes.countries.includes(countryCode));
};

const matchMomentLocale = locale => {
  const thisLocale = locale.toLowerCase();
  let momentLocale = 'en';
  switch (thisLocale) {
    case 'en':
      break;
    case 'de':
      momentLocale = 'de';
      break;
    case 'es':
      momentLocale = 'es';
      break;
    case 'es_cl':
      momentLocale = 'es';
      break;
    case 'es_es':
      momentLocale = 'es';
      break;
    default:
      break;
  }
  return momentLocale;
};

/**
 * @export
 * @param  {String}  date
 * @return {String}
 */
const normalizeTimeZone = day => `${day}T00:00:00.Z`;

/* Thanks to James Doyle for this: https://gist.github.com/james2doyle/5694700 */
const requestAnimFrame = func => {
  if (typeof window !== 'undefined') {
    return (
      window.requestAnimationFrame(func) ||
      window.webkitRequestAnimationFrame(func) ||
      window.mozRequestAnimationFrame(func) ||
      (callback => {
        window.setTimeout(callback, 1000 / 60);
      })
    );
  }
  return false;
};

// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = (ti, b, c, d) => {
  let t = ti;
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t -= 1;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

// helper function for Markdown parser to add rel attribute and values to prevent indexing
const renderLink = (props, location) => {
  const { children, href } = props;
  let updateHref = href;
  // if location was not passed, then field is not meant to support local links, only regular URLs
  if (location) {
    if (
      href.indexOf('http:') < 0 &&
      href.indexOf('https:') < 0 &&
      href.indexOf('mailto:') < 0 &&
      href.indexOf('tel:') < 0
    ) {
      updateHref = createLink(location, href);
    }
  }

  return (
    <a href={updateHref} rel="noopener noreferrer nofollow noindex">
      {children}
    </a>
  );
};

renderLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  href: PropTypes.string.isRequired,
};

const scrollTo = (to, callback, duration) => {
  // because it's so f*cking difficult to detect the scrolling element, just move them all
  const move = amount => {
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = amount;
      document.body.parentNode.scrollTop = amount;
      document.body.scrollTop = amount;
    }
  };

  const position = () => {
    if (typeof document !== 'undefined') {
      return (
        document.documentElement.scrollTop ||
        document.body.parentNode.scrollTop ||
        document.body.scrollTop
      );
    }
    return false;
  };
  // false;

  const start = position();
  const change = to - start;
  let currentTime = 0;
  const increment = 20;
  const thisDuration = typeof duration === 'undefined' ? 500 : duration;

  const animateScroll = () => {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const val = Math.easeInOutQuad(currentTime, start, change, thisDuration);
    // move the document.body
    move(val);
    // do the animation unless its over
    if (currentTime < thisDuration) {
      requestAnimFrame(animateScroll);
    } else if (callback && typeof callback === 'function') {
      // the animation is done so lets callback
      callback();
    }
  };

  animateScroll();
};

const getIPapiJson = async () => {
  const response = await fetch(`${apiUrl()}/getRegion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  if (!response.ok) {
    if (result.message) {
      throw result;
    } else {
      throw response;
    }
  }
  return result;
};

export {
  apiUrl,
  countryFlag,
  createLink,
  createLinkFromPage,
  getSlug,
  getTitle,
  makeid,
  mapToOffice,
  matchMomentLocale,
  isDayInRange,
  daysPassed,
  hoursPassed,
  normalizeTimeZone,
  renderLink,
  scrollTo,
  getIPapiJson,
};
