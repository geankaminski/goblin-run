import React from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import useGame from '../stores/useGame.jsx'

export default function Model() {
    const { nodes, materials } = useGLTF('/models/star.gltf')
    const blocksCount = useGame((state) => state.blocksCount)
    const maxBlocks = useGame((state) => state.maxBlocks)
    const phase = useGame(state => state.phase)

    return (phase === 'ended' && blocksCount === maxBlocks && Array.from({ length: 300 }, (_, i) =>
        <RigidBody key={i} type="Dynamic"
            position={[Math.random() * 4 - 2, 3, - (blocksCount + 1) * 4]} scale={[0.1, 0.1, 0.1]}
        >
            <group>
                <mesh geometry={nodes.star.geometry} material={materials['Yellow.030']} />
            </group>
        </RigidBody>
    ))
}