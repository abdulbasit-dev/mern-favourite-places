import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import useForm from '../../shared/hooks/useForm';
import { useHttp } from '../../shared/hooks/useHttp';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './UpdatePlace.css';
import { AuthContext } from '../../shared/context/AuthContext';
// import Card from '../../shared/components/UIElements/Card'

function UpdatePlace() {
  const { placeId } = useParams();
  const { error, isLoading, sendRequest, clearError } = useHttp();
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();
  const { userId, token } = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const getPlace = async () => {
      try {
        const responseData = await sendRequest(
          `/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) { }
    };

    getPlace();
  }, [sendRequest, placeId, setFormData]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await sendRequest(
        `/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      history.push(`/${userId}/places`);
    } catch (err) { }
  };

  // if (!loadedPlace && !error) {
  //   return (
  //     <div className='center'>
  //       <Card>
  //         <h2>Could not find place!</h2>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={handleSubmit}>
          <Input
            id='title'
            element='input'
            type='text'
            label='title'
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Plase enter a valid title.'
            initialValue={loadedPlace.title}
            inisialValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Plase enter a valid description (at least 5 characters).'
            initialValue={loadedPlace.description}
            inisialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdatePlace;
