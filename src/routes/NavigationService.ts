import { NavigateFunction } from 'react-router';
import React from 'react';
let navigateRef = React.createRef<NavigateFunction>().current;

const setNavigateRef = (navigate: NavigateFunction) => {
  navigateRef = navigate
}

const navigate = (name: string, options?: any) => {
  if (navigateRef) {
    navigateRef(name, options)
  }
}

export default { navigate, setNavigateRef }