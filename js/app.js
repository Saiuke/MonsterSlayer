/* var startScreenAudio = new Audio('sound/echo.ogg'); */
new Vue({
    el: '#app',
    data: {
        //gameStatus: 'disclaimer', //Status of the app, it can be (so far) 'disclaimer', 'startScreen', 'playStage', 'looseScreen', 'wonScreen', 'menuScreen'
        gameStatus: 'playStage',
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
        humanStatus: true, //Defines if the human player is dead or alive
        computerStatus: true, //Defines if the computer player is dead or alive

        /* Collection of string that are outputed when a avatar dies */
        humanDiesPhrases: [
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
            "You're not very good at this are you? Have you ever considered trying gardening?"
        ],
        computerDiesPhrases: [
            "You've just killed it! Or should I say him? Or her? You didn't ask, did you? How considerate of you.",
            "GG mah boy, keep it like this and I'm sure you're going places. Maybe...",
            "Wow that was 2 minutes less of your life, how does it feel? You're not having those back... Are you still reading?",
            "Oh my, my... Why such violence? Have you considered petting it? Maybe it was just saying hello. Weirdo.",
            "Well, it's dead. Now what? Are you going to eat it? Of course not silly, this is just a game. Back to being productive",
            "AM I being nosy or you should be doind something else instead? I mean, killing virtual monsters?",
            "Good kill dude! But, have you considered that it maybe was the last of its kind? That's disturbing.",
            "You've just killed the creature! Good for you girl!",
            "Wait! Have you considered trying to... Forget it, it's dead already",
            "Oh man! (or woman!). That was gruesome. Wait a minute, have you just farted? Ewww! Ohh sorry, that one was mine.",
            "Why did you do that? Such violence. Well you killed it, just like that. That's aliens haven't made contact with us yet...Savage!"
        ],
        humanParts: [
            "groin", "left eye", "upper lip", "right ear", "left leg", "tiny finger", "balls", "right knee", "face", "head", "lung", "chest", "chin", "middle finger", "you know where", "neck", "nose", "foot", "ribs", "teeth",
        ],
        monsterParts: [
            "center most tentacle", "foremost tooth", "tiny tentacle", "lady parts", "boy parts", "gum", "ass", "iris", "eyeball", "feelings", "wise tooth"
        ],
        fightingMovements: [
            "bite", "slapped", "punched", "kicked", "headbutted", "scratched", "hit", "punctured", "fingered", "poundded", "bashed"
        ],
        countDownNumbers: 5,
        countDown: '',
        countDownTextSize: 100,
        logger: new Array(), //Array responsible for storing all messages that will be shown to the player

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

        /* Health checkers // Killer */

        healthHuman() {
            if (this.healthHuman >= 100) {
                this.healthHuman = 100;
                this.humanStatus = false;
                this.humanDied();
            }
        },

        healthComputer() {
            if (this.healthComputer >= 100) {
                this.healthComputer = 100;
                this.computerStatus = false;
                this.computerDied();
            }
        },

        /* Logger Wachter  - Maintain only the last 3 elements of the logger */

        logger() {
            if (this.logger.length > 3) {
                this.logger.pop();
            }
        },


        /* Countdown Watcher */

        countDownNumbers() {
           if (this.countDownNumbers == 0) {
               clearInterval(this.countDown);
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

        /*
         HP monitoring and controller
         These two functions return the css property 'width' of the health bars.
         */

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
            var hit = Math.round(Math.random() * 20);
            return hit;
        },

        /* Controlls the timer before the fight */

        timerFight() {

        },

        /* Hits the human */

        hitHuman() {
            if (this.healthHuman < 100) {
                var willHitPoints = Math.floor(this.hitGenerator() * 1.1); //Gives the monster 10% more attack power on average
                this.healthHuman += willHitPoints;
                this.logHandler('You got ' + this.randomFightingMoves() + ' on the ' + this.humanHitDesc() + ' and lost ' + willHitPoints + ' HP');


            } else {
                this.humanDied();
            }
        },

        /* Hits the computer */

        hitComputer() {
            if (this.healthComputer < 100) {
                var willHitPoints = this.hitGenerator();
                this.healthComputer += willHitPoints;
                this.logHandler('You ' + this.randomFightingMoves() + ' the monster\'s ' + this.monsterHitDesc() + ' and it lost ' + willHitPoints + ' HP');

                //Hits the human player back

                this.hitHuman();

            } else {
                this.computerDied();
            }
        },

        /* Shows phrases regarding the avatar's deaths */

        humanDied() {
            if (this.humanStatus == false) {
                var deathMessage = Math.round(Math.random() * 10);
                this.logHandler(this.humanDiesPhrases[deathMessage]);
                this.logHandler("You died!");
                setTimeout(() => {
                    this.resetGame();
                }, 3000);
            }
        },

        computerDied() {
            if (this.computerStatus == false) {
                var deathMessage = Math.round(Math.random() * 10);
                this.logHandler(this.computerDiesPhrases[deathMessage]);
                this.logHandler("You win?");
                setTimeout(() => {
                    this.resetGame();
                }, 3000);
            }
        },

        /* Generates a random key to be used with a dictionary of log messages */

        keyGen() {
            return '_' + Math.random().toString(36).substr(2, 9);
        },

        /* Creates a dictionary with all log messages generated by the app */

        logHandler(msg) {
            var newLog = {
                id: this.keyGen(),
                message: msg,
            };
            this.logger.unshift(newLog);
        },

        /* Random hits generators */

        humanHitDesc() {
            randomNumber = Math.round(Math.random() * 20);
            return this.humanParts[randomNumber];
        },

        monsterHitDesc() {
            randomNumber = Math.round(Math.random() * 10);
            return this.monsterParts[randomNumber];
        },

        randomFightingMoves() {
            randomNumber = Math.floor(Math.random() * 10);
            return this.fightingMovements[randomNumber];
        },

        resetGame() {
            this.logger = [];
            this.healthHuman = 0;
            this.humanStatus = true;
            this.healthComputer = 0;
            this.computerStatus = true;
            this.startTimer();
        },

        /* Countdown timer before fight */

        startTimer() {
            if (this.countDownNumbers > 0) {
                this.countDown = setInterval(() => {
                    this.countDownNumbers--;
                    this.downSizeCounterFont();
                }, 1000);
            }
        }

    }
});