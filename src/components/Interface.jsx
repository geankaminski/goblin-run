import { useKeyboardControls } from '@react-three/drei'
import useGame from '../stores/useGame.jsx'

export default function Interface() {
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)
    const blocksCount = useGame((state) => state.blocksCount)
    const maxBlocks = useGame((state) => state.maxBlocks)
    const lifes = useGame((state) => state.lifes)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    const handleRestart = () => {
        return () => {
            if (blocksCount < maxBlocks) {
                useGame.setState({ blocksCount: blocksCount + 1 })
            } else {
                useGame.setState({ blocksCount: 1, lifes: 3 })
            }
            restart()
        }
    }

    return <div className="interface">
        {/* Restart */}
        {phase === 'ended' && <div className="restart" onClick={handleRestart()}>
            {
                blocksCount < maxBlocks ? 'Continue' : 'You win!'
            }
        </div>}

        <div className='lifes'>
            {
                lifes > 0 && [...Array(lifes)].map((_, index) => <div key={index}>❤️</div>)
            }
        </div>

        <div className='level'>
            Level {blocksCount}-{maxBlocks}
        </div>

        {/* Controls */}
        <div className="controls">
            <div className="raw">
                <div className={`key ${forward ? 'active' : ''}`}></div>
            </div>
            <div className="raw">
                <div className={`key ${leftward ? 'active' : ''}`}></div>
                <div className={`key ${backward ? 'active' : ''}`}></div>
                <div className={`key ${rightward ? 'active' : ''}`}></div>
            </div>
            <div className="raw">
                <div className={`key large ${jump ? 'active' : ''}`}></div>
            </div>
        </div>
    </div>
}