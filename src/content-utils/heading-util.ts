import { getOfficialHeadings, getStandardHeadings } from './heading-std-util';
import { resolveNonStdHeadings } from './heading-non-std-util';

export function resolveHeadings() {
  const standardHeadings = getStandardHeadings();
  const officialHeadings = getOfficialHeadings();
  const nonStdHeadings = resolveNonStdHeadings();
  return { standardHeadings, officialHeadings, nonStdHeadings };
}
