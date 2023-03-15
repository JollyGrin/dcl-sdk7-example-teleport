import { engine, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
// export all the functions required to make the scene work
export * from '@dcl/sdk'

// container to hold Teleport
const Teleport = engine.defineComponent('teleport-id', {})

// hitbox of the teleport box
const transportBox = engine.addEntity()
Teleport.create(transportBox)
MeshRenderer.setBox(transportBox)
Transform.create(transportBox, { position: Vector3.create(2, 1, 2) })

const isPlayerNearBox = (playerPos: Vector3, boxPos: Vector3, hitRange: number) => {
  // Calculate the difference between the player position and the box position
  const diff = {
    x: Math.abs(playerPos.x - boxPos.x),
    y: Math.abs(playerPos.y - boxPos.y),
    z: Math.abs(playerPos.z - boxPos.z),
  };

  // Check if the difference is less than or equal to the given number in all dimensions
  return diff.x <= hitRange && diff.y <= hitRange && diff.z <= hitRange;
}

const transportSystem = () => {
  if (!Transform.get(engine.PlayerEntity)) return // prevents crash on first render

  const teleports = engine.getEntitiesWith(Teleport)
  for (const [entity] of teleports) {
    const boxPosition = Transform.getMutable(entity).position
    const playerPosition = Transform.get(engine.PlayerEntity).position

    const canTeleport = isPlayerNearBox(playerPosition, boxPosition, 1)
    if (canTeleport) {
      const mutablePlayerEntity = Transform.getMutable(engine.PlayerEntity)
      mutablePlayerEntity.position = Vector3.create(15, 0, 15)
    }
  }
}

engine.addSystem(transportSystem)