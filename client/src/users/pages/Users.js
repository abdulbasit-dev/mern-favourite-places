import React, { useState, useEffect } from 'react';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UsersList from '../components/UsersList';
import { useHttp } from '../../shared/hooks/useHttp';

function Users() {
  const [users, setUsers] = useState();
  const { error, isLoading, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const getUser = async () => {
      try {
        const responseData = await sendRequest(`api/users`);

        setUsers(responseData.users);
      } catch (err) { }
    };

    getUser();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </React.Fragment>
  );
}

export default Users;
