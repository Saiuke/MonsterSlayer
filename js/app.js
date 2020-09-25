/* var startScreenAudio = new Audio('sound/echo.ogg'); */
new Vue({
    el: '#app',
    data: {
        gameStatus: 'disclaimer',
        backgroundAudio: null,
        blurFilter: true,
    },
    computed: {
        flipBlur() {
            if (this.gameStatus != 'disclaimer') {
                return this.blurFilter = false;
            } else {
                return true;
            }
        }
    },
    watch: {

    },
    mounted() {
        if (this.gameStatus == 'startScreen') {
            this.backgroundAudio = document.getElementById('dungeonEcho');
            this.startScreenPlayback();
        }
    },
    created() {

    },
    methods: {

        /* Background soundtracks and sound effects */

        startScreenPlayback() {
            if (this.gameStatus == 'startScreen') {
                console.log(this.backgroundAudio);
                this.backgroundAudio.loop = true;
                this.backgroundAudio.play();
                console.log('Audio playing');
            }
        }
    }
});