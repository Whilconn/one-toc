import { links } from './links';

describe('toc content render', () => {
  for (const link of links) {
    it(link[0], () => {
      cy.visit(link[1]);
      cy.get('.toc-root a').should((a) => {
        expect(a).to.have.length(+link[2]);
      });
    });
  }
});

export {};
