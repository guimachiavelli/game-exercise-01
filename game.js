(function() {
    'use strict';

    var Game;

    Game = function(size) {
        this.size = size;
        this.score = 0;
        this.clearedRows = 0;
        this.stage = this.grid(size[0], size[1]);
        this.handleInput = this.handleInput.bind(this);
        this.start();
        this.defaultMove = [0, 1];
    };

    Game.prototype.handleInput = function(e) {
        if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 38) {
            e.preventDefault();
            this.handleAction(e.keyCode);
        }
    };

    Game.prototype.start = function() {
        this.block = new Block(0, 0);
        window.addEventListener('keydown', this.handleInput);
    };

    Game.prototype.stop = function() {
        this.block = null;
        window.removeEventListener('keydown', this.handleInput);
    };


    Game.prototype.grid = function(rows, columns) {
        return this.rows(rows, columns);
    };

    Game.prototype.rows = function(number, columns) {
        var self, arr;
        arr = Array.apply(null, new Array(number));
        self = this;
        return arr.map(function() { return self.columns(columns); });
    };

    Game.prototype.columns = function(number) {
        var arr = Array.apply(null, new Array(number));
        return arr.map(function() { return 0; });
    };

    Game.prototype.handleAction = function(keyCode) {
        var move;

        if (keyCode === 38) {
            this.block.rotate();

            if (this.isOccupied()) {
                this.block.rotate('left');
            }

            if (this.block.rightEdge() >= this.size[0] - 1) {
                this.block.move(-1, 0);
            }

            if (this.block.leftEdge() < 0) {
                this.block.move(1, 0);
            }


            return;
        }

        if (keyCode === 37 && this.block.leftEdge() > 0) {
            move = -1;
        }

        if (keyCode === 39 && this.block.rightEdge() < this.size[0] - 1) {
            move = 1;
        }

        this.block.move(move, 0);

        if (this.isOccupied()) {
            this.block.move(move * -1, 0);
        }
    };

    Game.prototype.advance = function() {
        this.block.move();
    };

    Game.prototype.update = function() {
        if (this.block === null) {
            return;
        }

        if (this.block.bottomEdge() >= this.size[1]) {
            //console.log('bottom');
            this.block.move(0, -1);
            this.setBlock();
            this.block = new Block(0, 0);
            return;
        }

        if (this.isOccupied()) {
            //console.log('new block');
            this.block.move(0, -1);
            this.setBlock();
            this.block = new Block(0, 0);
        }

        if (this.hasReachedTop()) {
            console.log('stop');
            this.stop();
        }
    };

    Game.prototype.clearLines = function() {
        var self, i, j, rows, columns, line;

        self = this;
        line = new Array(this.stage.length);

        for (j = 0, columns = this.stage[0].length; j < columns; j += 1) {
            for (i = 0, rows = this.stage.length; i < rows; i += 1) {
                line[j] = line[j] || 0;
                if (this.stage[i][j] === 1) {
                    line[j] += 1;
                }
            }
        }

        line = line.map(function(l, index) { return l === self.stage.length ? index : null; });
        line = line.filter(function(l) { return l; });

        line.forEach(function(l) {
            self.stage.forEach(function(row, index){
                self.stage[index].splice(l, 1);
                self.stage[index].splice(0, 0, 0);
            });
        });

        this.clearedRows += line.length;
        this.score += 100 * (line.length * line.length)/2;
    };

    Game.prototype.hasReachedTop = function() {
        return this.stage.some(function(node){
            return node[0] === 1;
        });
    };

    Game.prototype.isOccupied = function() {
        var x, y, self;
        self = this;
        return this.block.some(function(node) {
            x = node[0];
            y = node[1];

            if (!self.stage[x]) {
                return false;
            }

            return self.stage[x][y] === 1;
        });
    };

    Game.prototype.setBlock = function() {
        var x, y, self;
        self = this;
        this.block.forEach(function(node){
            x = node[0];
            y = node[1];
            self.stage[x][y] = 1;
        });

        this.clearLines();

    };

    window.Game = Game;

}());
