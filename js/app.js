/* var startScreenAudio = new Audio('sound/echo.ogg'); */
new Vue({
    el: '#app',
    data: {
        gameStatus: 'disclaimer', //Status of the app, it can be (so far) 'disclaimer', 'startScreen', 'playStage', 'looseScreen', 'wonScreen', 'menuScreen'
        backgroundAudio: new Array(), //Array of current playing background sounds
        blurFilter: true, //Blur shown at the start of the app
        audioTracks: ["sound/battle.mp3", "sound/dungeon.wav", "sound/echo.ogg"], //List of file in the folder 'sound'
        playList: new Array(), //Array with a collection of Audio objects that are playable
        /* 
        The health points function in an inverse way. The subject dies when it reaches 100
        The health bar div width % is calculated subtracting the current health of the avatar of 100. 
        */
        healthHuman: 0, 
        healthComputer: 0,
        muted: false, //Obviously determines if the audio is activated or not
        hitTimer: null, //This variable stores the timer that reduces the health bar div. This is made using a timer so that the transition is smoother.
        hitCounter: 0, //How many hit points the function has dealt in this turn
        willHitPoints: 0, //How many hit points the function has to deal before next turn
        humanStatus: true, //Defines if the human player is dead or alive
        computerStatus: true, //Defines if the computer player is dead or alive

        /* Collection of string that are outputed when a avatar dies */
        humanDiesPhrases =
        [
            "You've just been killed and that's why you're seeing your own life flash in front of you.",
            "It's almost as if your soul has taken over your body in a frantic attempt to preserve the memory of what you love.",
            "The problem is that when your soul leaves your body, it's physically incapable of going back in and if it doesn't try to go back in and make the same decision, it could start experiencing the same things all over again.",
            "That was sad and gruesome and an almost poetic way. Anyway, you're dead. The rats are anxious to eat your remains.",
            "Looks like the monster will be eating something besides rats today",
            "Woow! That must have hurted! Dude! Are you okay? Dude? Dude... Ohh, you're dead. Sorry about that",
            "Your death looks like an abstract painting. To me, not for you. For you that must have hurted like hell.",
            "Yep! Looks like you're dead. Can I have your sowrd?",
            "You died! Was killed to be more exact. Now your opponent drags you to one of many dark pits inside the dungeon.",
            "Oh my god, how can you suck in such idiotic game? I know that the game is lame, but you just raised the bar fella.",
        ],
        computerDiesPhrases =
        [
            "You've just killed it! Or should I say him? Or her? You didn't ask, did you? How considerate of you.",
            "GG mah boy, keep it like this and I'm sure you're going places. Maybe...",
            "Wow that was 2 minutes less of your life, how does it feel? You're not having those back... Are you still reading?",
            "Oh my, my... Why such violence? Have you considered petting it? Maybe it was just saying hello. Weirdo.",
            "Well, it's dead. Now what? Are you going to eat it? Of course not silly, this is just a game. Back to being productive",
            "Is it me being nossy or you should be doind something else instead? I mean, killing virtual monsters?",
            "Good kill dude! But, have you considered that it maybe was the last of its kind? That's disturbing.",
            "You've just killed the creature! Good for you girl!",
            "Wait! Have you considered trying to... Forget it, it's dead already",
            "Oh man! (or woman!). That was gruesome. Wait a minute, have you just farted? Ewww! Ohh sorry, that one was mine."
        ],
    },
    computed: {

        /* Unset the blur when the disclaimer modal goes away */

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

        muted() {
            if (this.muted == true) {
                this.backgroundAudio.forEach(element => {
                    element.pause();
                });
            } else {
                this.backgroundAudio.forEach(element => {
                    element.play();
                });
            }
        },

        /* Hit Timers */

        /* This function makes sure that the health bar don't go further than the hit points generated. To do so the function stops the hitTimer */

        hitCounter() {
            if (this.hitCounter == this.willHitPoints) {
                clearInterval(this.hitTimer);
                this.clearHitter();
            }
        },

        /* Health checkers // Killer */

        healthHuman() {
            if (this.healthHuman >= 100) {
                this.humanStatus = false;
                //Nulls the remaining hit points and hit counter
                clearInterval(this.hitTimer);
                this.clearHitter();
                this.humanDied();
            }
        },

        healthComputer() {
            if (this.healthComputer >= 100) {
                this.computerStatus = false;
                //Nulls the remaining hit points and hit counter
                clearInterval(this.hitTimer);
                this.clearHitter();
                this.computerDied();
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

        heartMonitorHuman() {
            return {
                width: this.healthHuman + '%'
            }
        },

        heartMonitorComputer() {
            return {
                width: this.healthComputer + '%'
            }
        },
        /* Generates random hit points */
        hitGenerator() {
            var hit = Math.round(Math.random() * 10);
            return hit;
        },

        /* Hits the human */
        hitHuman() {
            if (this.healthHuman < 100 && this.hitTimer == null) {
                var hitPoints = this.hitGenerator();
                this.willHitPoints = hitPoints;

                /* This particular snippet makes the health bar lower in a smooth way */

                this.hitTimer = setInterval(() => {
                    this.hitCounter++;
                    this.healthHuman++;
                }, 50);
                console.log('Human got hit and lost: ' + hitPoints + ' hit points.');
            } else {
                if (this.humanStatus == false) {
                    console.log("That's dead meat, there is no point beating it anymore.");
                    this.humanDied();
                } else {
                    console.log("Savage, just savage!");
                }
            }
        },

        //Hits the computer
        hitComputer() {
            if (this.healthComputer < 100 && this.hitTimer == null) {
                var hitPoints = this.hitGenerator();
                this.willHitPoints = hitPoints;

                /* This particular snippet makes the health bar lower in a smooth way */

                this.hitTimer = setInterval(() => {
                    this.hitCounter++;
                    this.healthComputer++;
                }, 50);
                console.log('The "monster" got hit and lost: ' + hitPoints + ' hit points.');
            } else {
                if (this.computerStatus == false) {
                    console.log("You've just killed it, there is no point beating it anymore, or maybe you're the real monster here.");
                    this.computerDied();
                } else {
                    console.log("You're too tired, take a breath and recover some energy before hitting again you potato's sack");
                }
            }
        },

        //Clears the hitCounter and hitTimer

        clearHitter() {
            this.willHitPoints = 0;
            this.hitCounter = 0;
            this.hitTimer = null;
        },

        /* Shows phrases regarding the avatar's deaths */

        humanDied() {
            if (this.humanStatus == false) {
                console.log('You are dead, like your dreams.');
            }
        },

        computerDied() {
            if (this.computerStatus == false) {
                console.log('You killed him, or her, as always you did not ask.');
            }
        }

    }
});