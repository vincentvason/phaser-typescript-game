import 'phaser';

let SCREEN_WIDTH: number = 480;
let SCREEN_HEIGHT: number = 500;

// Board (1 for O, -1 for X)
let PLAYER_O: number = 1;
let PLAYER_X: number = -1;
let RESET: number = 0;
let WIN_O: number = 2;
let WIN_X: number = -2;
 
class PlayGame extends Phaser.Scene {
    board_logic : number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    board_sprite: Phaser.GameObjects.Sprite[] = [];
    reset_button : Phaser.GameObjects.Text;
    image: Phaser.GameObjects.Image;

    turn : number = 0;
    change_turn : boolean = true;
    win : boolean = false;
    
    
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image('button_default', 'asset/button_default.png');
        this.load.image('button_disabled', 'asset/button_disabled.png');  
        this.load.image('button_hover_o', 'asset/button_hover_o.png');
        this.load.image('button_hover_x', 'asset/button_hover_x.png');   
        this.load.image('button_select_o', 'asset/button_select_o.png');   
        this.load.image('button_select_x', 'asset/button_select_x.png');   
        this.load.image('button_win_o', 'asset/button_win_o.png');
        this.load.image('button_win_x', 'asset/button_win_x.png');    
    }
    
    create() {
        //Make 3x3 Grid
        for(let i = 0; i < 9; i++){
            this.board_sprite[i] = this.addSprite(Math.floor(i/3), i%3);
        }
        this.reset_button = this.add.text(SCREEN_WIDTH / 2 - 20, 480, 'RESET', { fontSize: 24, align: 'center', fontStyle: 'strong'});
        this.reset_button.setInteractive();
        this.reset_button.on('pointerdown',() => {
            this.win = false;
            this.change_turn = true;
            for(let i = 0; i < 9; i++){
                this.board_sprite[i].setTexture('button_default');
                this.board_logic[i] = RESET;
                this.board_sprite[i].setInteractive();   
            }
        });
    
    }
    
    update() {
        if(this.win == false){
            this.playerMove();
        }
        else{
            this.showResult();
        }
        
    }

    //Create Image
    public addSprite(x: number, y: number) : Phaser.GameObjects.Sprite{
        let sprite : Phaser.GameObjects.Sprite;
        sprite = this.add.sprite(80 + (160 * x), 80 + (160 * y), 'button_default');
        return sprite;
    }

    //Player Move
    public playerMove() : void{
        for(let i = 0; i < 9; i++){
            this.board_sprite[i].setInteractive();
            this.board_sprite[i].on('pointerover',() => {
                if(this.board_logic[i] == RESET){
                    if(this.turn % 2 == 0){
                        this.board_sprite[i].setTexture('button_hover_o');
                    }
                    else
                    {
                        this.board_sprite[i].setTexture('button_hover_x');
                    }
                }
            });
            this.board_sprite[i].on('pointerout',() => {
                if(this.board_logic[i] == RESET){
                    this.board_sprite[i].setTexture('button_default');
                }
                else if(this.board_logic[i] == PLAYER_O){
                    this.board_sprite[i].setTexture('button_select_o');
                }
                else if(this.board_logic[i] == PLAYER_X){
                    this.board_sprite[i].setTexture('button_select_x');
                }
                this.change_turn = true;
            });
            this.board_sprite[i].on('pointerdown',() => {
                if(this.board_logic[i] == RESET && this.change_turn == true){
                    if(this.turn % 2 == 0){
                        this.board_sprite[i].setTexture('button_select_o');
                        this.board_logic[i] = PLAYER_O;
                    }
                    else
                    {
                        this.board_sprite[i].setTexture('button_select_x');
                        this.board_logic[i] = PLAYER_X;
                    }
                    this.checkWin();
                    this.turn++;
                    // console.log(`Turn:${this.turn}`);
                    // console.log(`Space:${this.board_logic}`);
                    // console.log(`Win:${this.win}`);
                }
                this.change_turn = false;
            });
        }
    }

    //Player Move
    public checkWin() : void{
        //check row win
        for(let i = 0; i < 3; i++){
            if(this.board_logic[i*3] == this.board_logic[(i*3)+1] && this.board_logic[(i*3)+1] == this.board_logic[(i*3)+2] && this.board_logic[(i*3)+2] != 0){
                this.board_logic[i*3] *= 2;
                this.board_logic[(i*3)+1] *= 2;
                this.board_logic[(i*3)+2] *= 2;
                this.win = true;
            }
        }
        //check col win
        for(let i = 0; i < 3; i++){
            if(this.board_logic[i] == this.board_logic[i+3] && this.board_logic[i+3] == this.board_logic[i+6] && this.board_logic[i+6] != 0){
                this.board_logic[i] *= 2;
                this.board_logic[i+3] *= 2;
                this.board_logic[i+6] *= 2;
                this.win = true;
            }
        }
        //check diag win
        if(this.board_logic[0] == this.board_logic[4] && this.board_logic[4] == this.board_logic[8] && this.board_logic[8] != 0){
            this.board_logic[0] *= 2;
            this.board_logic[4] *= 2;
            this.board_logic[8] *= 2;
            this.win = true;
        }
        if(this.board_logic[2] == this.board_logic[4] && this.board_logic[4] == this.board_logic[6] && this.board_logic[6] != 0){
            this.board_logic[2] *= 2;
            this.board_logic[4] *= 2;
            this.board_logic[6] *= 2;
            this.win = true;
        }
    }

    public showResult() : void{
        for(let i = 0; i < 9; i++){
            if(this.board_logic[i] == WIN_O){
                this.board_sprite[i].setTexture('button_win_o');
            }
            else if(this.board_logic[i] == WIN_X){
                this.board_sprite[i].setTexture('button_win_x');
            }
            else{
                this.board_sprite[i].setTexture('button_disabled');
            }
            this.board_sprite[i].disableInteractive();
        }
    }
 }
 
 let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    scene: PlayGame
 };
 
new Phaser.Game(configObject);