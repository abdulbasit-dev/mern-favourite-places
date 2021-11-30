import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttp } from '../../shared/hooks/useHttp';

import PlaceList from '../components/PlaceList';

function UserPlaces() {
  //extract user id from url
  const { uid } = useParams();
  const { error, isLoading, sendRequest, clearError } = useHttp();
  const [userPlaces, setUserPlaces] = useState(null);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `/places/user/${uid}`
        );
        setUserPlaces(responseData.places);
      } catch (err) { }
    };

    getPlaces();
  }, [sendRequest, uid]);

  function onDeletePlace(deletePlaceId) {
    setUserPlaces(prevState => prevState.filter(place => place.id !== deletePlaceId));
  }
  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && userPlaces && <PlaceList items={userPlaces} onDeletePlace={onDeletePlace} />}
    </React.Fragment>
  );
}

export default UserPlaces;
