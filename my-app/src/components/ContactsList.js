import React from 'react'
import './ContactsList.css';
import Contact from './Contact';
import { Link } from 'react-router-dom';

export default function ContactsList() {
  const contacts = [
    {
      name: 'Saqib',
      profilePic: 'img/saqib.jpg',
      about: 'hiladjf'
    },
    {
      name: 'talha',
      profilePic: 'img/mache.jpg',
      about: 'Nothing '
    },
    {
      name: 'Ali Ashraf',
      profilePic: 'img/ali.jpg',
      about: 'Σzcxv'
    }
  ]

  return (

    <div className='contacts-list'>
      <Link to={`/${contacts[0].name}`}><Contact contact={contacts[0]} /></Link>
      <Link to={`/${contacts[1].name}`}><Contact contact={contacts[1]} /></Link>
      <Link to={`/${contacts[2].name}`}><Contact contact={contacts[2]} /></Link>
    </div>
  )
}
