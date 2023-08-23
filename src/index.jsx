import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
// import { Perf } from 'r3f-perf'
import Experience from './Experience.jsx'
import Interface from './components/Interface.jsx'
// import Loader from './components/Loader.jsx'
import '/styles/style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <KeyboardControls
        map={[
            { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
            { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
            { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
            { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
            { name: 'jump', keys: ['Space'] },
        ]}
    >
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [2.5, 4, 6]
            }}
        >
            {/* <Perf /> */}
            <Suspense /* fallback={<Loader />} */>
                <Experience />
            </Suspense>
        </Canvas>
        <Interface />
    </KeyboardControls>
)