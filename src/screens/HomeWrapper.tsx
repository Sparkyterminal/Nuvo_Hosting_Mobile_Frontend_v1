import React from 'react';
import { useSelector } from 'react-redux';
import EmployeeTabsNavigator from '../navigation/EmployeeTabsNavigator';
import HomeTabsNavigator from '../navigation/HomeTabsNavigator';
import { useAppDispatch } from '../store/hooks';

const HomeWrapper = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const role = user?.role;

  console.log('HOME WRAPPER ROLE:', role);

  if (role === 'STAFF' || role === 'MAKEUP_ARTIST') {
    return <EmployeeTabsNavigator />;
  }

  return <HomeTabsNavigator />;
};

export default HomeWrapper;
