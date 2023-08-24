import { useState } from 'react'
import { useProgress } from '@react-three/drei'
import useControls from '../stores/useControls.jsx'
import useGame from '../stores/useGame.jsx'

export default function Interface() {
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)
    const blocksCount = useGame((state) => state.blocksCount)
    const maxBlocks = useGame((state) => state.maxBlocks)
    const lifes = useGame((state) => state.lifes)

    let forward = useControls((state) => state.forward)
    const backward = useControls((state) => state.backward)
    const leftward = useControls((state) => state.leftward)
    const rightward = useControls((state) => state.rightward)
    const jump = useControls((state) => state.jump)
    const handleTouch = useControls((state) => state.handleTouch)

    const { progress } = useProgress()

    const [modal, setModal] = useState(true)

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
        {phase === 'ended' && <div className="restart" onClick={handleRestart()}>
            {
                blocksCount < maxBlocks ? 'NEXT LEVEL' : 'You win!'
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

        <svg className="modal-button" onClick={() => setModal(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z" fill='#fff'></path>
        </svg>

        {modal &&
            <div className='modal'>
                <div className='modal-content'>
                    <h1>Goblin Run</h1>

                    <h2>How to play</h2>

                    <p>Use the arrows or WASD keys to move</p>
                    <p>Use the space bar to jump</p>
                    <p>Don't touch the enemies</p>
                    <p>For better experience, use a computer</p>

                    <div className='modal-spacing'>
                        <p>
                            Inspired by a lesson from <a href="https://threejs-journey.com/" target="_blank" rel="noreferrer">Three.js Journey</a>
                        </p>
                        <p>
                            All models are from <a href="https://market.pmnd.rs/" target="_blank" rel="noreferrer">pmndrs market</a>
                        </p>
                        <p>
                            Music from <a href="https://pixabay.com/pt/users/lexin_music-28841948/" target="_blank" rel="noreferrer">Aleksey Chistilin</a>
                        </p>
                    </div>

                    <div className='modal-spacing'>
                        <a href="https://github.com/geankaminski/goblin-run" target="_blank" rel="noreferrer">Github Repo</a>
                    </div>

                    <button className="close-button" onClick={() => setModal(false)} disabled={progress < 100}>
                        {progress < 100 ? <span>{progress.toFixed()}%</span> : <span>START</span>}
                    </button>
                </div>
            </div>
        }

        {
            !modal && <div className="controls">
                <div>
                    <div className="raw">
                        <div
                            className={`key ${forward ? 'active' : ''}`}
                            onTouchStart={() => handleTouch('forward', true)}
                            onTouchEnd={() => handleTouch('forward', false)}
                        ></div>
                    </div>
                    <div className="raw">
                        <div
                            className={`key ${leftward ? 'active' : ''}`}
                            onTouchStart={() => handleTouch('leftward', true)}
                            onTouchEnd={() => handleTouch('leftward', false)}
                        ></div>
                        <div
                            className={`key ${rightward ? 'active' : ''}`}
                            onTouchStart={() => handleTouch('rightward', true)}
                            onTouchEnd={() => handleTouch('rightward', false)}
                        ></div>
                    </div>
                    <div className="raw">
                        <div
                            className={`key ${backward ? 'active' : ''}`}
                            onTouchStart={() => handleTouch('backward', true)}
                            onTouchEnd={() => handleTouch('backward', false)}
                        ></div>
                    </div>
                </div>

                <div
                    className={`key ${jump ? 'active' : ''}`}
                    onTouchStart={() => handleTouch('jump', true)}
                    onTouchEnd={() => handleTouch('jump', false)}
                ></div>
            </div>
        }
    </div>
}