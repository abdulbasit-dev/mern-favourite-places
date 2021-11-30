import React from 'react'

import Card from '../../shared/components/UIElements/Card'
import UserItem from './UserItem'
import './UserLits.css'

function UsersList({items}) {
  return (
    <div>
      {items.length === 0 ? (
        <div className='center'>
          <Card>
            <h2>No User Found.</h2>
          </Card>
        </div>
      ) : (
        <ul className='users-list'>
          {items.map(user => (
            <UserItem key={user.id} {...user} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default UsersList
