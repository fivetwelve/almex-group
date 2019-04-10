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

export { createLink, createLinkFromPage, getSlug, getTitle, makeid };
