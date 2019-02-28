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
  /* given a page object, return language-specific URL */
  const slug = page[`slug${language.toUpperCase()}`];
  return createLink(location, slug);
};

const getTitle = (page, language) => {
  /*
    For use when titles are returned from staticQuery in the form
    of titleEN, titleES, etc. and we need the locale-specific one
  */
  let title = '';
  switch (page.pageType) {
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
    default:
      break;
  }
  return title;
};

export { createLink, createLinkFromPage, getTitle };
