import reducer, { setLoading } from '../exploreSlice';

describe('exploreSlice', () => {
  it('defaults loading to false', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.loading).toBe(false);
  });

  it('setLoading(true) flips the flag', () => {
    const state = reducer(undefined, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('setLoading(false) resets the flag', () => {
    const on = reducer(undefined, setLoading(true));
    const off = reducer(on, setLoading(false));
    expect(off.loading).toBe(false);
  });
});
