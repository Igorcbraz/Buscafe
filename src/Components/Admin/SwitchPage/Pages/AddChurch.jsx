import { toast } from 'react-toastify';

import { Alert } from '@mui/material';
import { BlockPicker } from 'react-color'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

import { useAuth } from '../../../../hooks/useAuth';
import { useChat } from '../../../../hooks/useChat';

import { api } from '../../../../services/api';

import { CreateRoomStyles, Container } from './style'

export function AddChurch(){
  const { getAllUsers, getChats} = useChat();
  const { user, setUser } = useAuth();
  const [room, setRoom] = useState({name: '', description: '', cpf: '', cnpj: ''})
  const [adminColor, setAdminColor] = useState('#F3B72B');

  const [coords, setCoords] = useState(user.coordinate);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    mapIds: [process.env.REACT_APP_GOOGLE_MAPS_ID],
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  })

  useEffect(() => {
    if(!user.coordinate.lat || !user.coordinate.lng){
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords(() => ({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }))
      });
    } else {
      setCoords(user.coordinate)
    }
  }, [])

  useEffect(async () => {
    user.church && await getAllUsers(user.church?.roomId, user.id_user);
  }, [])

  useEffect(async () => {
    user.church && await getChats(user?.id_user, user.church.roomId);
  }, []);

  async function handleAddRoom(e){
    e.preventDefault();
    
    if(Object.values(room).includes('')){
      toast.info('É necessário informar todos os campos')
      return;
    }

    try {
      const { data } = await api.post(`/admin/church/insert`, {
        name:  room.name,
        description: room.description,
        cpf: room.cpf,
        cnpj: room.cnpj,
        users: [{ idUser: String(user.id_user), name: user.nome }],
        idUser: user.id_user,
        coords,
      });

      if(data.code === 1){
        setUser({...user, church: data.room })

        toast.success(data.msg);
      } else {
        throw new Error(data.err)
      }

      return data;
    } catch (err) {
      console.error(err)
    }
  }

  function handleChangeColor(color){
    setAdminColor(color.hex)
    document.body.style.setProperty('--admin-color', color.hex);
  }

  return isLoaded ? (
    <Container>
      <Alert severity="info">Arraste o marcador para a posição da sua igreja</Alert>

      <GoogleMap
        center={coords}
        zoom={15}
        options={{
          mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
        }}
        mapContainerClassName="containerGoogleMaps"
      >
        {/* Current users position */}
        <Marker 
          position={coords}
          options={{
            label: {
              text: 'Minha Igreja',
            },
            clickable: true,
            draggable: user.church === null,
          }}
          onDragEnd={(e) => setCoords(() => ({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          }))}
        />
      </GoogleMap>

      <CreateRoomStyles>
        <form onSubmit={handleAddRoom}>
          <span id='infos'>
            <label>Nome da Igreja:</label>
            <input
              type="text"
              value={room.name}
              maxLength={25}
              onChange={e => setRoom(prevRoom=>{
                return {...prevRoom, name: e.target.value}
              })}
            />
          </span>
          <span id='infos'>
            <label>Descrição:</label>
            <input
              type="text"
              value={room.description}
              maxLength={150}
              onChange={e => setRoom(prevRoom => {
                return {...prevRoom, description: e.target.value}
              })}
            />
          </span>
          <span id='infos'>
            <label>CPF:</label>
            <input
              type="text"
              value={room.cpf}
              maxLength={25}
              onChange={e => setRoom(prevRoom => {
                return {...prevRoom, cpf: e.target.value}
              })}
            />
          </span>
          <span id='infos'>
            <label>CNPJ:</label>
            <input
              type="text"
              value={room.cnpj}
              maxLength={25}
              onChange={e => setRoom(prevRoom => {
                return {...prevRoom, cnpj: e.target.value}
              })}
            />
          </span>
          <span>
            <Alert severity="info">Escolha uma cor para a sua igreja</Alert>
            <BlockPicker 
              color={adminColor}
              onChangeComplete={handleChangeColor}
              width={'100%'}
            />
          </span>
          <button type='submit'>Criar</button>
        </form>
    </CreateRoomStyles>
    </Container>
) : <h1>Carregando...</h1>
}