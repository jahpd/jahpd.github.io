window.addEventListener "DOMContentLoaded", ->
        AudioContext = window.AudioContext or window.webkitAudioContext;
        if AudioContext and not window.context
                window.context = new AudioContext()
                wavepots = {}
                for wp in document.getElementsByClassName "wavepot"
                        id = wp.getAttribute "id"
                        wavepots[id] = new WavepotRuntime({context: window.context, channels: 2, bufferSize: 1024, ratio: 1.0, oneliner: false})
                        options =
                                'pause': ->
                                        wavepots[id].pause()
                                'play': ->
                                        text = wp.getElementsByTagName('pre')[0].innerHTML
                                        compiled = wavepots.compile text
                                        if compiled
                                                wavepots[id].play()
                                        else
                                                console.log "isn't possible to compile code"

                        for option,fn of options
                                wp.getElementsByClassName(option)[0].addEventListener 'click', fn
