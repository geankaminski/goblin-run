import { Physics } from '@react-three/rapier'
import { Sky } from '@react-three/drei'
import Lights from './components/Lights.jsx'
import { Level } from './components/Level.jsx'
import Player from './components/Player.jsx'
import Stars from './components/Stars.jsx'
import useGame from './stores/useGame.jsx'

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount)

    return <>
        <Sky distance={4500000} sunPosition={[0, 6, 0]} inclination={20} azimuth={0.25} />
        <Physics debug={false}>
            <Stars />
            <Lights />
            <Level key={blocksCount} count={blocksCount} />
            <Player />
        </Physics>
    </>
}