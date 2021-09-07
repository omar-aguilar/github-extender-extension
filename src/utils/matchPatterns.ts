const getUrlParts = (url: string, separator = '0x0c') =>
  url.replace('://', separator).replace('/', separator).split(separator);

const starToRegex = (pattern: string) => pattern.replace(/\*/g, '.*');

const isMatchPattern = (url: string, pattern: string): boolean => {
  const httpSchemes = ['http', 'https'];
  const validSchemes = [...httpSchemes, 'file', 'ftp', '*', 'urn'];
  const specialChar = '*';
  const specialPattern = '<all_urls>';

  if (pattern === specialPattern) {
    return true;
  }

  const [patternScheme, patternDomain, patternPath] = getUrlParts(pattern);
  const [scheme] = getUrlParts(url);
  console.log('isMatchPattern > ', patternScheme, patternDomain, patternPath);

  if (!validSchemes.includes(patternScheme)) {
    return false;
  }

  if (patternScheme === specialChar && !httpSchemes.includes(scheme)) {
    return false;
  }

  const patternRegex = starToRegex(patternScheme);
  const domainRegex = starToRegex(patternDomain);
  const pathRegex = starToRegex(patternPath);

  let stringRegex = `${patternRegex}://${domainRegex}`;
  if (pathRegex) {
    stringRegex = `${stringRegex}/${pathRegex}`;
  }

  console.log('isMatchPattern > ', stringRegex);

  const matcher = RegExp(stringRegex);
  return matcher.test(url);
};

export default isMatchPattern;
