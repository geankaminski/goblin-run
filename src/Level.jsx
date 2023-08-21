import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'
import { useTexture } from "@react-three/drei"
import useGame from './stores/useGame.jsx'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

export function BlockStart({ position = [0, 0, 0] }) {
    const [colorMap, normalMap, roughnessMap, aoMap, displacementMap] = useTexture([
        'Stylized_Grass_001_basecolor.jpg',
        'Stylized_Grass_001_normal.jpg',
        'Stylized_Grass_001_roughness.jpg',
        'Stylized_Grass_001_ambientOcclusion.jpg',
        'Stylized_Grass_001_height.png',
    ])

    return <group position={position}>
        <Float floatIntensity={0.25} rotationIntensity={0.25}>
            <Text
                font="/bebas-neue-v9-latin-regular.woff"
                scale={0.5}
                maxWidth={0.25}
                lineHeight={0.75}
                textAlign="right"
                position={[0.75, 0.65, 0]}
                rotation-y={- 0.25}
            >
                Goblin Race
                <meshBasicMaterial toneMapped={false} />
            </Text>
        </Float>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                map={colorMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
                displacementMap={displacementMap}
            />
        </mesh>
    </group>
}

export function BlockEnd({ position = [0, 0, 0] }) {
    const korriganFemale = useGLTF('/korrigan-taning.gltf')
    let mixer
    let actions = []

    if (korriganFemale.animations.length > 0) {
        mixer = new THREE.AnimationMixer(korriganFemale.scene)
        korriganFemale.animations.forEach((clip) => {
            actions.push(mixer.clipAction(clip))
        })
        actions[0].play()
    }

    korriganFemale.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    useFrame((state, delta) => {
        mixer?.update(delta)
    })

    return <group position={position}>
        <Text
            font="/bebas-neue-v9-latin-regular.woff"
            scale={1}
            position={[0, 2.25, 2]}
        >
            FINISH
            <meshBasicMaterial toneMapped={false} />
        </Text>

        <mesh geometry={boxGeometry} material={floor1Material} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody type="fixed" colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
            <primitive object={korriganFemale.scene} scale={1} />
        </RigidBody>
    </group>
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const [colorMap, normalMap, roughnessMap, aoMap, displacementMap] = useTexture([
        'Stylized_Grass_001_basecolor.jpg',
        'Stylized_Grass_001_normal.jpg',
        'Stylized_Grass_001_roughness.jpg',
        'Stylized_Grass_001_ambientOcclusion.jpg',
        'Stylized_Grass_001_height.png',
    ])

    const obstacle = useRef()
    const restart = useGame((state) => state.restart)
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    const handleContact = (payload) => {
        restart()
    }

    return <group position={position}>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                displacementScale={0.2}
                map={colorMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
                displacementMap={displacementMap}
            />
        </mesh>

        <RigidBody onContactForce={(payload) => handleContact(payload)} ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>
    </group>
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const [colorMap, normalMap, roughnessMap, aoMap, displacementMap] = useTexture([
        'Stylized_Grass_001_basecolor.jpg',
        'Stylized_Grass_001_normal.jpg',
        'Stylized_Grass_001_roughness.jpg',
        'Stylized_Grass_001_ambientOcclusion.jpg',
        'Stylized_Grass_001_height.png',
    ])

    const obstacle = useRef()
    const restart = useGame((state) => state.restart)
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    const handleContact = (payload) => {
        restart()
    }

    return <group position={position}>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                displacementScale={0.2}
                map={colorMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
                displacementMap={displacementMap}
            />
        </mesh>
        <RigidBody onContactForce={(payload) => handleContact(payload)} ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>
    </group>
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const [colorMap, normalMap, roughnessMap, aoMap, displacementMap] = useTexture([
        'Stylized_Grass_001_basecolor.jpg',
        'Stylized_Grass_001_normal.jpg',
        'Stylized_Grass_001_roughness.jpg',
        'Stylized_Grass_001_ambientOcclusion.jpg',
        'Stylized_Grass_001_height.png',
    ])

    const obstacle = useRef()
    const restart = useGame((state) => state.restart)
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    })

    const handleContact = (payload) => {
        restart()
    }

    return <group position={position}>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                displacementScale={0.2}
                map={colorMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
                displacementMap={displacementMap}
            />
        </mesh>
        <RigidBody onContactForce={(payload) => handleContact(payload)} ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
        </RigidBody>
    </group>
}

function Bounds({ length = 1 }) {
    return <>
        <RigidBody type="fixed" restitution={0.2} friction={0}>
            <mesh
                position={[2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                castShadow
            />
            <mesh
                position={[- 2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                receiveShadow
            />
            <mesh
                position={[0, 0.75, - (length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow
            />
            <CuboidCollider
                type="fixed"
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, - (length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>
}

export function Level({
    count = 5,
    types = [BlockSpinner, BlockAxe, BlockLimbo],
    seed = 0
}) {
    const blocks = useMemo(() => {
        const blocks = []

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        return blocks
    }, [count, types, seed])

    return <>
        <BlockStart position={[0, 0, 0]} />

        {blocks.map((Block, index) => <Block key={index} position={[0, 0, - (index + 1) * 4]} />)}

        <BlockEnd position={[0, 0, - (count + 1) * 4]} />

        <Bounds length={count + 2} />
    </>
}