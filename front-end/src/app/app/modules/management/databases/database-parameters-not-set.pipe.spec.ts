import { DatabaseParametersNotSetPipe } from './database-parameters-not-set.pipe';

describe('DatabaseParametersNotSetPipe', () => {
  it('create an instance', () => {
    const pipe = new DatabaseParametersNotSetPipe();
    expect(pipe).toBeTruthy();
  });
});
