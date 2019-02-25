export const createLink = (location, slug) => {
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

export default createLink;
