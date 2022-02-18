import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../../store';

const Events: React.FC = (): JSX.Element => {
  const response = useStoreState(state => state.auth.response);
  const login = useStoreActions(actions => actions.auth.login);

  useEffect(() => {
    
  }, []);

  return (
    <>Events</>
  )
}
export default Events;