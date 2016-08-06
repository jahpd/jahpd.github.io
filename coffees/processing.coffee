(->
  #scripts = 
  #links = <link rel=\"stylesheet\" href=\"/assets/css/prism.css\" type=\"text/css\"/>
  for src in ['processing.min.js', 'p5.dom.min.js']
    script = document.querySelectorAll "[src='#{src}']"
    if script.length is 0
      _s = document.createElement('script')
      _s.setAttribute('type', 'text/javascript')
      _s.setAttribute('charset', 'utf8')
      _s.Attribute('src', src)
)()

compile = (code) -> CoffeeScript.compile code
        
window.addEventListener "DOMContentLoaded", ->
  scope = new Object()
  sketchContainer = document.getElementByClassName('p5')[0];
  cnv = sketchContainer.getElementByTagName('canvas')[0];

  
  sketch = document.getElementsByTagName('code')
  runnable = sketch.textContent.replace(/^\s+|\s+$/g, '')
  code = compile runnable
  fn = new Function compile code
  newscope = new Object()
  fn.call newscope
  s = (p)->
    if compiled
      if not scope.setup
        p.setup = ->
          p.createCanvas(640, 480)
          p.background(200)
              else if scope.setup
        p.setup = scope.setup
        p[method] = scope[method] for method in ['setup', 'draw', 'preload', 'mousePressed', 'mouseReleased', 'mouseMoved', 'mouseDragged', 'mouseClicked', 'mouseWheel', 'touchStarted', 'touchMoved', 'touchEnded', 'keyPressed', 'keyReleased', 'keyTyped'] when scope[method]
  p5 s,cnv

  

