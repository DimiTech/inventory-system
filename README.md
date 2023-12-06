Live demo: http://dusandimitric.com/refresh-rate-independent-game-loop-poc/

With insights from: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame, especially this part:

> Warning: Be sure to always use the first argument (or some other method for
> getting the current time) to calculate how much the animation will progress
> in a frame, otherwise the animation will run faster on high refresh rate
> screens. Check the example below for a way to do this. 

### Controls: `w` `a` `s` `d`,`arrow keys`
