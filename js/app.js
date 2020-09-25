/* var startScreenAudio = new Audio('sound/echo.ogg'); */
new Vue({
    el: '#app',
    data: {
        gameStatus: 'startScreen',
        backgroundAudio:null,
    },
    computed: {

    },
    watch: {

    },
    mounted(){
        if (this.gameStatus == 'startScreen') {
            this.backgroundAudio = document.getElementById('dungeonEcho');
            this.startScreenPlayback();
        }
    },
    created(){
        
    },
    methods: {

        /* Background soundtracks and sound effects */

       startScreenPlayback(){
            if (this.gameStatus == 'startScreen') {
                console.log(this.backgroundAudio);
                this.backgroundAudio.loop = true;
            }
        }
        
        /* startSound(sound) {
            if (sound) {
                var audio = new Audio(sound);
                audio.play();
            }
        } */
    }
});