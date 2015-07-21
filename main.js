(function() {
    'use strict';

    /* globals blocks, Game */
    var input;

    var size = [14, 20];
    var cellSize = 20;

    var main = {
        canvas: null,
        ctx: null,
        cells: null,
        speed: 250,
        lastUpdated: 0,

        init: function() {
            this.canvas = document.getElementById('game');
            this.ctx = this.canvas.getContext('2d');
            this.restart = this.restart.bind(this);
            this.start = this.start.bind(this);

            this.startScreen();
        },

        restart: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            window.removeEventListener('click', this.restart);
            this.game = new Game(size);
            this.draw(this.game.stage, this.game.block, this.ctx);
            this.update();
        },

        start: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.game = new Game(size);
            this.draw(this.game.stage, this.game.block, this.ctx);
            this.update();
            window.removeEventListener('click', this.start);
        },

        update: function() {
            if (this.game.block === null) {
                this.end();
                return;
            }

            this.game.update();
            this.draw(this.game.stage, this.game.block, this.ctx);

            if (Date.now() - this.lastUpdated < 200) {
                window.requestAnimationFrame(this.update.bind(this));
                return;
            }
            this.game.advance();
            this.lastUpdated = Date.now();

            window.requestAnimationFrame(this.update.bind(this));
        },

        end: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.gameOverScreen();
            window.addEventListener('click', this.restart);
        },


        draw: function(cells, block, context) {
            var colour;

            context.clearRect(0, 0, cells.length *cellSize, cells[0].length * cellSize);
            context.strokeStyle = 'black';
            context.strokeRect(0, 0, cells.length *cellSize, cells[0].length * cellSize);

            cells.forEach(function(row, x) {
                row.forEach(function(column, y){
                    colour = column === 0 ? 'transparent' : 'black';
                    context.fillStyle = colour;
                    context.fillRect(x*cellSize, y*cellSize, cellSize - 1, cellSize -1);
                });
            });

            if (!block) {
                return;
            }

            block.element().forEach(function(el){
                context.fillStyle = 'black';
                context.fillRect(el[0] * cellSize, el[1] * cellSize, cellSize - 1, cellSize - 1);
            });

            context.clearRect(this.canvas.width - (cellSize * 9), 0, cellSize * 8, cellSize * 5);
            context.fillStyle = 'black';
            context.fillText('Rows: ' + this.game.clearedRows, this.canvas.width - (cellSize * 5), cellSize);
            context.fillText('Score: ' + this.game.score, this.canvas.width - (cellSize * 5), cellSize * 2);
        },

        startScreen: function() {
            var center;
            center = [this.canvas.width/2, this.canvas.height/2];

            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'center';

            this.ctx.font = '36px sans-serif';
            this.ctx.fillText('Game Exercise 01', center[0], center[1]);

            this.ctx.font = '18px sans-serif';
            this.ctx.fillText('Left/right to move, up to rotate', center[0], center[1] + 35);

            this.ctx.fillRect(center[0] - 75, center[1] + 60, 150, 50);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px sans-serif';
            this.ctx.fillText('Click to play',
                              center[0],
                              center[1] + 87);
            window.addEventListener('click', this.start);
        },

        gameOverScreen: function() {
            var center;
            center = [this.canvas.width/2, this.canvas.height/2];

            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'center';
            this.ctx.font = '48px sans-serif';
            this.ctx.fillText('You lose', center[0], center[1]);

            this.ctx.fillRect(center[0] - 75, center[1] + 20, 150, 50);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px sans-serif';
            this.ctx.fillText('Click to play again',
                              center[0],
                              center[1] + 50);

        },

    };

    main.init();
}());
