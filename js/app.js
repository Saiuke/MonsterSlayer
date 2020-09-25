/* var startScreenAudio = new Audio('sound/echo.ogg'); */
new Vue({
    el: '#app',
    data: {
        gameStatus: 'disclaimer',
        backgroundAudio: null,
        blurFilter: true,
        audioTracks: ["sound/battle.mp3", "sound/dungeon.wav", "sound/echo.ogg"],
        playList: new Array(),
    },
    computed: {
        flipBlur() {
            if (this.gameStatus != 'disclaimer') {
                return this.blurFilter = false;
            } else {
                return true;
            }
        },
    },
    watch: {
        //Wacth the gameStatus and make changes accordingly
        gameStatus() {

            //Background Audio Controler

            //Tracks
            echoSound = this.playList['echo'];
            battleSound = this.playList['battle'];
            dungeonSound = this.playList['dungeon'];

            //Game status DJ
            if (this.gameStatus == 'startScreen') {
                echoSound.play();
                echoSound.loop = true;
                dungeonSound.play();
                dungeonSound.loop = true;
            } else if (this.gameStatus == 'playStage') {
                battleSound.play();
                battleSound.loop = true;
                battleSound.volume = 0.25;
            }
        }
    },
    mounted() {},
    created: function () {
        this.buildPlayList();
    },
    methods: {

        /* Background soundtracks and sound effects */

        playAudio(audioTrack) {
            if (audioTrack) {
                this.backgroundAudio = audioTrack;
                this.backgroundAudio.loop = true;
                this.backgroundAudio.play();
                console.log('Audio playing');
            }
        },
        buildPlayList() {
            this.audioTracks.forEach(element => {
                trackName = element.substring(element.indexOf('/') + 1);
                trackName = trackName.substring(0, trackName.indexOf('.'));
                this.playList[trackName] = new Audio(element);
            });
        },
    }
});