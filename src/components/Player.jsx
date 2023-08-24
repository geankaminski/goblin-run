import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame, useLoader } from '@react-three/fiber'
import useControls from '../stores/useControls.jsx'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import useGame from '../stores/useGame.jsx'

export default function Player() {
    const body = useRef()
    const primitive = useRef()

    const korrigan = useLoader(GLTFLoader, '/models/korrigan-hat.gltf')
    let mixer
    let actions = []
    if (korrigan.animations.length > 0) {
        // animations course_chapeau & pose_chapeau
        mixer = new THREE.AnimationMixer(korrigan.scene)
        korrigan.animations.forEach((clip) => {
            actions.push(mixer.clipAction(clip))
        })
        actions[1].play()
    }

    korrigan.scene.traverse(function (node) {
        if (node.isMesh) { node.castShadow = true; }
    });

    const { rapier, world } = useRapier()

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const dead = useGame((state) => state.dead)
    const blocksCount = useGame((state) => state.blocksCount)
    const phase = useGame((state) => state.phase)
    const handleKey = useControls((state) => state.handleKey)

    const jump = () => {
        const origin = body.current.translation()

        if (origin.y > 0.25) {
            body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })
            return
        }

        origin.y -= 0
        const direction = { x: 0, y: - 1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })

        if (hit.toi < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.078, z: 0 })
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1.5, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
        body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })
        primitive.current.rotation.y = Math.PI
    }

    const fadeToAction = (actionIndex, duration) => {
        if (actionIndex === 0) {
            actions[1].stop()
            actions[0].play()
        }

        if (actionIndex === 1) {
            actions[0].stop()
            actions[1].play()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', (e) => handleKey(e, true))
        window.addEventListener('keyup', (e) => handleKey(e, false))

        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === 'ready')
                    reset()
            }
        )

        const unsubscribeJump = useControls.subscribe(
            (state) => state.jump,
            (value) => {
                if (value)
                    jump()
            }
        )

        const unsubscribeAny = useControls.subscribe(
            (state) => state,
            (value) => {
                if (
                    value.forward ||
                    value.backward ||
                    value.leftward ||
                    value.rightward ||
                    value.jump
                )
                    start()
            }
        )

        return () => {
            unsubscribeReset()
            unsubscribeJump()
            unsubscribeAny()
        }
    }, [])

    const updateCamera = (state, delta, z) => {
        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += z
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)
    }

    useFrame((state, delta) => {
        mixer?.update(delta)

        if (body.current.translation().z < - (blocksCount * 4) && phase === 'ended') {
            body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })
            primitive.current.rotation.y = Math.PI
            fadeToAction(1, 0.1)
            updateCamera(state, delta, 1.4)
            return
        }

        const { forward, backward, leftward, rightward } = useControls.getState()

        if (forward) {
            const position = body.current.translation()
            position.z -= 0.05
            body.current.setTranslation(position)
            body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })

            primitive.current.rotation.y = 0

            fadeToAction(0, 0.1)
        }

        if (rightward) {
            const position = body.current.translation()
            position.x += 0.02
            body.current.setTranslation(position)
            body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })

            primitive.current.rotation.y = - Math.PI / 2

            fadeToAction(0, 0.2)
        }

        if (backward) {
            const position = body.current.translation()
            position.z += 0.05
            body.current.setTranslation(position)
            body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })

            primitive.current.rotation.y = Math.PI

            fadeToAction(0, 0.2)
        }

        if (leftward) {
            const position = body.current.translation()
            position.x -= 0.02
            body.current.setTranslation(position)
            body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })

            primitive.current.rotation.y = Math.PI / 2

            fadeToAction(0, 0.2)
        }

        if (!forward && !backward && !leftward && !rightward) {
            fadeToAction(1, 0.2)
        }

        /**
         * Camera
         */
        updateCamera(state, delta, 2.25)

        const bodyPosition = body.current.translation()
        /**
        * Phases
        */
        if (bodyPosition.z < - (blocksCount * 4 + 2))
            end()

        if (bodyPosition.y < - 4)
            dead()
    })

    return <RigidBody
        ref={body}
        canSleep={false}
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
        position={[0, 0, 0]}
        colliders="hull"
        rotation={[0, Math.PI, 0]}
    >
        <primitive
            object={korrigan.scene}
            ref={primitive}
        />
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.4, 0.002, 0.4]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    </RigidBody>
}