import { document, window } from 'browser-monads';
import fetchPonyfill from 'fetch-ponyfill';
import { allPageTypes } from '../constants';

const { fetch } = fetchPonyfill();

const createLink = (location, slug) => {
  /*
    - Have established that URLs will always be formed as: /region/locale/slug/
    - No further hierarchy expected to pollute URLs or future link creation.
    - Slugs expected to be unique, coming from CMS.
    - location passed in expected to be the prop coming from @reach/router Location 
    - accounts for when there is no slug (homepage) so url may end in /region/locale
      and no trailing slash
  */
  const reg = /\/(.*?)\/\w+\//;
  const match = reg.exec(location.pathname);
  const linkPrefix = (match && match[0]) || `${location.pathname}/`;
  return `${linkPrefix}${slug}/`;
};

const createLinkFromPage = (location, page, language) => {
  /* Given a page object with multiple slugs, return language-specific URL. */
  const slug = page[`slug${language.toUpperCase()}`] || page.slug;
  return createLink(location, slug);
};

const getRegion = countryCode => {
  /* Region mappings
     API = Asia Pacific Indonesia
     AUS = Australia
     BRA = Brazil
     CHI = Chile
     CHN = China
     EUR = Europe
     IND = India
     AFR = Africa
     MEX = Mexico
     PER = Peru
     FON = Fonmar
  */

  const countryMap = new Map([
    ['BN', 'API'],
    ['KH', 'API'],
    ['TL', 'API'],
    ['ID', 'API'],
    ['LA', 'API'],
    ['MY', 'API'],
    ['FM', 'API'],
    ['PW', 'API'],
    ['PG', 'API'],
    ['PH', 'API'],
    ['SG', 'API'],
    ['TH', 'API'],
    ['VN', 'API'],
    ['AQ', 'AUS'],
    ['AU', 'AUS'],
    ['FJ', 'AUS'],
    ['KI', 'AUS'],
    ['MH', 'AUS'],
    ['NR', 'AUS'],
    ['NZ', 'AUS'],
    ['WS', 'AUS'],
    ['SB', 'AUS'],
    ['TO', 'AUS'],
    ['TV', 'AUS'],
    ['VU', 'AUS'],
    ['BR', 'BRA'],
    ['GY', 'BRA'],
    ['PY', 'BRA'],
    ['SR', 'BRA'],
    ['GF', 'BRA'],
    ['CL', 'CHI'],
    ['AR', 'CHI'],
    ['CN', 'CHN'],
    ['HK', 'CHN'],
    ['JP', 'CHN'],
    ['KZ', 'CHN'],
    ['KP', 'CHN'],
    ['KR', 'CHN'],
    ['MN', 'CHN'],
    ['TW', 'CHN'],
    ['AM', 'EUR'],
    ['AT', 'EUR'],
    ['AZ', 'EUR'],
    ['AD', 'EUR'],
    ['AL', 'EUR'],
    ['BY', 'EUR'],
    ['BE', 'EUR'],
    ['BA', 'EUR'],
    ['BG', 'EUR'],
    ['HR', 'EUR'],
    ['CY', 'EUR'],
    ['CZ', 'EUR'],
    ['DK', 'EUR'],
    ['EE', 'EUR'],
    ['FI', 'EUR'],
    ['FR', 'EUR'],
    ['GE', 'EUR'],
    ['GR', 'EUR'],
    ['HU', 'EUR'],
    ['IS', 'EUR'],
    ['IR', 'EUR'],
    ['IQ', 'EUR'],
    ['IE', 'EUR'],
    ['IT', 'EUR'],
    ['XK', 'EUR'],
    ['LV', 'EUR'],
    ['LI', 'EUR'],
    ['LT', 'EUR'],
    ['LU', 'EUR'],
    ['MK', 'EUR'],
    ['MT', 'EUR'],
    ['MD', 'EUR'],
    ['MC', 'EUR'],
    ['ME', 'EUR'],
    ['MA', 'EUR'],
    ['NL', 'EUR'],
    ['NO', 'EUR'],
    ['PL', 'EUR'],
    ['PT', 'EUR'],
    ['RO', 'EUR'],
    ['RU', 'EUR'],
    ['SM', 'EUR'],
    ['RS', 'EUR'],
    ['SK', 'EUR'],
    ['SI', 'EUR'],
    ['SE', 'EUR'],
    ['CH', 'EUR'],
    ['TR', 'EUR'],
    ['UA', 'EUR'],
    ['GB', 'EUR'],
    ['VA', 'EUR'],
    ['DE', 'GER'],
    ['BH', 'IND'],
    ['BD', 'IND'],
    ['AF', 'IND'],
    ['BT', 'IND'],
    ['IN', 'IND'],
    ['IR', 'IND'],
    ['IQ', 'IND'],
    ['IL', 'IND'],
    ['JO', 'IND'],
    ['KW', 'IND'],
    ['KG', 'IND'],
    ['LB', 'IND'],
    ['MV', 'IND'],
    ['MM', 'IND'],
    ['NP', 'IND'],
    ['OM', 'IND'],
    ['PK', 'IND'],
    ['QA', 'IND'],
    ['SA', 'IND'],
    ['LK', 'IND'],
    ['SY', 'IND'],
    ['TJ', 'IND'],
    ['TM', 'IND'],
    ['AE', 'IND'],
    ['UZ', 'IND'],
    ['YE', 'IND'],
    ['US', 'USA'],
    ['CA', 'CAN'],
    ['AO', 'AFR'],
    ['DZ', 'AFR'],
    ['BJ', 'AFR'],
    ['BW', 'AFR'],
    ['BF', 'AFR'],
    ['BI', 'AFR'],
    ['CV', 'AFR'],
    ['CM', 'AFR'],
    ['CF', 'AFR'],
    ['TD', 'AFR'],
    ['KM', 'AFR'],
    ['CD', 'AFR'],
    ['CG', 'AFR'],
    ['CI', 'AFR'],
    ['DJ', 'AFR'],
    ['EG', 'AFR'],
    ['GQ', 'AFR'],
    ['ER', 'AFR'],
    ['ET', 'AFR'],
    ['GA', 'AFR'],
    ['GM', 'AFR'],
    ['GH', 'AFR'],
    ['GN', 'AFR'],
    ['GW', 'AFR'],
    ['KE', 'AFR'],
    ['LS', 'AFR'],
    ['LR', 'AFR'],
    ['LY', 'AFR'],
    ['MG', 'AFR'],
    ['MW', 'AFR'],
    ['ML', 'AFR'],
    ['MR', 'AFR'],
    ['MU', 'AFR'],
    ['MZ', 'AFR'],
    ['NA', 'AFR'],
    ['NI', 'AFR'],
    ['NE', 'AFR'],
    ['NG', 'AFR'],
    ['RW', 'AFR'],
    ['ST', 'AFR'],
    ['SN', 'AFR'],
    ['SC', 'AFR'],
    ['SL', 'AFR'],
    ['SO', 'AFR'],
    ['ZA', 'AFR'],
    ['SD', 'AFR'],
    ['SS', 'AFR'],
    ['SZ', 'AFR'],
    ['TZ', 'AFR'],
    ['TG', 'AFR'],
    ['TN', 'AFR'],
    ['UG', 'AFR'],
    ['ZM', 'AFR'],
    ['ZW', 'AFR'],
    ['AG', 'MEX'],
    ['BS', 'MEX'],
    ['BB', 'MEX'],
    ['BZ', 'MEX'],
    ['CO', 'MEX'],
    ['CR', 'MEX'],
    ['CU', 'MEX'],
    ['DM', 'MEX'],
    ['DO', 'MEX'],
    ['SV', 'MEX'],
    ['GD', 'MEX'],
    ['GT', 'MEX'],
    ['HT', 'MEX'],
    ['HN', 'MEX'],
    ['JM', 'MEX'],
    ['MX', 'MEX'],
    ['PA', 'MEX'],
    ['KN', 'MEX'],
    ['LC', 'MEX'],
    ['VC', 'MEX'],
    ['TT', 'MEX'],
    ['VE', 'MEX'],
    ['PE', 'PER'],
    ['BO', 'PER'],
    ['EC', 'PER'],
    ['ES', 'FON'],
  ]);
  return countryMap.get(countryCode) || null;
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

const getTitle = (page, language = '') => {
  /*
    Get title from staticQuery from forms of titleEN, titleES, etc. or
    simply from page object when query is already language-filtered.
  */
  let title = '';
  switch (page.pageType) {
    case allPageTypes.ABOUT:
      title = page.about[`title${language}`] || page.about.title || '';
      break;
    case allPageTypes.ARTICLE:
      title = page.article[`title${language}`] || page.article.title || '';
      break;
    case allPageTypes.EVENTS:
      title = page.events[`title${language}`] || page.events.title || '';
      break;
    case allPageTypes.INDUSTRY:
      title = page.industry[`title${language}`] || page.industry.title || '';
      break;
    case allPageTypes.LANDING:
      title = page.landing[`title${language}`] || page.landing.title || '';
      break;
    case allPageTypes.PRODUCT:
      title = page.product[`title${language}`] || page.product.title || '';
      break;
    case allPageTypes.PROMO:
      title = page.promo[`title${language}`] || page.promo.title || '';
      break;
    case allPageTypes.SERVICE:
      title = page.service[`title${language}`] || page.service.title || '';
      break;
    case allPageTypes.USED:
      title = page.usedEquipment[`title${language}`] || page.usedEquipment.title || '';
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
 * @param  {Date}  day
 * @param  {Object}  range
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
 *
 *
 * @export
 * @param  {String}  date
 * @return {String}
 */
const normalizeTimeZone = day => `${day}T00:00:00.Z`;

/* Thanks to James Doyle for this: https://gist.github.com/james2doyle/5694700 */

const requestAnimFrame = func =>
  window.requestAnimationFrame(func) ||
  window.webkitRequestAnimationFrame(func) ||
  window.mozRequestAnimationFrame(func) ||
  (callback => {
    window.setTimeout(callback, 1000 / 60);
  });

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

const scrollTo = (to, callback, duration) => {
  // because it's so f*cking difficult to detect the scrolling element, just move them all
  const move = amount => {
    document.documentElement.scrollTop = amount;
    document.body.parentNode.scrollTop = amount;
    document.body.scrollTop = amount;
  };

  const position = () =>
    document.documentElement.scrollTop ||
    document.body.parentNode.scrollTop ||
    document.body.scrollTop;

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

export {
  createLink,
  createLinkFromPage,
  fetch,
  getRegion,
  getSlug,
  getTitle,
  makeid,
  isDayInRange,
  normalizeTimeZone,
  scrollTo,
};
