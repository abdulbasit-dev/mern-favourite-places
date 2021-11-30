import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/AuthContext';
import { useHttp } from '../../shared/hooks/useHttp';
import './PlaceItem.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

function PlaceItem(props) {
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { userId, token } = useContext(AuthContext);
  const { error, isLoading, sendRequest, clearError } = useHttp();

  const { image, title, address, description, id, location, creator } = props;
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(`/places/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + token,
      });
      props.onDelete(id);
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={location} zoom={16} />
        </div>
      </Modal>

      <Modal
        header='Are you sure?'
        show={showDeleteModal}
        onCancel={closeDeleteModal}
        footerClass='place-item__modal-actions'
        footer={
          <React.Fragment>
            <Button inverse onClick={closeDeleteModal}>
              CANCEL
            </Button>
            <Button danger onClick={handleDelete}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you went to proceed and delete this place? Place note that is can be restore after
          that.
        </p>
      </Modal>

      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && (
            <div className='center'>
              <LoadingSpinner asOverlay />
            </div>
          )}
          <div className='place-item__image'>
            <img src={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt={title} />
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {userId === creator && <Button to={`/places/${id}`}>EDIT</Button>}
            {userId === creator && (
              <Button danger onClick={openDeleteModal}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
}

export default PlaceItem;
