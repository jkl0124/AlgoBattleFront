import './enter.css'
import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import socket from '~/lib/sockets/socket';

export default function EnterRoom({show, roomPassword, cancelShow, roomId}) {
  const {handle, _id} = useSelector((state) => state.user.user);
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();

  const onEnter = () => {
    if(roomPassword !== inputPassword){
      Swal.fire({
        icon:"error",
        title: "비밀번호가 틀립니다",
        text:"다시 입력해주세요",
      })
      return;
    }
    socket.emit("enterPlayer", {
      roomId : roomId,
      roomPassword : inputPassword,
      player2_Id : _id,
      handle : handle
    })
    socket.on("enterRoomId", (roomId) => {
      navigate(`/room/${roomId}`)
    })
  }

  return (
    <Modal
      show={show}
      className='modalEnter'
      onHide={()=>cancelShow()}
    >
      <ModalHeader closeButton>
        <ModalTitle>Confirm Password</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className='modalEnterText'>방에 입장하기 위해서는 비밀번호 입력이 필요합니다</div>
        <input
          type='password'
          className='modalEnterInput'
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant='light' onClick={()=>cancelShow()}>취소</Button>
        <Button onClick={()=>onEnter()}>입장</Button>
      </ModalFooter>
    </Modal>
  )
}
