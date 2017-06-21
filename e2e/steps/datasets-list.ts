import { $$, steps } from '../support/world';

steps(({Then}) => {
  Then(/^the datasets should be sorted by date in descending order$/, () => {
    return $$('.datasets-list-row').getText().then(rows => {
      const timestamp = row => new Date(row.split('\n')[0]).getTime();
      rows.length.should.be.above(0);
      (rows as any).reduce((last, next) => {
        timestamp(next).should.be.at.most(timestamp(last));
        return next;
      });
    });
  });
});
