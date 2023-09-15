import { NavigateFunction, useNavigate } from 'react-router';
import React, { useEffect } from 'react';
let navigateRef = React.createRef<NavigateFunction>().current;

const setNavigateRef = (navigate: NavigateFunction) => {
  navigateRef = navigate
}

const navigate = (name: string, options?: any) => {
  if (navigateRef) {
    navigateRef(name, options)
  }
}

export const useNavigationService = ()=>{
  const navigation = useNavigate()
  useEffect(() => {
    setNavigateRef(navigation)
  }, [])
}

export default { navigate }