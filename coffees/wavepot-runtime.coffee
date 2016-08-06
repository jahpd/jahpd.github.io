class WavepotRuntime
        constructor: (o) ->
                @config = o;
                @scope = new Object();
                @config.environment.apply @scope
                @node = o.context.createScriptProcessor({{bufferSize}}, 0, {{channels}});
                that = this;
                @node.onaudioprocess = (e) ->
                        # decrement is faster than increment
                        l = {{bufferSize}} - 1
                        i = l
                        result = 0
                        if not that.scope.isSetup
                                that.scope.setup()
                                that.scope.isSetup = not that.scope.isSetup;
                
                        L = e.outputBuffer.getChannelData(0)
                        R = e.outputBuffer.getChannelData(1)
                        for i in [l-1..0] by -1
                                if that.scope.isSetup and that.playing
                                        result = that.scope.dsp();
                                        # A liitle option to bytebeat
                                        if that.config.oneliner
                                                result %= that.config.context.sampleRate/4 || 32;
                                                result /= that.config.context.sampleRate/2 || 64;
                      
                                        L[l-i] = result[0] or result
                                        R[l-i] = result[1] or result
                                        that.scope.update();
                                else
                                        L[l-i] = result[0] or result
                                        R[l-i] = result[0] or result

                @node.connect(this.config.context.destination)
                @config.element.getElementsByClassName('play')[0].addEventListener 'click', -> that.playing = true
                @config.element.getElementsByClassName('pause')[0].addEventListener 'click', -> that.playing = false
                @config.element.getElementsByClassName('reset')[0].addEventListener 'click', ->
                        that.scope.reset()
                        that.scope.setup()
