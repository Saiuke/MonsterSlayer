/* var startScreenAudio = new Audio('sound/echo.ogg'); */
new Vue({
    el: '#app',
    data: {
        gameStatus: 'disclaimer',
        backgroundAudio: new Array(),
        blurFilter: true,
        audioTracks: ["sound/battle.mp3", "sound/dungeon.wav", "sound/echo.ogg"],
        playList: new Array(),
        healthHuman:0,
        healthComputer:0,
        muted: false,
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
                this.loopPlay(echoSound);
                this.loopPlay(dungeonSound);
            } else if (this.gameStatus == 'playStage') {
                this.loopPlay(battleSound);
                battleSound.volume = 0.25;
            }
        },

        muted(){
            if (this.muted) {
                this.backgroundAudio.forEach(element => {
                    element.pause();
                });
            }else{
                this.backgroundAudio.forEach(element => {
                    element.play();
                });
            }
        }
    },
    mounted() {},
    created: function () {
        this.buildPlayList();
    },
    methods: {

        /* Background soundtracks and sound effects */

        loopPlay(audioTrack) {
            if (audioTrack) {
                audioTrack.play();
                audioTrack.loop = true;
                this.backgroundAudio.push(audioTrack);
            }
        },

        buildPlayList() {
            this.audioTracks.forEach(element => {
                trackName = element.substring(element.indexOf('/') + 1);
                trackName = trackName.substring(0, trackName.indexOf('.'));
                this.playList[trackName] = new Audio(element);
            });
        },

        /* HP monitoring and controller */
        
        heartMonitorHuman(){
            return {
				width: this.healthHuman + '%'
			}
        },

        heartMonitorComputer(){
            return {
				width: this.healthComputer + '%'
			}
        }
    }
});