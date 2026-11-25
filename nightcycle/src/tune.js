// Every number that shapes how the game plays lives here.
// Units: metres, seconds, radians. Battery and bin are in percent.

export const T = {
  // Robot body and camera
  radius: 0.17,            // collision circle
  bodyHeight: 0.09,        // furniture with more clearance than this can be driven under
  camHeight: 0.11,
  camForward: 0.1,
  fov: 76,                 // vertical, degrees
  pitchMin: -0.35,
  pitchMax: 0.62,

  // Driving
  maxSpeed: 1.3,
  reverseSpeed: 0.55,
  accel: 3.0,
  brake: 5.0,
  turnSpeed: 2.5,
  turnAccel: 14,
  mouseTurn: 0.0022,       // radians per pixel at sensitivity 1
  mousePitch: 0.0016,
  bumpCooldown: 0.3,
  bumpMinSpeed: 0.35,

  // Cleaning
  cleanRadius: 0.26,       // the side brushes reach a little past the body
  cleanRate: 7,            // dirt removed per second from each cell under the brush
  pickupRadius: 0.27,
  binFillShare: 0.55,      // a full bin holds this share of the dirt in the scheduled rooms
  binPerItem: 1.5,

  // Battery, percent per second
  drainBase: 0.06,
  drainMove: 0.12,         // at full speed
  drainSuction: 0.09,
  drainLight: 0.1,
  scanCost: 2.5,           // per scan
  chargeRate: 9,
  batteryLow: 20,
  respawnBattery: 60,      // battery is topped up to at least this on a retry

  // Lidar
  scanCooldown: 5,
  scanRange: 10,
  scanLife: 4,
  scanWaveSpeed: 9,

  // Noise radii in metres. Sound through a wall counts as `occlusion` times farther.
  noiseDrive: 2.2,
  noiseSuction: 6.5,
  noiseBump: 5.5,
  occlusion: 1.7,

  // The thing in the house
  entRadius: 0.28,
  entPatrolSpeed: 0.75,
  entInvestigateSpeed: 1.05,
  entChaseSpeed: 1.7,
  entTurn: 3.0,
  entFov: 1.15,            // half-angle of its sight cone
  entSeeLit: 9,            // how far it sees the robot with the headlamp on
  entSeeDark: 2.3,         // ...and with it off
  entNotice: 0.9,          // seconds of clear sight before it gives chase (less up close)
  entLitNotice: 1.2,       // seconds of headlamp in its face before it turns on you
  entLoseTime: 2.8,        // seconds out of sight before a chase becomes a search
  entCatch: 0.55,
  entSearchMin: 6,         // seconds it stands over the place you hid (random between these)
  entSearchMax: 14,
  entFeintChance: 0.35,    // ...then, sometimes, it walks off and comes straight back
  entReach: 1.3,           // how far its arm gets along the floor under furniture, from where it stands
  entReachHear: 2.2,       // noise from under cover this close to it makes it reach
  entGrace: 20,            // after it first appears it is half-deaf and avoids your room

  // The robot gives itself away
  noiseVoice: 5,           // spoken prompts ("Battery low...")
  noisePing: 6,            // a LIDAR scan
  noiseCrunch: 3.5,        // sucking up dog food
  dockCapture: 0.42,       // inside this, the robot is pulled onto the dock and turned the right way
  dockRadius: 0.2,

  // Tasks
  roomTarget: 0.65,
  hallTarget: 0.6,
  printsTarget: 0.9,

  // Clock: game minutes per real second
  clockRate: 0.1,
};
