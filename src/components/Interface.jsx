import { useState } from 'react'
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

    const [modal, setModal] = useState(false)

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

    const handleTouchStart = (event, key) => {
        event.preventDefault();
        if (key === 'forward') useKeyboardControls.setState({ forward: true });
        else if (key === 'backward') useKeyboardControls.setState({ backward: true });
        else if (key === 'leftward') useKeyboardControls.setState({ leftward: true });
        else if (key === 'rightward') useKeyboardControls.setState({ rightward: true });
        else if (key === 'jump') useKeyboardControls.setState({ jump: true });
    };

    const handleTouchEnd = (event, key) => {
        event.preventDefault();
        if (key === 'forward') useKeyboardControls.setState({ forward: false });
        else if (key === 'backward') useKeyboardControls.setState({ backward: false });
        else if (key === 'leftward') useKeyboardControls.setState({ leftward: false });
        else if (key === 'rightward') useKeyboardControls.setState({ rightward: false });
        else if (key === 'jump') useKeyboardControls.setState({ jump: false });
    };

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
                    <svg className="close-button" onClick={() => setModal(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z" fill="#000"></path>
                    </svg>

                    <h1>How to play</h1>
                    <p>Use the arrows or WASD keys to move</p>
                    <p>Use the space bar to jump</p>
                    <p>Don't fall into the void</p>
                    <p>And don't touch the enemies!</p>

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
                </div>
            </div>
        }

        <div className="controls">
            <div className="raw">
                <div
                    className={`key ${forward ? 'active' : ''}`}
                    onTouchStart={(e) => handleTouchStart(e, 'forward')}
                    onTouchEnd={(e) => handleTouchEnd(e, 'forward')}
                ></div>
            </div>
            <div className="raw">
                <div
                    className={`key ${leftward ? 'active' : ''}`}
                    onTouchStart={(e) => handleTouchStart(e, 'leftward')}
                    onTouchEnd={(e) => handleTouchEnd(e, 'leftward')}
                ></div>
                <div
                    className={`key ${backward ? 'active' : ''}`}
                    onTouchStart={(e) => handleTouchStart(e, 'backward')}
                    onTouchEnd={(e) => handleTouchEnd(e, 'backward')}
                ></div>
                <div
                    className={`key ${rightward ? 'active' : ''}`}
                    onTouchStart={(e) => handleTouchStart(e, 'rightward')}
                    onTouchEnd={(e) => handleTouchEnd(e, 'rightward')}
                ></div>
            </div>
            <div className="raw">
                <div
                    className={`key large ${jump ? 'active' : ''}`}
                    onTouchStart={(e) => handleTouchStart(e, 'jump')}
                    onTouchEnd={(e) => handleTouchEnd(e, 'jump')}
                ></div>
            </div>
        </div>
    </div>
}