sampleRate = {{sampleRate}}
t = 0
dt = {{ratio}}/sampleRate
tau = 2 * Math.PI
bpm = 60
_perlin = new SimplexNoise()           
# Waves
check_t = (_t) -> if _t isnt undefined then t+_t else t
sin = (f, a, _t) -> a * Math.sin tau * f * check_t(_t)
saw = (f, a, _t) -> (1 - 2 * tmod(f, _t)) * a
tmod = (f, _t) -> check_t(_t) % (1 / f) * f
tri = (f, a, _t) -> ttri(f, _t) * a
ttri = (f, _t) -> Math.abs(1 - (2 * check_t(_t) * f) % 2 * 2 - 1)
perlin1D = (wave, f, a, args...) -> wave(f, a, t+_perlin.noise(args[0],0))
perlin2D = (wave, f, a, args...) -> wave(f, a, t+_perlin.noise(args[0],args[1]))
perlin3D = (wave, f, a, args...) -> wave(f, a, t+_perlin.noise3d(args[0],args[1],args[2]))
# Exposed Methods
@reset = -> t = 0
@update = -> t += dt
@isSetup = false
