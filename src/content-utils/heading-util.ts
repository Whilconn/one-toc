import { filterOfficialHeadings } from './heading-std-util';
import { inferHeadings } from './heading-infer-util';
import { getAllHeadings } from './heading-all-util';

export function resolveHeadings() {
  const { allHeadings, styleMap, rectMap } = getAllHeadings();
  const officialHeadings = filterOfficialHeadings(allHeadings);
  const inferredHeadings = inferHeadings(allHeadings, styleMap, rectMap);

  return { allHeadings, officialHeadings, inferredHeadings };
}
