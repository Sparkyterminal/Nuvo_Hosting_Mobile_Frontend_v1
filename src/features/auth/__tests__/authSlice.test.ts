import reducer, { setUser, clearUser } from '../authSlice';

describe('authSlice', () => {
  it('starts with no user', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
  });

  it('setUser stores the user', () => {
    const user = { id: '1', full_name: 'Jane', role: 'CLIENT' };
    const state = reducer(undefined, setUser(user));
    expect(state.user).toEqual(user);
  });

  it('clearUser resets the user to null', () => {
    const withUser = reducer(undefined, setUser({ id: '1' }));
    const cleared = reducer(withUser, clearUser());
    expect(cleared.user).toBeNull();
  });
});
