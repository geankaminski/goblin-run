import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import { Sky } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)

    return <>

        <Sky distance={20000} sunPosition={[0, 1, 0]} inclination={20} azimuth={0.001} />

        <Physics debug={false}>
            <Lights />
            <Level count={blocksCount} seed={blocksSeed} />
            <Player />
        </Physics>

    </>
}