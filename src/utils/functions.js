import { allPageTypes } from '../constants';

const createLink = (location, slug) => {
  /*
    - Have established that URLs will always be formed as: /region/locale/slug/
    - No further hierarchy expected to pollute URLs or future link creation.
    - Slugs expected to be unique, coming from CMS.
    - location passed in expected to be the prop coming from @reach/router Location 
  */
  const reg = /\/(.*?)\/\w+\//;
  const linkPrefix = (location.pathname && reg.exec(location.pathname)) || '/';

  return `${linkPrefix[0]}${slug}/`;
};

const createLinkFromPage = (location, page, language) => {
  /* Given a page object with multiple slugs, return language-specific URL. */
  const slug = page[`slug${language.toUpperCase()}`] || page.slug;
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

const getTitle = (page, language = '') => {
  /*
    Get title from staticQuery from forms of titleEN, titleES, etc. or
    simply from page object when query is already language-filtered.
  */
  let title = '';
  switch (page.pageType) {
    case allPageTypes.ABOUT:
      title = page.about[`title${language}`];
      break;
    case allPageTypes.ARTICLE:
      title = page.article[`title${language}`];
      break;
    case allPageTypes.EVENTS:
      title = page.events[`title${language}`];
      break;
    case allPageTypes.INDUSTRY:
      title = page.industry[`title${language}`];
      break;
    case allPageTypes.LANDING:
      title = page.landing[`title${language}`];
      break;
    case allPageTypes.PRODUCT:
      title = page.product[`title${language}`];
      break;
    case allPageTypes.PROMO:
      title = page.promo[`title${language}`];
      break;
    case allPageTypes.SERVICE:
      title = page.service[`title${language}`];
      break;
    case allPageTypes.USED:
      title = page.usedEquipment[`title${language}`];
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

export {
  createLink,
  createLinkFromPage,
  getSlug,
  getTitle,
  makeid,
  isDayInRange,
  normalizeTimeZone,
};
