window.addEventListener "DOMContentLoaded", ->
        AudioContext = window.AudioContext || window.webkitAudioContext
        window.context = new AudioContext()
        instance = null
        wavepot =
        results = []
        runtime = new WavepotRuntime
                context: window.context,
                element: document.getElementsByClassName("wavepot")[0]
                ratio: 1.0,
                oneliner: false,
                environment: {{environment}}
