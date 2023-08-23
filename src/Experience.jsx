import { useEffect } from 'react'
import { Physics } from '@react-three/rapier'
import { Sky } from '@react-three/drei'
import useGame from './stores/useGame.jsx'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)

    return <>

        <Sky distance={4500000} sunPosition={[0, 6, 0]} inclination={20} azimuth={0.25} />

        <Physics debug={false}>
            <Lights />
            <Level key={blocksCount} count={blocksCount} seed={blocksSeed} />
            <Player />
        </Physics>

    </>
}