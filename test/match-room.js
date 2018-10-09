/** @jsx h */
import test from 'ava'
import { h } from 'dom-chef'
import * as matchRoom from '../src/content/libs/match-room'

test.afterEach('cleanup dom', () => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
})

test('getRoomId', t => {
  const roomId = '466ece1d-9f16-4b64-aa2d-826c60bc022f'
  const path = `en/csgo/room/${roomId}`

  t.is(matchRoom.getRoomId(path), roomId)
  t.falsy(matchRoom.getRoomId(''))
})

test('mapPlayersToPartyColorsV1', t => {
  const createPlayer = (nickname, activeTeamId) => ({
    nickname,
    activeTeamId
  })
  const faction1 = [
    createPlayer('a', '1'),
    createPlayer('b', '1'),
    createPlayer('c', '2')
  ]
  const match = { faction1 }
  const factionDetails = { factionName: 'faction1', isFaction1: true }
  const colors = ['white', 'black']

  t.deepEqual(
    matchRoom.mapPlayersToPartyColors(match, true, factionDetails, colors),
    {
      a: colors[0],
      b: colors[0],
      c: colors[1]
    }
  )
})

test('mapPlayersToPartyColorsV2', t => {
  let playerIdCounter = 0
  const parties = {}
  const createPlayer = (nickname, partyId) => {
    if (!parties[partyId]) {
      parties[partyId] = []
    }
    const id = playerIdCounter++
    parties[partyId].push(id)

    return {
      nickname,
      id
    }
  }
  const roster = [
    createPlayer('a', '1'),
    createPlayer('b', '1'),
    createPlayer('c', '2')
  ]
  const match = {
    entityCustom: {
      parties
    },
    teams: {
      faction1: {
        roster
      }
    }
  }

  const factionDetails = { factionName: 'faction1', isFaction1: true }
  const colors = ['white', 'black']

  t.deepEqual(
    matchRoom.mapPlayersToPartyColors(match, false, factionDetails, colors),
    {
      a: colors[0],
      b: colors[0],
      c: colors[1]
    }
  )
})

test('getDefferedVoteTime normal situation', t => {
  const sec = 50

  const el = (
    <div className="match-voting__message">
      <timer>
        <span>{sec}</span>
        <span>s</span>
      </timer>
    </div>
  )

  document.body.appendChild(el)

  t.is(matchRoom.getDefferedVoteTime(), sec * 1000 - matchRoom.VOTE_LEEWAY)
})

test('getDefferedVoteTime bad situation', t => {
  t.is(matchRoom.getDefferedVoteTime(), matchRoom.VOTE_LEEWAY)
})
