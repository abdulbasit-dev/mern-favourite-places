import React from 'react'

import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import PlaceItem from './PlaceItem'
import './PlaceList.css'

function PlaceList(props) {
  return (
    <React.Fragment>
      {props.items.length === 0 ? (
        <div className='place-list center'>
          <Card>
            <h2>No place found, Maybe create one?</h2>
            <Button to='/places/new'>Share place</Button>
          </Card>
        </div>
      ) : (
        <ul className='place-list'>
          {props.items.map(place => (
            <PlaceItem key={place.id} {...place} onDelete={props.onDeletePlace} />
          ))}
        </ul>
      )}
    </React.Fragment>
  )
}

export default PlaceList
