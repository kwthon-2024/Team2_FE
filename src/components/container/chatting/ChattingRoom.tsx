import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { AdditionIcon, Kebab, PostProfile, SendingIcon, SubHeaderWithIcon } from '@/components/view'
import { useBoolean, useWebSocket } from '@/hooks'

export const ChattingRoom = () => {
  const { id: roomId } = useParams()
  const { client, sendMessage } = useWebSocket(roomId, 'carpool')
  const [kebabState, setKebabTrue, setKebabFalse] = useBoolean(false)
  const [message, setMessage] = useState<string>('')

  const kebabMap = [
    { label: '채팅방 나가기', onClick: () => console.log('채팅방 나가기') },
    { label: '차단하기', onClick: () => console.log('차단하기') },
  ]

  const handleClcikSendButton = () => {
    console.log('clicked')
    if (client.current && client.current.connected) {
      sendMessage(message)
      // setInputValue('');
    } else {
      console.log('WebSocket is not connected')
    }
  }

  return (
    <div className="flex-column h-full">
      <SubHeaderWithIcon type={'kebab'} onClickKebab={kebabState ? setKebabFalse : setKebabTrue} />
      <PostProfile name="고로케" year="4" subText="소프트 팀원 구해요" iconType="ARMY" />

      {kebabState && <Kebab list={kebabMap} location="right-4 top-12" redIndex={1} />}

      <main className="scroll flex-column mx-4 grow gap-4 py-4">
        {/* {message.map(({ isMyMessage, message, time }, index) => {
          const layoutStyle = isMyMessage ? 'flex flex-row-reverse items-center' : 'flex-align'
          return (
            <div key={index} className={`${layoutStyle} gap-3`}>
              {!isMyMessage && <ProfileImage size="sm" iconType="NAVY" />}
              <Bubble isMyMessage={isMyMessage} message={message} />
              <span className="p-xsmall shrink-0 self-end text-grey-5">{time}</span>
            </div>
          )
        })} */}
      </main>

      <div className="flex-align gap-2 bg-white px-4 pb-8 pt-3">
        <AdditionIcon />
        <div className="flex-align grow gap-1 rounded-full bg-grey-1 py-2 pl-4 pr-2">
          <input
            type="text"
            placeholder="메세지를 입력해주세요."
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            className="grow bg-transparent text-grey-7 placeholder:text-grey-4 focus:outline-none"
          />

          <button className="shrink-0" onClick={handleClcikSendButton}>
            <SendingIcon />
          </button>
        </div>
      </div>
    </div>
  )
}