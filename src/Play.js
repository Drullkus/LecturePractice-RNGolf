class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // score
        this.shots = 0;
        this.holes = 0;

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0);

        // add cup
        this.cup = this.physics.add.sprite(width * 0.5, height * 0.1, 'cup' );
        this.cup.body.setCircle(this.cup.width * 0.25);
        this.cup.body.setOffset(this.cup.width * 0.25);
        this.cup.body.setImmovable(true);
        
        // add ball
        this.ball = this.physics.add.sprite(width * 0.5, height * 0.85, 'ball');
        this.ball.body.setCircle(this.ball.width * 0.5);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        const wallA = this.physics.add.sprite(0, height * 0.25, 'wall');
        wallA.setX(Phaser.Math.Between(0 + wallA.width * 0.5, width - wallA.width * 0.5));
        wallA.setCollideWorldBounds(true, 1);
        wallA.setVelocityX(100).setPushable(false); // Make move sideways but never pushable

        const wallB = this.physics.add.sprite(0, height * 0.5, 'wall');
        wallB.setX(Phaser.Math.Between(0 + wallB.width * 0.5, width - wallB.width * 0.5));
        wallB.body.setImmovable(true);

        this.walls = this.add.group([ wallA, wallB ]);

        // add one-way
        this.oneWay = this.physics.add.sprite(width * 0.5, height * 0.25 * 3, 'oneway');
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width * 0.25, width - this.oneWay.width * 0.5));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            const shootDeltaX = this.ball.x - pointer.x;
            const shootDeltaY = this.ball.y - pointer.y;
            const shootDirection = new Phaser.Math.Vector2(shootDeltaX, shootDeltaY).normalize();

            this.ball.body.setVelocityX(shootDirection.x * this.SHOT_VELOCITY_X);
            // Keep RNG element by still randomizing instead of deferring to precise vector maths, funny moral defect in mechanics
            this.ball.body.setVelocityY(shootDirection.y * Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX));
            this.shotCounterText.text = ++this.shots;
            this.updateRatio();
        });

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, _cup) => {
            ball.setX(width * 0.5);
            ball.setY(height * 0.85);
            ball.setVelocity(0);
            this.holesText.text = ++this.holes;
            this.updateRatio();
        });

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls);

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay);

        // score metrics
        const textConfig = {
            color: '#FACADE',
            fontSize: '42px',
        };
        const metricsHeight = height - 50;
        const left = 0, center = 0.5, right = 1;
        this.shotCounterText = this.add.text(0, metricsHeight, this.shots, textConfig).setOrigin(left, 0).setStroke(0, 3);
        this.add.text(0, metricsHeight, "Shots", textConfig).setOrigin(left, 1).setStroke(0, 3);
        this.holesText = this.add.text(width * 0.5, metricsHeight, this.holes, textConfig).setOrigin(center, 0).setStroke(0, 3);
        this.add.text(width * 0.5, metricsHeight, "Holes", textConfig).setOrigin(center, 1).setStroke(0, 3);
        this.ratioText = this.add.text(width, metricsHeight, '0%', textConfig).setOrigin(right, 0).setStroke(0, 3);
        this.add.text(width, metricsHeight, "Ratio", textConfig).setOrigin(right, 1).setStroke(0, 3);
    }

    update() {

    }

    updateRatio() {
        this.ratioText.text = `${Math.round(this.holes / this.shots * 100)}%`;
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/